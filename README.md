# Substring Action  
Retrieves a substring of some input and sets the specified output variable.
This variable can be accessed via `steps.<step_id>.outputs.<output_name>`.

## Building/Testing
`node_modules` are not checked into the repository, because `jest` is used - which has many more 
dependencies.

## Inputs
| name | description | required | default |
|------|-------------|----------|---------|
| value | Value that the substring will be obtained from. | true | - |
| output_name | The step's output variable name from which the substring may be obtained | true | result |
| func_name | Function name to call | true | - |

### Functions
| func_name | parameters | description |
|-----------|------------|-------------|
| length | - | returns length of string |
| substring | start: number, end: number | returns substring from start(inclusive) to end(exclusive) |
| index_of | index_of_str: string | returns index of found string |
| replace | replace_str: string, replace_with_str: string | returns replaced string from replace_str to replace_with_str |

## Outputs
`output_name` - this will be whatever value was provided as the `output_name` on the input or defaults to `result`.

## Example Usage
```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123"
      func_name: "length"
# steps.one.outputs.result = 6 (number)
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123"
      func_name: "substring"
      start: 3
      end: 6
# steps.one.outputs.result = '123' (string)
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123"
      func_name: "substring"
      start: 2
# steps.one.outputs.result = 'c123'
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123"
      func_name: "substring"
      end: 2
# steps.one.outputs.result = 'ab'
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123"
      func_name: "index_of"
      index_of_str: "c1"
# steps.one.outputs.result = 2 (number)
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "c1abc123c1"
      func_name: "index_of"
      index_of_str: "c1"
# steps.one.outputs.result = 0 (number)
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123c1"
      func_name: "replace"
      replace_str: "c1"
      replace_with_str: "1c"
# steps.one.outputs.result = 'ab1c23c1'
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "abc123c1"
      func_name: "replace_all"
      replace_str: "c1"
      replace_with_str: "1c"
# steps.one.outputs.result = 'ab1c231c'
```

```yaml
steps:
  - uses: hottestchilipepper/github-strings-action@v1.0.0
    id: one
    with:
      value: "v1.2.3+42"
      func_name: "split"
      seperator: "+"
# steps.one.outputs.result = ['v1.2.3', '42'] (string[])
```
