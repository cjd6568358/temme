## 赋值

### 语法

赋值语句的左侧是 `$` 开头的变量名，右侧支持以下形式：

| 形式 | 示例 | 说明 |
|------|------|------|
| 字面量 | `$foo = 123;` | 支持 string, number, null, boolean, RegExp |
| 字面量 + 过滤器 | `$foo = "123"\|Number;` | 对字面量应用过滤器后再赋值 |
| 变量引用 | `$foo = $bar;` | 将一个变量的值赋给另一个变量 |
| 变量引用 + 过滤器 | `$foo = $bar\|first;` | 对变量值应用过滤器后再赋值，支持链式过滤如 `$bar\|split(",")\|first` |

> **注意：** 变量引用时，源变量必须在赋值语句之前已被捕获或赋值，因为选择器是从上到下、从左到右依次执行的。

### 运行时行为

赋值的含义取决于该语法结构所在的上下文：

- 在顶层中，`$foo = 'bar';` 表示将字符串 bar 放到最终结果的 foo 字段
- 在花括号中，`div.foo{ $a = null }` 像是一个条件赋值，如果有一个元素满足选择器 `div.foo`，那么就执行该赋值操作；
- 在数组匹配的子选择器中，`li@list { $x = 123; }` 意味着数组匹配结果中每个数组元素的 x 字段的值都为数字 `123`。
- 子选择器可以访问父级作用域中的变量，因此可以在子选择器中引用父级捕获的变量。

### 例子

```html
<!-- 下面用到的 html 的内容 -->
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

#### 字面量 + 过滤器

```JavaScript
temme(html, `
li@array {
  $id = "001"|Number;
};`)
//=> { "array": [{ "id": 1 }, { "id": 1 }, { "id": 1 }] }
```

#### 变量引用 + 过滤器

```JavaScript
temme(html, `
$title = 'hello world';
li@array {
  $firstWord = $title|split(' ')|first;
};`)
//=> { "title": "hello world", "array": [{ "firstWord": "hello" }, ...] }
```
