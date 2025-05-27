const titleCase = (value) => {
  if (!value) return "";
  return `${value[0]?.toLocaleUpperCase()}${value.slice(1)}`;
};

export default titleCase;
