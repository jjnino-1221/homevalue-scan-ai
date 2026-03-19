// Interactive UI Components - Gamified input elements for property valuation

// Render chip buttons (quick select options) - RDS-aligned
export function renderChips(options, callback, multiSelect = false) {
  const container = document.createElement('div');
  container.className = 'chip-group rkt-Chip-group';

  const selectedValues = new Set();

  options.forEach(option => {
    const chip = document.createElement('button');
    chip.className = 'chip-button rkt-Chip';
    chip.textContent = option.label;
    chip.dataset.value = option.value;

    chip.addEventListener('click', () => {
      if (multiSelect) {
        // Multi-select mode
        chip.classList.toggle('selected');
        chip.classList.toggle('rkt-Chip--is-selected');
        if (chip.classList.contains('selected')) {
          selectedValues.add(option.value);
        } else {
          selectedValues.delete(option.value);
        }
        callback(Array.from(selectedValues));
      } else {
        // Single-select mode - remove previous selection
        container.querySelectorAll('.chip-button').forEach(btn => {
          btn.classList.remove('selected', 'rkt-Chip--is-selected');
        });
        chip.classList.add('selected', 'rkt-Chip--is-selected');
        callback(option.value, option.label);
      }
    });

    container.appendChild(chip);
  });

  return container;
}

// Render category tiles (larger selection cards) - RDS Card pattern
export function renderCategoryTiles(options, callback) {
  const container = document.createElement('div');
  container.className = 'category-tiles rkt-CategoryTiles';

  options.forEach(option => {
    const tile = document.createElement('button');
    tile.className = 'category-tile rkt-Card rkt-Card--category';

    const icon = document.createElement('span');
    icon.className = 'icon rkt-Icon';
    icon.textContent = option.icon;

    const label = document.createElement('span');
    label.className = 'label rkt-Card__heading';
    label.textContent = option.label;

    tile.appendChild(icon);
    tile.appendChild(label);

    tile.addEventListener('click', () => {
      container.querySelectorAll('.category-tile').forEach(t => {
        t.classList.remove('selected', 'rkt-Card--is-selected');
      });
      tile.classList.add('selected', 'rkt-Card--is-selected');
      callback(option.value, option.label);
    });

    container.appendChild(tile);
  });

  return container;
}

// Render slider input - RDS-aligned
export function renderSlider(config, callback) {
  const { min, max, step, default: defaultValue, unit } = config;

  const container = document.createElement('div');
  container.className = 'slider-container rkt-Slider-container';

  const labelRow = document.createElement('div');
  labelRow.className = 'slider-label rkt-Slider__label-row';

  const labelText = document.createElement('span');
  labelText.textContent = 'Select value';

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'slider-value rkt-Slider__value';
  valueDisplay.textContent = `${defaultValue.toLocaleString()} ${unit}`;

  labelRow.appendChild(labelText);
  labelRow.appendChild(valueDisplay);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'slider-input rkt-Slider rkt-Slider--primary';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultValue;
  slider.setAttribute('aria-label', `Select ${unit}`);

  const minMaxRow = document.createElement('div');
  minMaxRow.className = 'slider-minmax rkt-Slider__label-container';

  const minLabel = document.createElement('span');
  minLabel.className = 'rkt-Slider__label';
  minLabel.textContent = `${min.toLocaleString()} ${unit}`;

  const maxLabel = document.createElement('span');
  maxLabel.className = 'rkt-Slider__label';
  maxLabel.textContent = `${max.toLocaleString()} ${unit}`;

  minMaxRow.appendChild(minLabel);
  minMaxRow.appendChild(maxLabel);

  slider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    valueDisplay.textContent = `${value.toLocaleString()} ${unit}`;
  });

  slider.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    callback(value, `${value.toLocaleString()} ${unit}`);
  });

  container.appendChild(labelRow);
  container.appendChild(slider);
  container.appendChild(minMaxRow);

  return container;
}

