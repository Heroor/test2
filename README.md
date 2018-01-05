> 执行上下文 执行环境 作用域 作用域链 函数调用栈 执行队列 执行上下文队列 变量对象 活动对象 解析器interpreter 声明declared

#### **执行上下文(执行环境) Execution Context**：
当前代码所运行在的环境与范围。  
可以分为以下三种环境：
1. **全局上下文：**
    代码运行时第一时间会进入的默认执行环境；
    - 浏览器中的全局上下文是指 `window` 对象；
    - nodejs 中的全局上下文是指 `global` 对象。
2. **函数上下文：**
    函数 `function` 或方法 `method` 在调用时所在的执行环境。
3. **eval上下文：** eval('alert()') 函数创建的执行环境。


#### **函数调用栈(执行上下文栈) Execution Stack：**
首先浏览器中的javascript引擎是单线程，所有的事件和行为都在一个栈结构中储存与调用。

1. js代码开始执行时，首先会进入到全局上下文，全局上下文总是存在于函数调用栈的最底部

2. 当在全局调用一个函数时，执行流程会进入到当前函数内，js引擎会创建一个新的函数执行上下文，压入函数调用栈顶部，在全局上下文之上，并且调用栈(在内存资源充足的情况下)可以压入无限个函数执行上下文

3. 此时如果在一个函数内调用了另一个函数，执行流程便进入被调用的函数，并创建新的执行上下文，将它压入函数调用栈的顶部，调用栈的最顶部此时是当前的执行上下文，在函数执行完毕后，执行上下文在没有被引用的情况下(这里有闭包的问题)，会从调用栈中弹出，并将控制权返回给之前的执行上下文



#### **执行上下文的创建**
可以分为两个阶段：
参考波同学
1. **创建阶段**
    - 创建作用域链
    - 创建变量对象
        - 收集参数
        - 声明函数
        - 声明局部变量
    - [确定 `this` 的指向](#确定指向)

2. 执行阶段
    执行代码


```javascript
execytionContext = {
    'scopeChain': [
        // 当前执行环境的变量对象variableObject
        // 栈中所有父级执行环境的变量对象
    ]
}
```

##### 确定指向
