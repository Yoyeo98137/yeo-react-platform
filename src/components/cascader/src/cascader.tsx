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
  // é¿å children éå
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
    console.log('ð # Casader # menuList # useEffect');

    setMenus(() => [[...menuList.getNodes()]]);
    // setMenus([...menus, [...menuList.getNodes()]]);
    // console.log("ð ---- useEffect ---- menus", menus);

    // menuList æ´æ°å³æ§è¡ï¼å¨è¿éåªä¼æ§è¡ä¸¤æ¬¡ï¼å¼åç¯å¢ï¼ä¸¤æ¬¡ renderï¼
  }, [menuList]);

  useEffect(() => {
    console.log('ð # Casader # useEffect');
    // æ¯æ¬¡ render é½ä¼æ§è¡
    // åå§åçæ¶åä¼æ§è¡ä¸æ¬¡ï¼ä¸¤æ¬¡ render + ä¸æ¬¡ setMenus
  });

  // ---------------- Node

  // ä¸è¦ç´æ¥å¨ React çå½æ°ä½ç¨åç´æ¥å£°æéè¦å¤ç¨çåé
  // å ä¸ºæ¯æ¬¡è§¦å render åé½ä¼éæ°åå»º
  // let expandingNode: Nullable<Node> = null;
  const [expandingNode, setExpandingNode] = useState<Nullable<Node>>(null);
  const expandNode = (node: Node) => {
    const newMenus = menus.slice(0, node.level);

    if (expandingNode?.id !== node.id) {
      console.log('---- å±å¼èç¹äº', node);

      newMenus.push(node.children);
      setExpandingNode(node);
      setMenus([...newMenus]);
    }
  };

  const [checkedNodes, setCheckedsNode] = useState<Node[]>([]);
  const checkNode = (node: Node, checked = false) => {
    const oldNode = checkedNodes[0];
    oldNode?.doCheck(false);
    console.log('ð ---- checkNode ---- oldNode', oldNode);

    // å ä¸º JS å¯¹è±¡çæ§è´¨ï¼å¿é¡»è¦æ³åæ³å»è§¦åå°åçæ´æ¹ï¼æè½è®©ç»ä»¶ rerender
    const copyMenus = [...menus];
    const checkMenuIdx = node.level - 1;
    const checkNodeIdx = copyMenus[checkMenuIdx].findIndex(
      (n) => n.id === node.id
    );
    // console.log("ð ---- checkNode ---- checkMenuIdx", checkMenuIdx);
    // console.log("ð ---- checkNode ---- checkNodeIdx", checkNodeIdx);

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
