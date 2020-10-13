import { reduceNode } from './nodesOperations';
import { isTextNode } from './utils';

const extractValue = (node) => {
    const data = reduceNode((innerAcc, innerNode) => {
        const newInnerAcc = innerAcc.slice();
        return isTextNode(innerNode)
            ? [ ...newInnerAcc, innerNode?.data?.trim() ]
            : newInnerAcc;
    }, node, []).join('');
    if (!data) {
        throw new Error('Error during parsing nutrition: can\'t define data value');
    }
    return parseFloat(data.replace(',', '.'));
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
