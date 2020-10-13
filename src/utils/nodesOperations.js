export const mapNode = (func, node) => {
    const { children } = node;
    return { ...func(node), children: children.map((n) => mapNode(func, n)) };
};

export const filterNode = (func, node) => {
    if (!func(node)) {
        return null;
    }
    const { children } = node;
    return { ...node, children: children.map((c) => filterNode(func, c)).filter(Boolean) };
};

export const reduceNode = (func, node, acc) => {
    const { children } = node;
    const newAcc = func(acc, node);
    if (!children) return newAcc;
    return children.reduce((cAcc, child) => reduceNode(func, child, cAcc), newAcc);
};

export const findByPredicate = (func, node) => {
    if (func(node)) {
        return node;
    }
    const { children } = node;
    if (children?.length) {
        const [ result ] = children
            .reduce((acc, child) => [ ...acc, findByPredicate(func, child) ], [])
            .filter(Boolean);
        return result;
    }
    return null;
};
