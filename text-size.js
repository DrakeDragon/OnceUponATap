'use strict';
const TextSize = (() => {
  const choices = [
    { key: 'standard', label: 'Standard', scale: 1 },
    { key: 'large', label: 'Large', scale: 1.2 },
    { key: 'extra', label: 'Extra large', scale: 1.4 }
  ];
  function choice(key) { return choices.find(item => item.key === key) || choices[0]; }
  function apply(key) {
    const selected = choice(key);
    const root = document.documentElement;
    if (root) {
      root.style.setProperty('--text-scale', selected.scale);
      root.dataset.textSize = selected.key;
    }
    return selected.key;
  }
  return { choices, choice, apply };
})();
