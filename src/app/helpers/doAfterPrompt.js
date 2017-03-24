export default (callback, ...args) => {
  const prompt = 'Czy podjąć decyzję?';

  if (confirm(prompt)) {
    callback(...args);
  }
};
