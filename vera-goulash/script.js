const copyButton = document.querySelector('[data-copy-ingredients]');

if (copyButton) {
  const ingredients = [
    '3 medium yellow onions, diced',
    '2–3 tbsp olive oil',
    '1–1.1 kg / 2.2–2.4 lb cubed beef stew meat',
    'Salt, to taste',
    'Water, added little by little',
    '150 mL / about 2/3 cup tomato sauce',
    '1 heaping tsp Fant goulash seasoning'
  ].join('\n');

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ingredients);
      copyButton.dataset.copied = 'true';
      copyButton.textContent = 'Copied list';
      window.setTimeout(() => {
        copyButton.dataset.copied = 'false';
        copyButton.textContent = 'Copy shopping list';
      }, 2200);
    } catch {
      copyButton.textContent = 'Copy failed';
      window.setTimeout(() => {
        copyButton.textContent = 'Copy shopping list';
      }, 2200);
    }
  });
}

const printButton = document.querySelector('[data-print-recipe]');
if (printButton) {
  printButton.addEventListener('click', () => window.print());
}
