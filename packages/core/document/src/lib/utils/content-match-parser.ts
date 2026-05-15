import { ContentMatch } from '../value-objects/ContentMatch';
import { NodeType } from '../value-objects/NodeType';

export class TokenStream {
  inline: boolean | null = null;
  pos = 0;
  tokens: string[] = [];
  readonly string: string;
  readonly nodeTypes: { readonly [name: string]: NodeType };

  constructor(
    string: string,
    nodeTypes: { readonly [name: string]: NodeType }
  ) {
    this.tokens = string.split(/\s*(?=\b|\W|$)/);
    if (this.tokens.length && this.tokens[this.tokens.length - 1] === '') {
      this.tokens.pop();
    }

    if (this.tokens.length && this.tokens[0] === '') {
      this.tokens.shift();
    }

    this.string = string;
    this.nodeTypes = nodeTypes;
  }

  get next(): string | undefined {
    return this.tokens[this.pos];
  }

  eat(tok: string): boolean {
    return this.next === tok && (this.pos++, true);
  }

  err(str: string): never {
    throw new SyntaxError(`ContentMatch parse error: ${str}`);
  }
}

type Expr =
  | { type: 'choice'; exprs: Expr[] }
  | { type: 'seq'; exprs: Expr[] }
  | { type: 'plus'; expr: Expr }
  | { type: 'star'; expr: Expr }
  | { type: 'opt'; expr: Expr }
  | { type: 'range'; min: number; max: number; expr: Expr }
  | { type: 'name'; value: NodeType };

/**
 * Reads the next token from the stream as a number.
 * Used to parse min/max values in range expressions (e.g. `{2,4}`).
 *
 * @param stream - The token stream to read from.
 * @returns The parsed number.
 * @throws {SyntaxError} If the next token is not a valid number.
 */
function parseNum(stream: TokenStream): number {
  const next = stream.next;
  if (next == null || /\D/.test(next)) {
    stream.err(`Expected number, got '${next}'`);
  }

  const result = Number(next);
  stream.pos++;
  return result;
}

/**
 * Resolves a name token to one or more NodeType instances.
 * The name can be either a direct node type name (e.g. `paragraph`)
 * or a group name (e.g. `inline`, `block`) that expands to multiple types.
 *
 * @param stream - The token stream, used for nodeTypes lookup and error reporting.
 * @param name - The name token to resolve.
 * @returns An array of matching NodeType instances.
 * @throws {SyntaxError} If no node type or group with the given name exists.
 */
function resolveName(stream: TokenStream, name: string): readonly NodeType[] {
  const types = stream.nodeTypes;
  const type = types[name];
  if (type) return [type];

  const result: NodeType[] = [];
  for (const typeName in types) {
    if (types[typeName].isInGroup(name)) result.push(types[typeName]);
  }

  if (result.length === 0) stream.err(`No node type or group '${name}' found`);

  return result;
}

/**
 * Parses an atomic expression — either a parenthesized group or a node type name.
 * Sets `stream.inline` on first name encounter to detect inline/block mixing.
 *
 * @param stream - The token stream to read from.
 * @returns The parsed `Expr` node.
 * @throws {SyntaxError} If a closing paren is missing, inline/block types are mixed,
 *   or an unexpected token is encountered.
 */
function parseExprAtom(stream: TokenStream): Expr {
  if (stream.eat('(')) {
    const expr = parseExpr(stream);
    if (!stream.eat(')')) stream.err('Missing closing paren');
    return expr;
  } else if (stream.next && !/\W/.test(stream.next)) {
    const exprs = resolveName(stream, stream.next).map((type) => {
      if (stream.inline == null) stream.inline = type.isInline;
      else if (stream.inline !== type.isInline)
        stream.err('Mixing inline and block content');
      return { type: 'name', value: type } as Expr;
    });
    stream.pos++;
    return exprs.length === 1 ? exprs[0] : { type: 'choice', exprs };
  } else {
    stream.err(`Unexpected token '${stream.next}'`);
  }
}

