export const randomFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDateWithinHours = (hoursAgo = 6) => {
  const now = new Date();
  const past = new Date(
    now.getTime() - randomInt(1, hoursAgo) * 60 * 60 * 1000
  );
  return past.toISOString();
};