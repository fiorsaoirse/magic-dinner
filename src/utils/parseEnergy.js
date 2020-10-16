import { isTextNode, reduceNode } from './nodesUtils';

const extractValue = (node) => {
    const findTextValue = (innerAcc, innerNode) => (isTextNode(innerNode)
        ? [ ...innerAcc, innerNode?.data?.trim() ]
        : innerAcc);
    const data = reduceNode(findTextValue, node, []).join('').replace(',', '.');
    if (!data) {
        throw new Error('Error during parsing nutrition: can\'t define data value');
    }
    return parseFloat(data);
};

/* eslint-disable quote-props */
// noinspection NonAsciiCharacters
const energyTypes = {
    'калорийность': (obj, node) => ({ ...obj, calories: extractValue(node) }),
    'белки': (obj, node) => ({ ...obj, proteins: extractValue(node) }),
    'жиры': (obj, node) => ({ ...obj, fat: extractValue(node) }),
    'углеводы': (obj, node) => ({ ...obj, carbs: extractValue(node) }),
};

export default (energy) => energyTypes[energy];
