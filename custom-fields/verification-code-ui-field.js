function CustomOtpField(context) {
  const css = `
    .af-otp-container {
      display: flex;
      justify-content: center;
    }
    
    .af-otp-field {
      max-width: 50px;
      min-height: 50px;
      margin: 0 .5em;
      text-align: center;
    }  
  `;

  const style = document.createElement('style');
  style.innerText = css;

  document.head.appendChild(style);

  const DEFAULT_INPUT_DIGITS = 4;
  const FIELD_PATTERN = '[0-9]';
  const items = [];

  function addInputListener(e) {
    const value = e.target.value;
    const isValidField = new RegExp(FIELD_PATTERN).test(value);
    const currentIndex = parseInt(e.target.dataset.index);
    const isLastItem = e.target.dataset.index == items.length - 1;

    if (e.inputType === 'insertFromPaste') {
      if (!isValidField) {
        e.target.value = null; // Do not set invalid values
      }
    }

    if (e.inputType === 'insertText') {
      if (!isValidField) {
        e.target.value = null; // Do not set invalid values
      }

      if (isValidField && !isLastItem) {
        items[currentIndex + 1].focus(); // Focus next item after valid value
      }
    }
  }

  function addPasteListener(e) {
    const pastedValue = e.clipboardData.getData('text');
    const currentIndex = parseInt(e.target.dataset.index);
    const splittedPastedValue = pastedValue.split('');
    const maxLoops = splittedPastedValue.length - currentIndex;

    for (let i = currentIndex, v = 0; i < items.length && v <= maxLoops; i++, v++) {
      const isValidField = new RegExp(FIELD_PATTERN).test(splittedPastedValue[v]);

      if (isValidField) { // Only set valid values and focus latest item
        items[i].value = splittedPastedValue[v];
        items[i].focus();
      }
    }
  }

  function addKeyDownListener(e) {
    const keyCode = e.keyCode || e.charCode;
    const hasValue = !!e.target.value;
    const index = parseInt(e.target.dataset.index);
    const isFirstItem = index === 0;
    const isDelete = keyCode === 8 || keyCode === 46;

    if (!hasValue && isDelete && !isFirstItem) {
      items[index - 1].focus(); // Move focus to previous item if delete key is pressed and input has no value
    }
  }

  function buildField(index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.minLength = 1;
    input.maxLength = 1;
    input.pattern = FIELD_PATTERN;
    input.inputMode = 'numeric';
    input.autocomplete = 'one-time-code';
    input.classList.add('af-otp-field');
    input.dataset.index = index;
    input.addEventListener('input', addInputListener);
    input.addEventListener('paste', addPasteListener);
    input.addEventListener('keydown', addKeyDownListener);

    return input;
  }

  function initComponent() {
    const config = context.custom.getParams();
    const { digits } = config;
    const arrayLength = {
      length: digits || DEFAULT_INPUT_DIGITS,
    };

    const container = document.createElement('div');
    container.classList.add('af-otp-container');

    Array.from(arrayLength).forEach((o, index) => {
      const input = buildField(index);
      items.push(input);
      container.appendChild(input);
    });

    return container;
  }

  return {
    init() {
      return initComponent();
    },

    getValue() {
      const value = items.map((o) => {
        return o.value;
      });

      return value.join('');
    },
  };
}