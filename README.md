> 执行上下文 执行环境 作用域 作用域链 函数调用栈 执行队列 执行上下文队列 变量对象 活动对象 解析器interpreter 声明declared
> 执行上下文是动态的，作用域是静态的，两者是不一样的

> 函数的执行环境会在调用时才创建，不同的调用方式(比如call、apply)执行环境也会不同，也就是说一个函数的执行环境不是固定的，是可能会变的，执行环境的改变会导致this指向的改变；而函数作用域是在定义函数时就确定了，全局就是全局的，局部就是局部的，不会再改变了，如果这个函数被赋值给一个变量或对象的方法后(函数在其他地方被引用)，函数调用者就不一定是之前的了，所以函数中的this会发生变化，但是函数内变量查找的规则还是会**回到**这个函数体被定义的地方根据作用域链向上查找

## **执行上下文(执行环境) Execution Context**：
当前代码所运行在的环境与范围。

可以分为以下三种情况：
1. **全局上下文：**
  代码运行时第一时间会进入的默认执行环境；
  - 浏览器 中的全局上下文指 `window` 对象；
  - nodejs 中的全局上下文指 `global` 对象。
2. **函数上下文：**
  函数 `function` 或方法 `method` 在调用时所在的执行环境。
3. **eval上下文：** eval() 函数创建的执行环境。


## **函数调用栈(执行上下文栈) Execution Stack：**
首先浏览器中的javascript引擎是单线程，所有的事件和行为都在一个栈结构中储存与调用。

1. js代码开始执行时，首先会进入到**全局上下文**，全局上下文总是存在于函数调用栈的最底部

2. 当在全局调用一个**函数**时，执行流程会进入到当前函数内，js引擎会创建一个新的函数执行上下文，压入函数调用栈顶部，在全局上下文之上，并且调用栈(在内存资源充足的情况下)可以压入无限个函数执行上下文

3. 此时如果在一个函数内调用了另一个函数，执行流程便进入被调用的函数，并创建新的执行上下文，将它压入函数调用栈的顶部，调用栈的最顶部此时是新创建的执行上下文，在函数执行完毕时，执行上下文在没有被引用的情况下(这里有闭包的问题)，js引擎会将它从调用栈中弹出，并将控制权返回给之前的执行上下文



