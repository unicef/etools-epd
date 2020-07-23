export const isJsonStrMatch = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const copy = (a: any) => {
  return JSON.parse(JSON.stringify(a));
};
