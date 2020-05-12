export const mapNode = (func, node) => {
  const { children } = node;
  return { ...func(node), children: children.map((n) => mapNode(func, n)) };
};

export const filterNode = (func, node) => {
  if (!func(node)) {
    return null;
  }
  const { children } = node;
  return { ...node, children: children.map((c) => filterNode(func, c)).filter(Boolean) }; // Last
  // filter is for deleting null-s from result set
};

export const reduceNode = (func, node, acc) => {
  const { children } = node;
  const newAcc = func(acc, node);
  if (!children) return newAcc;
  return children.reduce((cAcc, child) => reduceNode(func, child, cAcc), newAcc);
};
