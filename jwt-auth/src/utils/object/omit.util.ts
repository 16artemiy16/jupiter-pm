export const omit = (obj: Record<string, any>, exclude: string | string[]): Record<string, any> => {
  const objCopy = { ...obj };
  const itemsToExclude = Array.isArray(exclude) ? [...exclude] : [exclude];


  itemsToExclude.forEach((item) => delete objCopy[item]);
  return objCopy;
};