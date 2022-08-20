export interface NodeData {
  label: string;
  value: string;
  leaf?: boolean;
  children?: NodeData[];
}

let uid = 0;

class Node {
  readonly id = uid++;
  readonly level: number;
  readonly label: string;
  readonly value: string;

  childrenData: NodeData[];
  children: Node[];

  checked = false;

  constructor(readonly data: NodeData, readonly parent?: Node) {
    const _children = data.children!;

    this.level = parent ? parent.level + 1 : 1;
    this.label = data.label;
    this.value = data.value;

    this.childrenData = _children;
    this.children = (_children || []).map((node) => new Node(node, this));
  }

  get isLeaf() {
    const { data, children } = this;
    const isLeaf = data?.leaf;
    return !!isLeaf || !children.length;
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return;
    this.checked = checked;
  }
}

export default Node;
