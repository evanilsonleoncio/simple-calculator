// This section controls the color change of the calculator
const palleteButton = document.querySelector(`.container button:nth-child(2)`);
const calculatorFrame = document.querySelector(`.calculator`);
const keyboardArea = document.querySelector(`.keyboard`);
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

function swipeLeftHandler(event) {
  if (event.changedTouches[0].clientX - touchStartX < -100) {
    localStorage.setItem(`calculatorColor`, changeColor());
    localStorage.setItem(`instructionFinished`, `true`);
  }
}

keyboardArea.addEventListener(`touchstart`, function(event) {
  touchStartX = event.touches[0].clientX;
});

keyboardArea.addEventListener(`touchend`, function(event) {
  swipeLeftHandler(event);
});

palleteButton.addEventListener(`click`, () => {
  localStorage.setItem(`calculatorColor`, changeColor());
});

// This section controls enabling/disabling dark mode
const htmlBackground = document.querySelector(`html`);
const lightSwitch = document.querySelector(`.container button:nth-child(3)`);
const darknessExpansion = document.querySelector(`.container div:nth-child(1)`);

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
    }, 1000);
	} else {
		setTimeout(() => {
			lightSwitch.querySelector(`img`).src = `images/moon.png`;
		}, 900);

    htmlBackground.classList.remove(`dark`);
	};

  localStorage.setItem(`darkMode`, isDarknessEnabled);
});

// This section controls the calculator`s logic
const calculatorButtons = document.querySelectorAll(`.btn`);
const deleteHistoryButton = document.querySelector(`.delete-history`);
const historyDisplay = document.querySelector(`.history`);
const errorMessage = document.querySelector(`.error-message-container`);
const currentDisplay = document.querySelector(`.current-screen`);

let inputedValue = ``;
let expression = [];
let parentheses;
let parenthesesBefore = ``;
let parenthesesAfter = ``;
let percentage = ``;

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
        currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
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
        inputedValue = inputedValue.replace(/%/g, `%#`);
        expression = inputedValue.split(`#`).filter(Boolean);
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
          errorMessage.children.classList.add(`show`);

            setTimeout(() => {
              errorMessage.classList.remove(`show`);
            }, 1800);

            console.error(e.message);
        };
      } else {
        if (inputedValue) {
          let tempExpression = currentDisplay.textContent;

          try {
            inputedValue = eval(inputedValue);
            let result = Number(inputedValue.toFixed(10));
            currentDisplay.textContent = result;
            historyDisplay.textContent = `${tempExpression} = ${result}`;
            deleteHistoryButton.classList.add(`show`);
            inputedValue = inputedValue.toString();
            currentDisplay.scrollLeft = currentDisplay.scrollWidth;
          } catch (e) {
            errorMessage.classList.add(`show`);

            setTimeout(() => {
              errorMessage.classList.remove(`show`);
            }, 1800);

            console.error(e.message);
          };
        };
      };
    } else {
      inputedValue += button.id;
      currentDisplay.textContent += button.textContent;
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
      currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
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
      inputedValue = inputedValue.replace(/%/g, `%#`);
      expression = inputedValue.split(`#`).filter(Boolean);
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
        errorMessage.classList.add(`show`);

          setTimeout(() => {
            errorMessage.classList.remove(`show`);
          }, 1800);

          console.error(e.message);
      };
    } else {
      if (inputedValue) {
        let tempExpression = currentDisplay.textContent;

        try {
          inputedValue = eval(inputedValue);
          let result = Number(inputedValue.toFixed(10));
          currentDisplay.textContent = result;
          historyDisplay.textContent = `${tempExpression} = ${result}`;
          deleteHistoryButton.classList.add(`show`);
          inputedValue = inputedValue.toString();
          currentDisplay.scrollLeft = currentDisplay.scrollWidth;
        } catch (e) {
          errorMessage.classList.add(`show`);

          setTimeout(() => {
            errorMessage.classList.remove(`show`);
          }, 1800);

          console.error(e.message);
        };
      };
    };
  } else {
    inputedValue += pressedKey;
    currentDisplay.textContent += pressedKey.replace(/[*/]/g, (match) => {
      return match === `*` ? `×` : `÷`});
    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
  };

  if (event.key === `Delete` && event.ctrlKey) {
    historyDisplay.textContent = ``;
    currentDisplay.textContent = ``;
    inputedValue = ``;
    parentheses = ``;
    parenthesesBefore = ``;
    parenthesesAfter = ``;
    deleteHistoryButton.classList.remove(`show`);
  };
});

