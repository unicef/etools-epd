import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';

export const isJsonStrMatch = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const copy = (a: any) => {
  return JSON.parse(JSON.stringify(a));
};

export const isEmptyObject = (a: any) => {
  if (!a) {
    return true;
  }
  if (isArray(a) && a.length === 0) {
    return true;
  }
  return isObject(a) && Object.keys(a).length === 0;
};