/**
 * Parses a range quantifier expression `{min}` or `{min,max}` or `{min,}`.
 * Called after `{` has been consumed by `parseExprSubscript`.
 *
 * @param stream - The token stream to read from.
 * @param expr - The expression the range quantifier applies to.
 * @returns A `range` Expr node with `min`, `max` (-1 means unbounded), and `expr`.
 * @throws {SyntaxError} If the range syntax is malformed or closing `}` is missing.
 */
function parseExprRange(stream: TokenStream, expr: Expr): Expr {
  const min = parseNum(stream);
  let max = min;
  if (stream.eat(',')) {
    if (stream.next !== '}') max = parseNum(stream);
    else max = -1;
  }
  if (!stream.eat('}')) stream.err('Unclosed braced range');
  return { type: 'range', min, max, expr };
}

/**
 * Parses an expression followed by optional quantifier suffixes:
 * `+` (one or more), `*` (zero or more), `?` (optional), or `{min,max}` (range).
 * Multiple quantifiers are not allowed — loop breaks after first match.
 *
 * @param stream - The token stream to read from.
 * @returns The parsed `Expr` node, wrapped in a quantifier if present.
 */
function parseExprSubscript(stream: TokenStream): Expr {
  let expr = parseExprAtom(stream);
  for (;;) {
    if (stream.eat('+')) expr = { type: 'plus', expr };
    else if (stream.eat('*')) expr = { type: 'star', expr };
    else if (stream.eat('?')) expr = { type: 'opt', expr };
    else if (stream.eat('{')) expr = parseExprRange(stream, expr);
    else break;
  }
  return expr;
}

/**
 * Parses a sequence of expressions separated by whitespace.
 * Stops at `)` or `|` tokens, which belong to outer parse levels.
 *
 * @param stream - The token stream to read from.
 * @returns A `seq` Expr node, or the single expression if only one item.
 */
function parseExprSeq(stream: TokenStream): Expr {
  const exprs: Expr[] = [];
  do {
    exprs.push(parseExprSubscript(stream));
  } while (stream.next && stream.next !== ')' && stream.next !== '|');
  return exprs.length === 1 ? exprs[0] : { type: 'seq', exprs };
}

/**
 * Parses a full content expression, handling `|` (choice) at the top level.
 * Entry point for the recursive descent parser.
 *
 * @param stream - The token stream to read from.
 * @returns A `choice` Expr node, or the single expression if only one alternative.
 */
export function parseExpr(stream: TokenStream): Expr {
  const exprs: Expr[] = [];
  do {
    exprs.push(parseExprSeq(stream));
  } while (stream.eat('|'));
  return exprs.length === 1 ? exprs[0] : { type: 'choice', exprs };
}

/**
 * Represents a single edge in the NFA graph.
 * `term` undefined means an ε (epsilon) edge — no input consumed.
 * `to` is the index of the target state in the NFA array.
 */
type Edge = { term: NodeType | undefined; to: number | undefined };

/**
 * Builds a Nondeterministic Finite Automaton (NFA) from a parsed content expression.
 * The NFA is an array of states, each being an array of edges.
 * State 0 is the entry state, last state is the success state.
 *
 * @param expr - The parsed content expression AST.
 * @returns An array of NFA states.
 */
export function nfa(expr: Expr): Edge[][] {
  const nfa: Edge[][] = [[]];
  connect(compile(expr, 0), node());
  return nfa;

  function node() {
    return nfa.push([]) - 1;
  }

  function edge(from: number, to?: number, term?: NodeType): Edge {
    const e = { term, to };
    nfa[from].push(e);
    return e;
  }

  function connect(edges: Edge[], to: number): void {
    edges.forEach((e) => (e.to = to));
  }

  function compile(expr: Expr, from: number): Edge[] {
    if (expr.type === 'choice') {
      return expr.exprs.reduce(
        (out, e) => out.concat(compile(e, from)),
        [] as Edge[]
      );
    } else if (expr.type === 'seq') {
      for (let i = 0; ; i++) {
        const next = compile(expr.exprs[i], from);
        if (i === expr.exprs.length - 1) return next;
        connect(next, (from = node()));
      }
    } else if (expr.type === 'star') {
      const loop = node();
      edge(from, loop);
      connect(compile(expr.expr, loop), loop);
      return [edge(loop)];
    } else if (expr.type === 'plus') {
      const loop = node();
      connect(compile(expr.expr, from), loop);
      connect(compile(expr.expr, loop), loop);
      return [edge(loop)];
    } else if (expr.type === 'opt') {
      return [edge(from)].concat(compile(expr.expr, from));
    } else if (expr.type === 'range') {
      let cur = from;
      for (let i = 0; i < expr.min; i++) {
        const next = node();
        connect(compile(expr.expr, cur), next);
        cur = next;
      }
      if (expr.max === -1) {
        connect(compile(expr.expr, cur), cur);
      } else {
        for (let i = expr.min; i < expr.max; i++) {
          const next = node();
          edge(cur, next);
          connect(compile(expr.expr, cur), next);
          cur = next;
        }
      }
      return [edge(cur)];
    } else if (expr.type === 'name') {
      return [edge(from, undefined, expr.value)];
    } else {
      throw new Error('Unknown expr type');
    }
  }
}

