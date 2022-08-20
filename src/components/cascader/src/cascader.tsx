import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { NodeData } from './node';
import Node from './node';
import Store, { flatNodes } from './store';
import './index.css';

type Nullable<T> = T | null;

interface NodeProps extends Node {
  // 避免 children 重名
  slotLabel?: React.ReactNode;
}
const CascaderNode: FC<Omit<NodeProps, 'isLeaf' | 'doCheck'>> = ({
  checked,
  slotLabel,
}) => {
  // https://zh-hans.reactjs.org/docs/faq-styling.html#how-do-i-add-css-classes-to-components
  let className = 'y-node-content';
  if (checked) {
    className += ' is-active';
  }

  return <div className={className}>{slotLabel}</div>;
};

const CascaderMenu: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="y-menu y-menu--scrollbar">
      <div className="y-menu-wrap y-menu--scrollbar-wrap">{children}</div>
    </div>
  );
};

// ---------------- Casader

interface CasaderProps {
  options: NodeData[];
}
const Casader: FC<CasaderProps> = (props) => {
  const { options = [] } = props;
  const [menus, setMenus] = useState<Node[][]>([]);
  // const menuList = new Store(options);
  const menuList = useMemo(() => new Store(options), [options]);

  useEffect(() => {
    console.log('🏄 # Casader # menuList # useEffect');

    setMenus(() => [[...menuList.getNodes()]]);
    // setMenus([...menus, [...menuList.getNodes()]]);
    // console.log("🏄 ---- useEffect ---- menus", menus);

    // menuList 更新即执行，在这里只会执行两次（开发环境，两次 render）
  }, [menuList]);

  useEffect(() => {
    console.log('🏄 # Casader # useEffect');
    // 每次 render 都会执行
    // 初始化的时候会执行三次：两次 render + 一次 setMenus
  });

  // ---------------- Node

  // 不要直接在 React 的函数作用域直接声明需要复用的变量
  // 因为每次触发 render 后都会重新创建
  // let expandingNode: Nullable<Node> = null;
  const [expandingNode, setExpandingNode] = useState<Nullable<Node>>(null);
  const expandNode = (node: Node) => {
    const newMenus = menus.slice(0, node.level);

    if (expandingNode?.id !== node.id) {
      console.log('---- 展开节点了', node);

      newMenus.push(node.children);
      setExpandingNode(node);
      setMenus([...newMenus]);
    }
  };

  const [checkedNodes, setCheckedsNode] = useState<Node[]>([]);
  const checkNode = (node: Node, checked = false) => {
    const oldNode = checkedNodes[0];
    oldNode?.doCheck(false);
    console.log('🏄 ---- checkNode ---- oldNode', oldNode);

    // 因为 JS 对象的性质，必须要想办法去触发地址的更改，才能让组件 rerender
    const copyMenus = [...menus];
    const checkMenuIdx = node.level - 1;
    const checkNodeIdx = copyMenus[checkMenuIdx].findIndex(
      (n) => n.id === node.id
    );
    // console.log("🏄 ---- checkNode ---- checkMenuIdx", checkMenuIdx);
    // console.log("🏄 ---- checkNode ---- checkNodeIdx", checkNodeIdx);

    copyMenus[checkMenuIdx][checkNodeIdx].doCheck(checked);
    setMenus([...copyMenus]);
    calculateCheckedValue();
  };
  const calculateCheckedValue = () => {
    const newNodes = flatNodes(menus[0], true);
    const getCheckedNodes = newNodes.filter((node) => node.checked);
    setCheckedsNode([...getCheckedNodes]);
  };

  const handleClickNode = (node: Node) => {
    const { isLeaf } = node;

    if (isLeaf) {
      checkNode(node, true);
    } else {
      expandNode(node);
    }
  };

  return (
    <div className="y-cascader--container">
      {menus.map((menu, idx) => (
        // Menu
        <CascaderMenu key={idx}>
          {menu.map((node) => (
            // Node
            <CascaderNode
              key={node.id}
              slotLabel={
                <span
                  className="y-node-label"
                  onClick={() => handleClickNode(node)}
                >
                  {node.label}
                </span>
              }
              {...node}
            />
          ))}
        </CascaderMenu>
      ))}
    </div>
  );
};

export default Casader;