// This section controls the maintenance of user preference
window.onload = function () {
  const container = document.querySelector(`.container`);
  let containerWidth = container.getBoundingClientRect().width;

  function createInstructingHand(addTime, remTime) {
    const instructingHand = document.createElement(`img`);

    instructingHand.src = `images/hand.png`;

    const styleElement = document.createElement(`style`);

    document.body.appendChild(instructingHand);
    document.head.appendChild(styleElement);

    styleElement.innerHTML = `
      @keyframes slideLeft {
        0% {
            left: 83%;
            transform: rotate(30deg);
        }
        100% {
            left: 45%;
        }
      }
      
      .hand-animation {
        top: 50%;
        position: absolute;
        animation: slideLeft 2s ease-in-out 3;
        width: 8vh;
      }
    `;

    setTimeout(()=> {
      instructingHand.classList.add('hand-animation');
    }, addTime);

    setTimeout(()=> {
      instructingHand.remove();
      styleElement.remove();
    }, remTime);
  };

  if (!localStorage.getItem(`cookieConsent`)) {
    const cookieConsentBanner = document.createElement(`div`);
    const cookieBannerText = document.createTextNode(`This site uses cookies only to store your preferences. Don't worry! No personal data is being collected.`);
    const cookieConsentButton = document.createElement(`button`);

    cookieConsentButton.textContent = `Accept`;

    cookieConsentBanner.append(cookieBannerText, cookieConsentButton);

    document.body.appendChild(cookieConsentBanner);

    function cookieBannerBigScreen () {
      cookieConsentBanner.style.cssText = `
        display: grid;
        grid-template: 65% 35% / 100%;
        justify-items: center;
        align-items: center;
        position: fixed;
        left: 1rem;
        bottom: -12rem;
        width: 24rem;
        height: 12rem;
        font-family: 'Times New Roman', Times, serif;
        font-size: 1.5rem;
        color: rgba(0, 0, 0, 0.68);
        text-align: center;
        border: solid 2px rgb(198, 198, 198);
        background-color: rgb(255, 255, 255);
        transition: bottom 1.8s;
      `;

      cookieConsentButton.style.cssText = `
        width: 10rem;
        height: 2.8rem;
        font-family: 'Times New Roman', Times, serif;
        font-size: 1.5rem;
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        background-color: rgb(250, 40, 40);
        transition: width 0.5s, height 0.5s, border-radius 0.5s, background-color 0.5s;
      `;

      setTimeout(() => {
        cookieConsentBanner.style.bottom = `1rem`;
      }, 1000);
    };

    function cookieBannerSmallScreen () {
      cookieConsentBanner.style.cssText = `
        display: grid;
        grid-template: 65% 35% / 100%;
        justify-items: center;
        align-items: center;
        position: fixed;
        bottom: -30vh;
        width: 100vw;
        height: 30vh;
        font-family: 'Times New Roman', Times, serif;
        font-size: 1.5rem;
        color: rgba(0, 0, 0, 0.68);
        text-align: center;
        background-color: rgb(255, 255, 255);
        transition: bottom 1.8s;
      `;

      cookieConsentButton.style.cssText = `
        width: 10rem;
        height: 2.8rem;
        font-family: 'Times New Roman', Times, serif;
        font-size: 1.5rem;
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        background-color: rgb(250, 40, 40);
        transition: width 0.5s, height 0.5s, border-radius 0.5s, background-color 0.5s;
      `;

      setTimeout(() => {
        cookieConsentBanner.style.bottom = `0`;
      }, 1000);
    };

    if (containerWidth > 480) {
      cookieBannerBigScreen();
    } else {
      cookieBannerSmallScreen();
    };

    // Esta função é meramente para fins de análise dos recrutadores. Em um dispositivo móvel real ela não se faz necessária.
    window.addEventListener(`resize`, () => {
      if (!localStorage.getItem(`cookieConsent`)) {
        containerWidth = container.getBoundingClientRect().width;

        if (containerWidth > 480) {
          cookieBannerBigScreen();
        } else {
          cookieBannerSmallScreen();
        };
      };
    });
    //

    cookieConsentButton.addEventListener(`click`, () => {
      localStorage.setItem(`cookieConsent`, true);
      cookieConsentButton.style.width = `2.8rem`;
      cookieConsentButton.style.borderRadius = `50%`;
      cookieConsentButton.style.backgroundColor = `rgb(10, 255, 10)`;
      cookieConsentButton.textContent = `√`;

      setTimeout(()=> {
        cookieConsentBanner.style.bottom = `-100%`;
      }, 2000);

      setTimeout(()=> {
        cookieConsentBanner.remove();
      }, 4000);

      if (containerWidth < 480) {
        createInstructingHand(4000, 10000);
      };
    });
  } else {
    if (containerWidth < 480 && !localStorage.getItem(`instructionFinished`)) {
      createInstructingHand(2000, 8000);
    };

    if (localStorage.getItem(`darkMode`) === `true`) {
      darknessExpansion.classList.toggle(`active`);
      lightSwitch.querySelector(`img`).src = `images/sun.png`;
      htmlBackground.classList.add(`dark`);
    };

    const currentColor = localStorage.getItem(`calculatorColor`);

    if (currentColor) {
      calculatorFrame.classList.add(currentColor)
      colorNumber = currentColor.charAt(currentColor.length - 1);
      colorNumber++;
    };
  };
};