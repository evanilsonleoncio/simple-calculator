// This section controls the color change of the calculator
const palleteButton = document.querySelector(`.header div:nth-child(2)`);
const calculatorFrame = document.querySelector(`.calculator`);
let colorNumber = 1;

function changeColor () {
  let currentColor;

  switch (colorNumber) {
    case 1:
      calculatorFrame.classList.add(`color1`);
      currentColor = `color1`;
      colorNumber++;
      break;
    case 2:
      calculatorFrame.classList.remove(`color1`);
      calculatorFrame.classList.add(`color2`);
      currentColor = `color2`;
      colorNumber++;
      break;
    case 3:
      calculatorFrame.classList.remove(`color2`);
      calculatorFrame.classList.add(`color3`);
      currentColor = `color3`;
      colorNumber++;
      break;
    case 4:
      calculatorFrame.classList.remove(`color3`);
      calculatorFrame.classList.add(`color4`);
      currentColor = `color4`;
      colorNumber++;
      break;
    case 5:
      calculatorFrame.classList.remove(`color4`);
      calculatorFrame.classList.add(`color5`);
      currentColor = `color5`;
      colorNumber++;
      break;
    case 6:
      calculatorFrame.classList.remove(`color5`);
      calculatorFrame.classList.add(`color6`);
      currentColor = `color6`;
      colorNumber++;
      break;
    case 7:
      calculatorFrame.classList.remove(`color6`);
      calculatorFrame.classList.add(`color7`);
      currentColor = `color7`;
      colorNumber++;
      break;
    case 8:
      calculatorFrame.classList.remove(`color7`);
      calculatorFrame.classList.add(`color8`);
      currentColor = `color8`;
      colorNumber++;
      break;
    case 9:
      calculatorFrame.classList.remove(`color8`);
      calculatorFrame.classList.add(`color9`);
      currentColor = `color9`;
      colorNumber++;
      break;
    default:
      calculatorFrame.classList.remove(`color9`);
      currentColor = ``;
      colorNumber = 1;
      break;
  };

  return currentColor;
};

palleteButton.addEventListener(`click`, () => {
  localStorage.setItem(`calculatorColor`, changeColor());
});

// This section controls enabling/disabling dark mode
const htmlBackground = document.querySelector(`html`);
const lightSwitch = document.querySelector(`.header div:nth-child(3)`);
const darknessExpansion = document.querySelector(`.header div:nth-child(1)`);

let backgroundTimeoutId;

lightSwitch.addEventListener(`click`, () => {
  const isDarknessEnabled = darknessExpansion.classList.toggle(`active`);

  clearTimeout(backgroundTimeoutId);

  if (darknessExpansion.classList.contains(`active`)) {
		setTimeout(() => {
			lightSwitch.querySelector(`img`).src = `images/sun.png`;
		}, 10);

    backgroundTimeoutId = setTimeout(()=> {
      htmlBackground.classList.add(`dark`);
    }, 2000);
	} else {
		setTimeout(() => {
			lightSwitch.querySelector(`img`).src = `images/moon.png`;
		}, 900);

    htmlBackground.classList.remove(`dark`);
	};

  localStorage.setItem('darkMode', isDarknessEnabled);
});

// This section controls the calculator`s logic
const calculatorButtons = document.querySelectorAll(`.btn`);
const deleteHistoryButton = document.querySelector(`.delete-history`);
const historyDisplay = document.querySelector(`.history-screen`);
const errorMessage = document.querySelector(`.error-message`);
const currentDisplay = document.querySelector(`.current-screen`);

let inputedValue = ``;
let expression = [];
let parentheses;
let parenthesesBefore = ``;
let parenthesesAfter = ``;
let percentage = ``;

