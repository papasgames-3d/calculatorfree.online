/* ==============================================
   CALCULATOR LOGIC - CHỈ DÀNH CHO TRANG CHỦ
   ============================================== */

// Calculator state variables
let display = null;
let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    if (display) {
        updateDisplay();
        setupKeyboardListeners();
    }
});

/**
 * Update calculator display with current input
 */
function updateDisplay() {
    if (!display) return;
    
    // Format numbers with commas for better readability
    let formatted = currentInput.toString();
    if (!isNaN(formatted) && formatted.indexOf('.') === -1) {
        // Use appropriate locale formatting
        const locale = document.documentElement.lang === 'vi' ? 'vi-VN' : 'en-US';
        formatted = Number(formatted).toLocaleString(locale);
    }
    display.textContent = formatted;
}

/**
 * Handle number input
 * @param {string} num - The number to input
 */
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

/**
 * Handle decimal point input
 */
function decimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

/**
 * Handle operator input
 * @param {string} op - The operator (+, −, ×, ÷)
 */
function operate(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousInput = parseFloat(currentInput.replace(/,/g, ''));
    shouldResetDisplay = true;
}

/**
 * Perform calculation
 */
function calculate() {
    if (operator === null || shouldResetDisplay) return;
    
    let current = parseFloat(currentInput.replace(/,/g, ''));
    let result;
    
    switch (operator) {
        case '+':
            result = previousInput + current;
            break;
        case '−':
            result = previousInput - current;
            break;
        case '×':
            result = previousInput * current;
            break;
        case '÷':
            if (current === 0) {
                const errorMsg = document.documentElement.lang === 'vi' 
                    ? 'Không thể chia cho không' 
                    : 'Cannot divide by zero';
                alert(errorMsg);
                return;
            }
            result = previousInput / current;
            break;
        default:
            return;
    }
    
    // Handle very large or very small numbers
    if (Math.abs(result) > 1e15) {
        currentInput = result.toExponential(6);
    } else if (Math.abs(result) < 1e-6 && result !== 0) {
        currentInput = result.toExponential(6);
    } else {
        // Round to avoid floating point precision issues
        currentInput = Math.round(result * 1e10) / 1e10;
        currentInput = currentInput.toString();
    }
    
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Clear all calculator data
 */
function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    updateDisplay();
}

/**
 * Toggle sign of current input
 */
function toggleSign() {
    if (currentInput !== '0') {
        if (currentInput.charAt(0) === '-') {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

/**
 * Convert current input to percentage
 */
function percentage() {
    let current = parseFloat(currentInput.replace(/,/g, ''));
    currentInput = (current / 100).toString();
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Handle backspace functionality
 */
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Setup keyboard event listeners
 */
function setupKeyboardListeners() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Prevent default for certain keys to avoid browser actions
        if (['/', 'Enter', '='].includes(key)) {
            event.preventDefault();
        }
        
        // Handle different key inputs
        if ('0123456789'.includes(key)) {
            inputNumber(key);
        } else if (key === '.') {
            decimal();
        } else if (key === '+') {
            operate('+');
        } else if (key === '-') {
            operate('−');
        } else if (key === '*') {
            operate('×');
        } else if (key === '/') {
            operate('÷');
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearAll();
        } else if (key === 'Backspace') {
            backspace();
        } else if (key === '%') {
            percentage();
        }
    });
}

/**
 * Utility function to format numbers based on locale
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(number) {
    const locale = document.documentElement.lang === 'vi' ? 'vi-VN' : 'en-US';
    return number.toLocaleString(locale);
}

/**
 * Add visual feedback for button clicks
 */
function addButtonFeedback() {
    const buttons = document.querySelectorAll('.calculator .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'translateY(2px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// Initialize button feedback when DOM is ready
document.addEventListener('DOMContentLoaded', addButtonFeedback); 