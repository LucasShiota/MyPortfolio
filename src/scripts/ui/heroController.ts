export const initHeroController = () => {
  const card = document.getElementById('flip-card');
  if (card) {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  }
};
