export const rainbowColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * rainbowColors.length);
  return rainbowColors[randomIndex];
};