function formatToLocalNumber(value) {
  const matches = value.match(/\d+/g);
  let formattedValue = value.replace(/\d+/g, (match) => (+match).toLocaleString());

  formattedValue = formattedValue.replace(/\*/g, '×').replace(/\//g, '÷');

  return formattedValue;
};

// Handling with the mouse
calculatorButtons.forEach((button) => {
  button.addEventListener(`mousedown`, () => {
    if (button.id === `clear`) {
      currentDisplay.textContent = ``;
      inputedValue = ``;
      parentheses = ``;
      parenthesesBefore = ``;
      parenthesesAfter = ``;
    } else if (button.id === `backspace`) {
      if (inputedValue.charAt(inputedValue.length - 1) === `(`) {
        inputedValue = inputedValue.slice(0, -1);
        currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
        parenthesesBefore = parenthesesBefore.slice(0, -1);
      } else if (inputedValue.charAt(inputedValue.length - 1) === `)`) {
        inputedValue = inputedValue.slice(0, -1);
        currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
        parenthesesAfter = parenthesesAfter.slice(0, -1);
      } else if (inputedValue) {
        inputedValue = inputedValue.slice(0, -1);
        currentDisplay.textContent = formatToLocalNumber(inputedValue);
      };
    } else if (button.id === `parentheses`) {
      if (/^[0-9)$]/.test(inputedValue.charAt(inputedValue.length - 1)) || currentDisplay.textContent.charAt(currentDisplay.textContent.length - 1) === `%`) {
        if (parenthesesBefore !== null && parenthesesBefore.length > parenthesesAfter.length) {
          parentheses = `)`;
          parenthesesAfter += parentheses;
          inputedValue += parentheses;
          currentDisplay.textContent += parentheses;
        } else {
          parentheses = `(`;
          parenthesesBefore += parentheses;
          inputedValue += `*${parentheses}`;
          currentDisplay.textContent += `×${parentheses}`;
        };
      } else {
        if (parenthesesBefore !== null && parenthesesBefore.length < parenthesesAfter.length) {
          parentheses = `)`;
          inputedValue += parentheses;
          currentDisplay.textContent += parentheses;
          parenthesesBefore += parentheses;
          parentheses = ``;
        } else {
          parentheses = `(`;
          inputedValue += parentheses;
          currentDisplay.textContent += parentheses;
          parenthesesBefore += parentheses;
          parentheses = ``;
        };
      };

      currentDisplay.scrollLeft = currentDisplay.scrollWidth;
    } else if (button.id === `=`) {
      if (inputedValue.includes(`%`)) {
        inputedValue = inputedValue.replace(/%/g, '%#');
        expression = inputedValue.split('#').filter(Boolean);
        inputedValue = ``;

        let operatorForPercentageIndex = ``;
        let operatorForPercentage = ``;

        for (let i = 0; i < expression.length; i++) {
          let calculate = expression[i];

          percentage = (calculate.match(/(\d+(\.\d+)?)%(?![\d.%])/) ?? [, ''])[1];

          if (calculate[calculate.length - 1] === `%`) {
            operatorForPercentageIndex = calculate.search(/[-+*/()](?!.*[-+*/()])/);
            if (/[+\-*/]/.test(calculate[operatorForPercentageIndex])) {
              operatorForPercentage = calculate[operatorForPercentageIndex];
            } else {
              operatorForPercentage = ``;
            };
          } else {
            operatorForPercentage = ``;
          };

          if (/[+]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
            if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
              calculate = calculate.replace(`%`, `/100`);
              inputedValue += calculate;
            } else {
              let lastIndex = calculate.lastIndexOf(operatorForPercentage);

              calculate = `${calculate.substring(0, lastIndex)})/${calculate.substring(lastIndex + 1)}`;
              calculate = calculate.replace(`%`, `*${percentage}*(100+${percentage})*0.01`);
              inputedValue = `(${inputedValue}${calculate}`;
            };
          } else if (/[-]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
            if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
              calculate = calculate.replace(`%`, `/100`);
              inputedValue += calculate;
            } else {
              let lastIndex = calculate.lastIndexOf(operatorForPercentage);

              calculate = `${calculate.substring(0, lastIndex)}*${calculate.substring(lastIndex + 1)}`;
              calculate = calculate.replace(`%`, `/${percentage}*(100-${percentage})*0.01`);
              inputedValue += calculate;
            };
          } else if (/[/]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
            if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
              calculate = calculate.replace(`%`, `/100`);
              inputedValue += calculate;
            } else {
              calculate = calculate.replace(`%`, `*100`);
              inputedValue += calculate;
            };
          } else {
            calculate = calculate.replace(`%`, `/100`);
            inputedValue += calculate;
          };
        };

        let tempExpression = currentDisplay.textContent;

        try {
          inputedValue = eval(inputedValue);
          let result = Number(inputedValue.toFixed(10)).toLocaleString(`en`);
          currentDisplay.textContent = result;
          historyDisplay.textContent += ` = ${result}`;
          historyDisplay.textContent = `${tempExpression} = ${result}`;
          deleteHistoryButton.classList.add(`show`);
          inputedValue = inputedValue.toString();
          currentDisplay.scrollLeft = currentDisplay.scrollWidth;
        } catch (e) {
          errorMessage.classList.add('show');

            setTimeout(() => {
              errorMessage.classList.remove('show');
            }, 1800);

            console.error(e.message);
        };
      } else {
        if (inputedValue) {
          let tempExpression = currentDisplay.textContent;

          try {
            inputedValue = eval(inputedValue);
            let result = Number(inputedValue.toFixed(10)).toLocaleString(`en`);
            currentDisplay.textContent = result;
            historyDisplay.textContent = `${tempExpression} = ${result}`;
            deleteHistoryButton.classList.add(`show`);
            inputedValue = inputedValue.toString();
            currentDisplay.scrollLeft = currentDisplay.scrollWidth;
          } catch (e) {
            errorMessage.classList.add('show');

            setTimeout(() => {
              errorMessage.classList.remove('show');
            }, 1800);

            console.error(e.message);
          };
        };
      };
    } else {
      inputedValue += button.id;
      currentDisplay.textContent = formatToLocalNumber(inputedValue);
      currentDisplay.scrollLeft = currentDisplay.scrollWidth;
    };
  });
});

