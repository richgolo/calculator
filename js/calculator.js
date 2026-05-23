// State variable: holds the current input string shown on the calculator display.
let currentInput = '0';
// State variable: holds the previous input string before selecting an operator.
let previousInput = '';
// State variable: holds the currently active mathematical operator symbol.
let activeOperator = null;
// State variable: flags whether the next number key press should overwrite the display.
let shouldResetDisplay = false;
// Function definition: updates the text content of the display element in the DOM.
function updateDisplay() {
  // Retrieve the display HTML element from the DOM using its unique ID.
  const displayElement = document.getElementById('display');
  // Conditional: check if the display element was successfully retrieved.
  if (displayElement) {
    // Set the text content of the display element to the current input value.
    displayElement.textContent = currentInput;
  }
}
// Function definition: adds event listeners to all calculator button elements.
function initializeCalculator() {
  // Select all button elements present inside the document body.
  const buttons = document.querySelectorAll('button');
  // Loop through each button element found in the document.
  buttons.forEach(button => {
    // Attach a click event listener to invoke logic on button click.
    button.addEventListener('click', () => {
      // Retrieve the text content of the button and trim outer spaces.
      const value = button.textContent.trim();
      // Call the router function to handle the parsed button action.
      handleButtonPress(value);
    });
  });
  // Perform an initial display update to sync UI and remove HTML whitespace.
  updateDisplay();
}
// Conditional: check if the document is still loading elements.
if (document.readyState === 'loading') {
  // Add listener to run initialization once content is parsed.
  document.addEventListener('DOMContentLoaded', initializeCalculator);
// Default branch: runs if DOMContentLoaded has already fired.
} else {
  // Call the initialization function immediately.
  initializeCalculator();
}
// Function definition: routes the clicked button value to its appropriate action.
function handleButtonPress(value) {
  // Conditional: check if the button value is a numeric digit.
  if (!isNaN(value)) {
    // Call helper function to handle numeric input value.
    handleNumber(value);
  // Conditional: check if the button value is a decimal point.
  } else if (value === '.') {
    // Call helper function to append a decimal point.
    handleDecimal();
  // Conditional: check if the button value is "AC" (All Clear).
  } else if (value === 'AC') {
    // Call helper function to clear all stored calculations.
    clearAll();
  // Conditional: check if the button value is the negation sign.
  } else if (value === '+/-') {
    // Call helper function to toggle positive/negative state.
    toggleSign();
  // Conditional: check if the button value is the percent operator.
  } else if (value === '%') {
    // Call helper function to convert current value to percent.
    convertToPercentage();
  // Conditional: check if the button value is the equals symbol.
  } else if (value === '=') {
    // Call helper function to finalize math operation.
    performCalculation();
  // Default branch: handles standard mathematical operator buttons.
  } else {
    // Call helper function to assign the selected operator.
    handleOperator(value);
  }
  // Call update display to reflect new inputs visually.
  updateDisplay();
}
// Function definition: handles standard digit inputs.
function handleNumber(number) {
  // Conditional: check if screen needs reset after an operator press.
  if (shouldResetDisplay) {
    // Overwrite the current input with the new number.
    currentInput = number;
    // Set reset flag back to false for subsequent numbers.
    shouldResetDisplay = false;
  // Default branch: append number to current input string.
  } else {
    // Set input to number if '0', otherwise concatenate string.
    currentInput = currentInput === '0' ? number : currentInput + number;
  }
}
// Function definition: appends decimal point to current value.
function handleDecimal() {
  // Conditional: check if screen needs reset after an operator press.
  if (shouldResetDisplay) {
    // Set current input directly to decimal starting with '0.'.
    currentInput = '0.';
    // Set reset flag back to false for subsequent numbers.
    shouldResetDisplay = false;
  // Conditional: verify if current display does not have decimal.
  } else if (!currentInput.includes('.')) {
    // Concatenate decimal point character to current value.
    currentInput += '.';
  }
}
// Function definition: clears calculator memory and display.
function clearAll() {
  // Reset display value back to initial '0' character.
  currentInput = '0';
  // Reset stored operand value back to empty string.
  previousInput = '';
  // Set stored mathematical operator back to null.
  activeOperator = null;
  // Set display reset flag back to false state.
  shouldResetDisplay = false;
}
// Function definition: negates the current input value sign.
function toggleSign() {
  // Convert current input string to float type number.
  const num = parseFloat(currentInput);
  // Conditional: ensure value is valid number and non-zero.
  if (!isNaN(num) && num !== 0) {
    // Multiply by minus one and convert back to string.
    currentInput = (num * -1).toString();
  }
}
// Function definition: converts value to percentage of 100.
function convertToPercentage() {
  // Convert current input string to float type number.
  const num = parseFloat(currentInput);
  // Conditional: check if parsed number is a valid float.
  if (!isNaN(num)) {
    // Divide the number by 100 and convert back to string.
    currentInput = (num / 100).toString();
  }
}
// Function definition: handles operator button presses.
function handleOperator(operator) {
  // Conditional: check if active operator is pending execution.
  if (activeOperator !== null && !shouldResetDisplay) {
    // Run the pending math calculation first.
    calculate();
  }
  // Store the current input value into the operand container.
  previousInput = currentInput;
  // Store active operator character to be evaluated later.
  activeOperator = operator;
  // Set display reset flag to true for subsequent numbers.
  shouldResetDisplay = true;
}
// Function definition: calculates arithmetic operations.
function calculate() {
  // Convert previous operand string to float number.
  const prev = parseFloat(previousInput);
  // Convert current operand string to float number.
  const curr = parseFloat(currentInput);
  // Conditional: check if either operand is invalid number.
  if (isNaN(prev) || isNaN(curr)) {
    // Return early to exit function execution.
    return;
  }
  // Initialize local variable to store calculation result.
  let result = 0;
  // Switch block: routes calculation by active operator.
  switch (activeOperator) {
    // Switch case: adds inputs when operator is plus.
    case '+':
      // Add prev and curr values together.
      result = prev + curr;
      // Exit the addition switch statement branch.
      break;
    // Switch case: subtracts inputs when operator is minus.
    case '-':
      // Subtract current value from previous value.
      result = prev - curr;
      // Exit the subtraction switch statement branch.
      break;
    // Switch case: multiplies inputs when operator is multiplication.
    case 'x':
      // Multiply previous and current values together.
      result = prev * curr;
      // Exit the multiplication switch statement branch.
      break;
    // Switch case: divides inputs when operator is division.
    case '/':
      // Conditional: check if user is dividing by zero.
      if (curr === 0) {
        // Set display to show standard error message.
        currentInput = 'Error';
        // Reset stored active operator to null state.
        activeOperator = null;
        // Return early to exit calculate function.
        return;
      }
      // Divide previous value by current value.
      result = prev / curr;
      // Exit the division switch statement branch.
      break;
    // Default case: safety branch for fallback behavior.
    default:
      // Return early to exit calculate function.
      return;
  }
  // Set current input to formatted result string with precision correction.
  currentInput = parseFloat(result.toFixed(10)).toString();
  // Reset stored previous input value to empty string.
  previousInput = '';
}
// Function definition: executes pending math on equal press.
function performCalculation() {
  // Conditional: verify if an active operator is pending.
  if (activeOperator === null) {
    // Return early to exit function execution.
    return;
  }
  // Call helper function to perform calculation.
  calculate();
  // Reset the active operator to null state.
  activeOperator = null;
  // Set display reset flag to true for subsequent numbers.
  shouldResetDisplay = true;
}
