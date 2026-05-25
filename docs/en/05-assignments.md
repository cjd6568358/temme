## Assignments

### Syntax

Assignment statements use a variable on the left-hand side and support the following forms on the right-hand side:

| Form | Example | Description |
|------|---------|-------------|
| Literal | `$foo = 123;` | Supports `string`, `number`, `null`, `boolean`, `RegExp` |
| Literal + filter | `$foo = "123"|Number;` | Apply filters to a literal before assignment |
| Variable reference | `$foo = $bar;` | Assign the value of one variable to another |
| Variable reference + filter | `$foo = $bar|first;` | Apply filters to a variable value before assignment; supports chained filters like `$bar|split(",")|first` |

> **Note:** when referencing another variable, the source variable must have been captured or assigned earlier. Selectors execute from top to bottom, left to right.

### Running semantics

The meaning of an assignment depends on its context:

- At the top level, `$foo = 'bar';` places the string `bar` into the final result under `foo`.
- Inside braces, `div.foo{ $a = null }` behaves like a conditional assignment: if an element matches the selector `div.foo`, the assignment is executed.
- In a child selector for array matching, `li@list { $x = 123; }` means each element in the matched `list` array receives `123` for its `x` field.
- Child selectors can access variables from the parent scope, so a child selector can reference variables captured by its parent.

### Examples

```html
<!-- html used below -->
<ul>
  <li data-fruit-id="1">
    <span data-color="red">apple</span>
  </li>
  <li data-fruit-id="2">
    <span data-color="white">pear</span>
  </li>
  <li data-fruit-id="3">
    <span data-color="purple">grape</span>
  </li>
</ul>
```

```JavaScript
temme(html, `
$top = 'level';
ul { $hasUlElement = true };
div { $hasDivElement = true };

li@array {
  $row = true;
  $isPurple = false;
  [data-color=purple]{ $isPurple = true };
};`)
//=>
// {
//   "top": "level",
//   "hasUlElement": true,
//   "array": [
//     { "row": true, "isPurple": false },
//     { "row": true, "isPurple": false },
//     { "row": true, "isPurple": true }
//   ]
// }
```

#### Literal + filter

```JavaScript
temme(html, `
li@array {
  $id = "001"|Number;
};`)
//=> { "array": [{ "id": 1 }, { "id": 1 }, { "id": 1 }] }
```

#### Variable reference + filter

```JavaScript
temme(html, `
$title = 'hello world';
li@array {
  $firstWord = $title|split(' ')|first;
};`)
//=> { "title": "hello world", "array": [{ "firstWord": "hello" }, ...] }
```

