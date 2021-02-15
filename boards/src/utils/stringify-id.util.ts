/**
 * Returns the given object with the converted to string ObjectId field
 * @param {Record<string, any>} item
 * @param {string} field
 * @returns {Record<string, any>}
 */
export default (item: Record<string, any>, field: string = '_id'): Record<string, any> => {
  return {
    ...item,
    [field]: item[field].toString()
  }
};