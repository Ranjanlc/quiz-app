export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
export const reportTeller = (scored, total) => {
  if (scored / total <= 0.4) {
    return `Sheesh!You have minimal knowledge about the topic.`;
  }
  if (scored / total <= 0.5) {
    return `Common,you can better your score.`;
  }
  if (scored / total <= 0.7) {
    return `Yeah,a better score.Little bit of grind more .`;
  }
  if (scored / total >= 0.8) {
    return `Thats my boy!!!Eliteee`;
  }
};
