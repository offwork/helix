import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // DDD Domain Boundaries
            {
              sourceTag: 'domain:document',
              onlyDependOnLibsWithTags: ['domain:document']
            },
            {
              sourceTag: 'domain:editor',
              onlyDependOnLibsWithTags: ['domain:editor', 'domain:document']
            },
            {
              sourceTag: 'domain:extension',
              onlyDependOnLibsWithTags: ['domain:extension', 'domain:document', 'domain:editor']
            },
            {
              sourceTag: 'domain:serialization',
              onlyDependOnLibsWithTags: ['domain:serialization', 'domain:document']
            }
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