## **执行上下文的创建**
可以分为两个阶段：
参考波同学
1. **创建阶段**

    在执行代码之前会先创建执行上下文：
  - [初始化作用域链](#初始化作用域链)
  - [创建变量对象](#创建变量对象)
    - 收集函数的参数
    - 声明函数
    - 声明局部变量
  - [确定 `this` 的指向](#this的指向)

2. **执行阶段**

    执行代码


执行上下文示意：
```javascript
execytionContext = {
  'scopeChain': [
    // 当前执行环境的变量对象variableObject
    // 栈中所有父级执行环境的变量对象
  ]
}
```






### 创建变量对象
在创建执行上下文时，会创建**变量对象**，变量对象包括以下几个内容：
1. 创建函数的**参数对象 `arguments object`**，检查参数的上下文，初始化参数的变量名和值
    这里会导致参数中的变量会在 `var` `let` `const`等主动声明的变量之前创建, 默认为 `undefined`：
    ```JavaScript
    function foo (arg) {
        function arg () {}
        console.log(arg)
    }
    foo();  // ƒ arg() {}
    foo(1);  // ƒ arg() {}
    ```
    ```JavaScript
    function foo (arg) {
        function arg () {}
        console.log(arg)
    }
    foo();  // ƒ arg() {}
    foo(1);  // ƒ arg() {}
    ```

2. 扫描上下文中的**函数声明**，每找到一个函数声明，就在变量对象中创建一个同名属性，它保存了函数内存地址的引用，如果函数已存在，引用将会被覆盖。

3. 扫描上下文中的**变量声明**，每找到一个变量声明，就会在变量对象中创建一个属性，并将它初始化为 `undefined`，(这也就是为什么当我们声明一个变量后未赋值时，立即访问它会是 `undefined`的原因)如果发现重新声明的变量，则会忽略它。





### this的指向
- 首先 **全局作用域** 中的 `this` 永远指向的是全局对象，浏览器中为 `window`对象，nodejs中为 `global`对象

- **函数作用域** 中 `this` 的指向是在创建执行上下文时被确立的，默认指向的是调用此函数的对象，所以决定 `this` 指向的关键就是——**函数是如何调用的**

    函数的调用有多种情况：
1. **全局函数调用**

    在**全局作用域**中调用函数时，并没有对象在调用这个函数，`this` 本会是 `undefined`，但是会默认隐式指向**全局对象**：
    ```javascript
    function foo () {
      console.log(this)
    }
    foo() // Window {...}
    ```

    而使用了 **严格模式 `"use strict"`** ，`this` 将会是被指定的值；如果未指定，它会是 **`undefine`**：
    ```javascript
    'use strict'
    function foo () {
      console.log(this);
    }
    foo(); // undefined
    ```

    > 在[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#Securing_JavaScript)下通过 `this` 传递给一个函数的值不会被强制转换为一个对象。对一个普通的函数来说，`this` 总会是一个对象：不管调用时 `this` 它本来就是一个对象；还是用布尔值，字符串或者数字调用函数时函数里面被封装成对象的 `this`；还是使用 `undefined` 或者 `null` 调用函数时this代表的全局对象（使用call, apply或者bind方法来指定一个确定的this）。这种自动转化为对象的过程不仅是一种性能上的损耗，同时在浏览器中暴露出全局对象也会成为安全隐患，因为全局对象提供了访问那些所谓安全的JavaScript环境必须限制的功能的途径。所以对于一个开启严格模式的函数，指定的 `this` 不再被封装为对象，而且如果没有指定 `this` 的话它值是 `undefined` ：
    > ```javascript
    > function fun() { return this; }
    > console.log(fun()); // Window{...}
    > console.log(fun.call(2)); // Number {2}
    > console.log(fun.apply(null)); // Window {...}
    > console.log(fun.call(undefined)); // Window {...}
    > console.log(fun.bind(true)()); // Boolean {true}
    > ```
    > ```javascript
    > "use strict";
    > function fun() { return this; }
    > console.assert(fun() === undefined);
    > console.assert(fun.call(2) === 2);
    > console.assert(fun.apply(null) === null);
    > console.assert(fun.call(undefined) === undefined);
    > console.assert(fun.bind(true)() === true);
    > ```

2. **对象方法调用**

    函数在对象中通常叫做方法，调用一个对象的方法时，方法中的 `this` 指向的就是这个调用它的对象：
    ```JavaScript
    let cat = {
      nickName: 'meow',
      say: function () {
        console.log(this.nickName)
      }
    }
    cat.say() // 'meow'   this指向了cat对象，并可以访问对象的属性
    ```

    同样，在对象之外定义的函数被设置为对象的方法时，`this` 的指向会跟着转变：
    ```JavaScript
    var nickName = 'zoo' // var会声明为全局对象中的属性
    function say () {
      console.log(this.nickName)
    }
    let dog = {
      nickName: 'wang',
      say
    }
    let cat = {
      nickName: 'meow',
      say
    }
    say()     // 'zoo'    this指向window
    cat.say() // 'meow'   this指向cat
    dog.say() // 'wang'   this指向dog
    ```

3. **构造函数调用**

    `new` 操作符将函数通过构造函数的形式调用，它会创建一个新对象来作为构造函数的实例，将构造函数中的 `this` 指向这个实例并隐式返这个实例：
    ```javascript
    function Animal (name) {
      this.name = name  // this指向实例
      this.color = "white"
      // 隐式返回了实例
    }
    console.log(new Animal('cat'))  // 构造函数调用   {name: "cat", color: "white"}
    Animal() // 函数调用
    ```

4. **使用 `call` `apply` `bind` 调用**

    `call` `apply` `bind` 属于函数自身的方法，用以改变 `this` 的指向，

    foo.call(undefined)
    foo.call(null)

5. **ES6中箭头函数的this**

