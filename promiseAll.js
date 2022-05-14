/**
 * Try this in browser console. for the examples
 * Rejection
 * promiseAll([Promise.resolve(1), Promise.reject(2)]).then(e => console.log(e)).catch(e => console.log(e))
 * Fullfilment
 * promiseAll([Promise.resolve(1), Promise.resolve(2)]).then(e => console.log(e)).catch(e => console.log(e))
 *
 * @param {array} promises array of promises
 */
export const promiseAll = async (promises) => {
  return await Promise.all(promises);
};
