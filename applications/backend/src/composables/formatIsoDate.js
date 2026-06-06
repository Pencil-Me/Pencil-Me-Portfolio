const parseDate = (value) => {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatIsoDate = (value) => {
  const date = parseDate(value);
  if (!date) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
};

export default formatIsoDate;
