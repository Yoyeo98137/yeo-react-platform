import type { NodeData } from "./node";
import Node from "./node";

/** 扁平目标数组 */
export const flatNodes = (nodes: Node[], leafOnly: boolean) => {
  return nodes.reduce((res, node) => {
    if (node.isLeaf) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
  }, [] as Node[]);
};

class Store {
  nodes: Node[];
  allNodes: Node[];
  leafNodes: Node[];

  constructor(data: NodeData[]) {
    const nodes = (data || []).map((data) => new Node(data));
    this.nodes = nodes;
    this.allNodes = flatNodes(nodes, false);
    this.leafNodes = flatNodes(nodes, true);
  }

  getNodes() {
    return this.nodes;
  }

  getFlattedNodes(leafOnly: boolean) {
    return leafOnly ? this.leafNodes : this.allNodes;
  }
}

export default Store;
