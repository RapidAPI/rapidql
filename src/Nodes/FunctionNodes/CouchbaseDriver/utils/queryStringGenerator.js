module.exports = (obj) => {
  if (!obj) return "";
  return Object.keys(obj).map(val => `${val} = "${obj[val]}"`).join("AND");
};
