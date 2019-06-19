export const getMinifiedJson = (str) => {
  try {
    return JSON.stringify(JSON.parse(str));
  } catch (e) {
    return null;
  }
};

export const getPrettyJson = (str) => {
  try {
    return JSON.stringify(JSON.parse(str), null, '  ');
  } catch (e) {
    return null;
  }
};