deleteHistoryButton.addEventListener(`click`, () => {
  historyDisplay.textContent = ``;
  currentDisplay.textContent = ``;
  inputedValue = ``;
  parentheses = ``;
  parenthesesBefore = ``;
  parenthesesAfter = ``;
  deleteHistoryButton.classList.remove(`show`);
});

// Handling with the keyboard
document.addEventListener(`keydown`, (event) => {
  pressedKey = /^[0-9+\-*/%.pP,\b\u007F]$|^Enter$|^Delete$|^Backspace$/.test(event.key) ? event.key : ``;

  if (pressedKey === `Delete`) {
    currentDisplay.textContent = ``;
    inputedValue = ``;
    parentheses = ``;
    parenthesesBefore = ``;
    parenthesesAfter = ``;
  } else if (pressedKey === `Backspace`) {
    if (inputedValue.charAt(inputedValue.length - 1) === `(`) {
      inputedValue = inputedValue.slice(0, -1);
      currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
      parenthesesBefore = parenthesesBefore.slice(0, -1);
    } else if (inputedValue.charAt(inputedValue.length - 1) === `)`) {
      inputedValue = inputedValue.slice(0, -1);
      currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
      parenthesesAfter = parenthesesAfter.slice(0, -1);
    } else {
      inputedValue = inputedValue.slice(0, -1);
      currentDisplay.textContent = formatToLocalNumber(inputedValue);
    };
  } else if (pressedKey === `p` || pressedKey === `P`) {
    if (/^[0-9)$]/.test(inputedValue.charAt(inputedValue.length - 1)) || currentDisplay.textContent.charAt(currentDisplay.textContent.length - 1) === `%`) {
      if (parenthesesBefore !== null && parenthesesBefore.length > parenthesesAfter.length) {
        parentheses = `)`;
        parenthesesAfter += parentheses;
        inputedValue += parentheses;
        currentDisplay.textContent += parentheses;
      } else {
        parentheses = `(`;
        parenthesesBefore += parentheses;
        inputedValue += `*${parentheses}`;
        currentDisplay.textContent += `×${parentheses}`;
      };
    } else {
      if (parenthesesBefore !== null && parenthesesBefore.length < parenthesesAfter.length) {
        parentheses = `)`;
        inputedValue += parentheses;
        currentDisplay.textContent += parentheses;
        parenthesesBefore += parentheses;
        parentheses = ``;
      } else {
        parentheses = `(`;
        inputedValue += parentheses;
        currentDisplay.textContent += parentheses;
        parenthesesBefore += parentheses;
        parentheses = ``;
      };
    };

    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
  } else if (pressedKey === `Enter`) {
    if (inputedValue.includes(`%`)) {
      inputedValue = inputedValue.replace(/%/g, '%#');
      expression = inputedValue.split('#').filter(Boolean);
      inputedValue = ``;

      let operatorForPercentageIndex = ``;
      let operatorForPercentage = ``;

      for (let i = 0; i < expression.length; i++) {
        let calculate = expression[i];

        percentage = (calculate.match(/(\d+(\.\d+)?)%(?![\d.%])/) ?? [, ''])[1];

        if (calculate[calculate.length - 1] === `%`) {
          operatorForPercentageIndex = calculate.search(/[-+*/()](?!.*[-+*/()])/);
          if (/[+\-*/]/.test(calculate[operatorForPercentageIndex])) {
            operatorForPercentage = calculate[operatorForPercentageIndex];
          } else {
            operatorForPercentage = ``;
          };
        } else {
          operatorForPercentage = ``;
        };

        if (/[+]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
          if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
            calculate = calculate.replace(`%`, `/100`);
            inputedValue += calculate;
          } else {
            let lastIndex = calculate.lastIndexOf(operatorForPercentage);

            calculate = `${calculate.substring(0, lastIndex)})/${calculate.substring(lastIndex + 1)}`;
            calculate = calculate.replace(`%`, `*${percentage}*(100+${percentage})*0.01`);
            inputedValue = `(${inputedValue}${calculate}`;
          };
        } else if (/[-]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
          if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
            calculate = calculate.replace(`%`, `/100`);
            inputedValue += calculate;
          } else {
            let lastIndex = calculate.lastIndexOf(operatorForPercentage);

            calculate = `${calculate.substring(0, lastIndex)}*${calculate.substring(lastIndex + 1)}`;
            calculate = calculate.replace(`%`, `/${percentage}*(100-${percentage})*0.01`);
            inputedValue += calculate;
          };
        } else if (/[/]/.test(operatorForPercentage) && /[0-9]/.test(calculate[operatorForPercentageIndex -1])) {
          if (expression[i + 1] && expression[i + 1].charAt(0) === `*`) {
            calculate = calculate.replace(`%`, `/100`);
            inputedValue += calculate;
          } else {
            calculate = calculate.replace(`%`, `*100`);
            inputedValue += calculate;
          };
        } else {
          calculate = calculate.replace(`%`, `/100`);
          inputedValue += calculate;
        };
      };

      let tempExpression = currentDisplay.textContent;

      try {
        inputedValue = eval(inputedValue);
        let result = Number(inputedValue.toFixed(10));
        currentDisplay.textContent = result;
        historyDisplay.textContent += ` = ${result}`;
        historyDisplay.textContent = `${tempExpression} = ${result}`;
        deleteHistoryButton.classList.add(`show`);
        inputedValue = inputedValue.toString();
        currentDisplay.scrollLeft = currentDisplay.scrollWidth;
      } catch (e) {
        errorMessage.classList.add('show');

          setTimeout(() => {
            errorMessage.classList.remove('show');
          }, 1800);

          console.error(e.message);
      };
    } else {
      if (inputedValue) {
        let tempExpression = currentDisplay.textContent;

        try {
          inputedValue = eval(inputedValue);
          let result = Number(inputedValue.toFixed(10)).toLocaleString(`en`);
          currentDisplay.textContent = result;
          historyDisplay.textContent = `${tempExpression} = ${result}`;
          deleteHistoryButton.classList.add(`show`);
          inputedValue = inputedValue.toString();
          currentDisplay.scrollLeft = currentDisplay.scrollWidth;
        } catch (e) {
          errorMessage.classList.add('show');

          setTimeout(() => {
            errorMessage.classList.remove('show');
          }, 1800);

          console.error(e.message);
        };
      };
    };
  } else {
    inputedValue += pressedKey;
    currentDisplay.textContent = formatToLocalNumber(inputedValue);
    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
  };

  if (event.key === 'Delete' && event.ctrlKey) {
    historyDisplay.textContent = ``;
    currentDisplay.textContent = ``;
    inputedValue = ``;
    parentheses = ``;
    parenthesesBefore = ``;
    parenthesesAfter = ``;
    deleteHistoryButton.classList.remove(`show`);
  };
});

//
window.onload = function () {
  if (!localStorage.getItem(`cookieConsent`)) {
    const cookieConsentBanner = document.querySelector(`.cookie-banner`);
    const cookieConsentButton = document.querySelector(`#cookie-consent`);

    cookieConsentBanner.classList.add(`show`);

    cookieConsentButton.addEventListener(`click`, () => {
      localStorage.setItem(`cookieConsent`, true);
      cookieConsentButton.classList.add(`accepted`);
      cookieConsentButton.textContent = `√`;

      setTimeout(()=> {
        cookieConsentBanner.classList.remove(`show`);
      }, 2000);
    });
  } else {
    if (localStorage.getItem(`darkMode`) === `true`) {
      darknessExpansion.classList.toggle(`active`);
      htmlBackground.classList.add(`dark`);
    };

    const currentColor = localStorage.getItem('calculatorColor');

    if (currentColor) {
      calculatorFrame.classList.add(currentColor)
      colorNumber = currentColor.charAt(currentColor.length - 1);
      colorNumber++;
    };
  };
};