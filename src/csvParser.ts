import { INestingMap, tokenizeClassifier } from './tokenClassify';

function objCopy(obj: object): object {
  return JSON.parse(JSON.stringify(obj));
}

export function csvDataToJSON(schema: object, rowData: object) {
  const rowNames: string[] = Object.keys(rowData);
  const rowObj = objCopy(schema);
  rowNames.forEach((rowName) => {
    const nestingMap: INestingMap = tokenizeClassifier(rowName);
    let path = rowObj[nestingMap.tokens[0]];
    const nestingSize: number = nestingMap.modes.length;
    for (let i = 1; i < nestingSize - 1; i += 1) { // Last element of nesting corresponds to the data path
      if (nestingMap.modes[i] === 'Object' && nestingSize > 1) {
        path = path[nestingMap.tokens[i]];
      } else if (nestingMap.modes[i] === 'Array' && nestingSize > 1) {
        path = path[parseInt(nestingMap.tokens[i], 10)];
      }
    }
    if (nestingMap.modes[nestingMap.modes[nestingSize - 1]] === 'Object' && nestingSize > 1) {
      path[nestingMap.tokens[nestingSize - 1]] = rowData[rowName];
    } else if (nestingMap.modes[nestingSize - 1] === 'Array' && nestingSize > 1) {
      path[parseInt(nestingMap.tokens[nestingSize - 1], 10)] = rowData[rowName];
    } else if (nestingSize === 1) {
      rowObj[nestingMap.tokens[0]] = rowData[rowName];
    }
  });
  return rowObj;
}
