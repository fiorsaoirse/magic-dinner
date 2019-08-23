const reduceNode = (func, node, acc) => {
  const { children } = node;
  const newAcc = func(acc, node);
  if (!children) return newAcc;
  return children.reduce((cAcc, child) => reduceNode(func, child, cAcc), newAcc);
};

export default reduceNode;
