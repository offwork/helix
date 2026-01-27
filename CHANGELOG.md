# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - YYYY-MM-DD

### Added
- Document domain value objects (Mark, MarkSet, Position, ResolvedPos, Slice, ContentMatch)
- Document domain entities (Node, Fragment)
- NodeType and MarkType value objects
- SchemaService for type registry
- Full test coverage for all components

### Changed
- Fragment.size renamed to childCount (Node.nodeSize dependency)

### Fixed
- ContentMatch.allowsMark moved to NodeType.allowsMarkType