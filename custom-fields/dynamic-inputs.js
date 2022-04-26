function DynamicInputs(context) {
  const css = `
    .af-dynamic-input-remove-button {
      width: 40px;
      font-size: 20px;
      cursor: pointer;
      color: rgb(50, 61, 71);
      background: #E0E1E2;
      border: none;
      border-radius: 3px;
    }
    .af-dynamic-input-remove-button:hover {
      transition: 0.15s linear;
      text-decoration: none;
      background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
    }
      .af-dynamic-input-container {
      display: flex;
      margin-bottom: .5em;
    }
    
    .af-dynamic-input-container input {
      margin-right: .5em;
    }
      .af-dynamic-input-add-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      display: inline-flex;
      cursor: pointer;
      align-items: center;
    }
    
    .af-dynamic-input-add-button-icon {
      background: var(--primary-color);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: #fff;
      font-size: 17px;
      margin-right: .5em;
    }
    
    .af-dynamic-input-add-button-text {
      font-weight: 600;
      color: var(--label-font-color);
    }
  `;

  const style = document.createElement('style');
  style.innerText = css;

  document.head.appendChild(style);

  const INITIAL_INPUTS = 2;
  const STATE_VALUE = {};
  const CURRENT_FIELD_UUID = context.custom.createUid();
  let UUID_COUNTER = 0;
  let INPUTS_COUNTER = INITIAL_INPUTS;

  const container = document.createElement('div');

  const inputsContainer = document.createElement('div');
  container.appendChild(inputsContainer);

  const addInputButton = document.createElement('button');
  addInputButton.type = 'button';
  addInputButton.classList.add('af-dynamic-input-add-button');
  addInputButton.id = `${CURRENT_FIELD_UUID}_add-input-button`;
  addInputButton.onclick = buildInputContainer.bind(this);

  const addInputButtonIcon = document.createElement('span');
  addInputButtonIcon.classList.add('af-dynamic-input-add-button-icon');
  addInputButtonIcon.innerText = '+';

  const addInputButtonText = document.createElement('span');
  addInputButtonText.classList.add('af-dynamic-input-add-button-text');
  addInputButtonText.innerText = 'Add new item';

  addInputButton.appendChild(addInputButtonIcon);
  addInputButton.appendChild(addInputButtonText);
  container.appendChild(addInputButton);

  function removeInput(container, input) {
    delete STATE_VALUE[input.name];
    container.remove();
  }

  function buildRemoveInputButton(container, input) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('af-dynamic-input-remove-button');
    button.innerText = '-';
    button.onclick = removeInput.bind(this, container, input);

    INPUTS_COUNTER--;

    return button;
  }

  function buildInput() {
    const input = document.createElement('input');
    input.type = 'email';
    input.placeholder = 'jane.doe@example.com';
    input.name = `${CURRENT_FIELD_UUID}_${UUID_COUNTER}`;
    input.id = input.name;
    input.addEventListener('change', () => {
      STATE_VALUE[input.name] = input.value;
    });

    UUID_COUNTER++;

    return input;
  }

  function buildInputContainer() {
    const container = document.createElement('div');
    container.classList.add('af-dynamic-input-container');

    const input = buildInput();
    container.appendChild(input);

    const removeButton = buildRemoveInputButton(container, input);
    container.appendChild(removeButton);

    inputsContainer.appendChild(container);

    INPUTS_COUNTER++;
  }

  function blockFields(value) {
    const inputKeys = Object.keys(STATE_VALUE);

    inputKeys.forEach((o) => {
      const selector = document.getElementById(o);
      selector.disabled = value;
    });
  }

  for (let i = 0; i <= INITIAL_INPUTS; i++) {
    buildInputContainer();
  }

  return {
    init() {
      return container;
    },

    block() {
      blockFields(true);
    },

    unblock() {
      blockFields(false);
    },

    getValue() {
      return Object.values(STATE_VALUE);
    },
  };
}