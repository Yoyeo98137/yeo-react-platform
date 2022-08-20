## 笔记

### 两次渲染

**为什么组件 “渲染” 了两次？**

这其实是官方的 “刻意为之”：  
https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects

假设在组件代码加上了打印，就会发现每次触发事件时都会打印两次：
```TSX
console.log('render');
return <div onClick={onClick}>{state}</div>;
```

这段代码会被转换成：
```TSX
console.log('render');
return /*#__PURE__*/_react.default.createElement("div", {
  className: "button",
  onClick: onClick
}, state);
```

很明显，`console.log` 和渲染函数完全是分开的，打印的触发并不能直接代表视图也一起更新了。  
那为什么会出现这额外的一次代码执行呢？其实是 React 官方会在开发模式下刻意的进行多一次渲染，这会有助于开发者更容易发现一些具有副作用的代码 Bug。

所以这里组件代码执行了两次并不直接代码组件更新了两次：
- 执行代码和渲染函数 `render` 的执行时分开的
- 在严格模式下的开发环境 React 确实会进行两次渲染，以更容易的发现一些潜在问题。不用担心会出现额外的代码逻辑，这在生产模式下会被恢复正常

### 函数式组件

#### 类型定义

> https://blog.csdn.net/weixin_40920953/article/details/122509037  
> https://juejin.cn/post/7090812134023495688  
> https://mzvast.github.io/posts/2020-09-22-2332-react-fc  
> 
> 参考几篇文章，从 `react@18` 开始 `React.FC` 就不再自带 Props `children` 了，所以现在定义函数式组件 Props 的时候，仍然需要显式的去指定 `children` 属性（毕竟也不是所有函数式组件都需要子节点），或者去组合它。

##### FC + PropsWithChildren

> 写法上跟直接声明类型没什么不同，但是 FC 还内置提供了如 `propTypes`、`defaultProps` 的定义

```TSX
import React, { FC, PropsWithChildren } from "react";

export interface TodoProps {
  value: string;
}

const TodoComponent: FC<PropsWithChildren<TodoProps>> = ({
  value,
  children,
}) => {
  return (
    <div>
      <span>is Todo {value}</span>
      {children}
    </div>
  );
};
```

### Hook

> Hook 是 React 16.8 的新增特性。

Hook 使你在非 `class` 的情况下可以使用更多的 React 特性。 从概念上讲，React 组件一直更像是函数，而 Hook 则拥抱了函数。

#### useEffect

```TSX
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

传递给 `useEffect` 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 `effect` 中获取最新的 `count` 的值，而不用担心其过期的原因。

#### useMemo

```TSX
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

把 “创建” 函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

> - 某个依赖项改变时才重新计算 相当熟悉的概念（Vue 的计算属性）
> - 这里的 `memoized` 指的就是通过创建函数执行后输出的结果值

什么场景需要使用呢？

> 参考：https://zhuanlan.zhihu.com/p/147173462

假如你需要定义一个依赖某个状态而创建的非状态变量，如果是直接通过声明的方式创建的话，在每次 `rerender` 期间，这个非状态变量就会被重复创建，而 `Memo` 就能为这个变量提供一个缓存的空间。