/**
 * Collects all NFA states reachable from `node` via ε (epsilon) edges.
 * Single ε-only states are skipped to avoid redundant DFA nodes.
 *
 * @param nfa - The full NFA state array.
 * @param node - The starting NFA state index.
 * @returns Sorted array of reachable state indices.
 */
function nullFrom(nfa: Edge[][], node: number): readonly number[] {
  const result: number[] = [];

  function scan(node: number): void {
    const edges = nfa[node];
    if (edges.length === 1 && !edges[0].term && edges[0].to !== undefined)
      return scan(edges[0].to);
    result.push(node);
    for (const { term, to } of edges) {
      if (!term && to !== undefined && result.indexOf(to) === -1) scan(to);
    }
  }

  scan(node);
  return result.sort((a, b) => b - a);
}

/**
 * Converts an NFA into a DFA represented as a ContentMatch graph.
 * Each DFA state corresponds to a set of NFA states.
 * A DFA state is a valid end if it contains the NFA's final state.
 *
 * @param nfa - The NFA to convert.
 * @returns The root ContentMatch node of the resulting DFA.
 */
export function dfa(nfa: Edge[][]): ContentMatch {
  const labeled: Record<string, ContentMatch> = Object.create(null);
  return explore(nullFrom(nfa, 0));

  function explore(states: readonly number[]): ContentMatch {
    const out: [NodeType, number[]][] = [];
    states.forEach((node) => {
      nfa[node].forEach(({ term, to }) => {
        if (!term || to === undefined) return;
        let set: number[] | undefined;
        for (let i = 0; i < out.length; i++)
          if (out[i][0] === term) set = out[i][1];
        nullFrom(nfa, to).forEach((node) => {
          if (!set) out.push([term, (set = [])]);
          if (set.indexOf(node) === -1) set.push(node);
        });
      });
    });

    const state = (labeled[states.join(',')] = new ContentMatch(
      states.indexOf(nfa.length - 1) > -1,
      []
    ));

    for (const [term, nextStates] of out) {
      const sorted = nextStates.sort((a, b) => b - a);
      state.edges.push({
        type: term,
        next: labeled[sorted.join(',')] || explore(sorted),
      });
    }

    return state;
  }
}

/**
 * Validates that all states in the DFA have at least one generatable path.
 * A "dead end" is a state that is not a valid end and has no edges leading
 * to generatable node types (non-text, no required attrs).
 *
 * @param match - The root ContentMatch (DFA) to validate.
 * @param stream - The token stream, used for error reporting.
 * @throws {SyntaxError} If a dead-end state is found.
 */
export function checkForDeadEnds(match: ContentMatch, stream: TokenStream): void {
  const work = [match];
  for (let i = 0; i < work.length; i++) {
    const state = work[i];
    let dead = !state.validEnd;
    const nodes: string[] = [];

    for (const { type, next } of state.edges) {
      nodes.push(type.name);
      if (dead && !(type.isText || type.hasRequiredAttrs())) dead = false;
      if (work.indexOf(next) === -1) work.push(next);
    }

    if (dead) {
      stream.err(
        `Only non-generatable nodes (${nodes.join(
          ', '
        )}) in a required position`
      );
    }
  }
}
