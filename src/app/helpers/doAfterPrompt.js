export default (callback, ...args) => {
  const prompt = 'Czy podjąć decyzję?';

  if (window.confirm(prompt)) {
    callback(...args);
  }
};
