/**
 * Write a simple delay function with one argument: time to wait (ms).
 * @param {number} milliseconds
 */
export const delayFunction = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