// Render date picker (year only for property)
export function renderDatePicker(config, callback) {
  const { yearOnly, min, max, default: defaultValue } = config;

  const container = document.createElement('div');
  container.className = 'date-picker-container';

  const label = document.createElement('div');
  label.className = 'date-picker-label';
  label.textContent = 'Select year';

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'date-picker-input';
  input.min = min;
  input.max = max;
  input.value = defaultValue;
  input.placeholder = 'Enter year';

  input.addEventListener('change', (e) => {
    const year = parseInt(e.target.value);
    if (year >= min && year <= max) {
      callback(year, year.toString());
    }
  });

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

// Update progress bar
export function updateProgress(progressData) {
  const container = document.getElementById('progressContainer');
  const title = document.getElementById('progressTitle');
  const steps = document.getElementById('progressSteps');
  const bar = document.getElementById('progressBar');

  if (!container || !title || !steps || !bar) return;

  const { step, total, title: progressTitle } = progressData;
  const percentage = (step / total) * 100;

  container.style.display = 'block';
  title.textContent = progressTitle;
  steps.textContent = `Step ${step} of ${total}`;
  bar.style.width = `${percentage}%`;

  // Add celebration effect when completing a step
  if (step > 1) {
    container.classList.add('celebrating');
    setTimeout(() => container.classList.remove('celebrating'), 500);
  }
}

// Render confidence meter inline - RDS-aligned
export function renderConfidenceMeter(confidenceData) {
  const { value, message } = confidenceData;

  const container = document.createElement('div');
  container.className = 'confidence-meter rkt-ConfidenceMeter';

  const header = document.createElement('div');
  header.className = 'confidence-header rkt-ConfidenceMeter__header';

  const label = document.createElement('span');
  label.className = 'confidence-label rkt-ConfidenceMeter__label';
  label.textContent = 'Data Confidence';

  const percentage = document.createElement('span');
  percentage.className = 'confidence-percentage rkt-ConfidenceMeter__value';
  percentage.textContent = `${value}%`;

  header.appendChild(label);
  header.appendChild(percentage);

  const barTrack = document.createElement('div');
  barTrack.className = 'confidence-bar-track rkt-ConfidenceMeter__track';

  const barFill = document.createElement('div');
  barFill.className = 'confidence-bar-fill rkt-ConfidenceMeter__fill';
  barFill.style.width = `0%`;

  barTrack.appendChild(barFill);

  const messageText = document.createElement('div');
  messageText.className = 'confidence-message rkt-ConfidenceMeter__message';
  messageText.textContent = message;

  container.appendChild(header);
  container.appendChild(barTrack);
  container.appendChild(messageText);

  // Animate the bar fill
  setTimeout(() => {
    barFill.style.width = `${value}%`;
  }, 100);

  return container;
}

// Render completion badge - RDS Badge pattern
export function renderCompletionBadge(message = 'Complete!') {
  const badge = document.createElement('span');
  badge.className = 'completion-badge rkt-Badge rkt-Badge--success';

  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark rkt-Icon';
  checkmark.textContent = '✓';

  const text = document.createElement('span');
  text.textContent = message;

  badge.appendChild(checkmark);
  badge.appendChild(text);

  return badge;
}

// Main function to render UI pattern based on type
export function renderUIPattern(pattern, callback) {
  const { type, options, multiSelect } = pattern;

  switch (type) {
    case 'chips':
      return renderChips(options, callback, multiSelect);

    case 'category-tiles':
      return renderCategoryTiles(options, callback);

    case 'slider':
      return renderSlider(pattern, callback);

    case 'date-picker':
      return renderDatePicker(pattern, callback);

    default:
      console.warn(`Unknown UI pattern type: ${type}`);
      return null;
  }
}

// Make functions available globally for easy access
window.InteractiveUI = {
  renderChips,
  renderCategoryTiles,
  renderSlider,
  renderDatePicker,
  updateProgress,
  renderConfidenceMeter,
  renderCompletionBadge,
  renderUIPattern
};
