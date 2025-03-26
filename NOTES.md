# Notes

1. `DEP0040 DeprecationWarning: The `punycode` module is deprecated`
```
Package uses a valid name
(node:2452) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```
- dev dependency
```
└─┬ eslint@9.23.0
  └─┬ ajv@6.12.6
    └─┬ uri-js@4.4.1
      └── punycode@2.3.1
```
- see [eslint issue #17720](https://github.com/eslint/eslint/issues/17720)
