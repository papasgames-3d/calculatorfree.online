/**
 * PERCENTAGE CALCULATOR JAVASCRIPT
 * Tính toán các loại phần trăm khác nhau: cơ bản, tăng/giảm, tip, discount, grade
 */

class PercentageCalculator {
    constructor() {
        this.currentTab = 'basic';
        this.initializeEventListeners();
        this.initializeTabs();
        this.generateExamples();
    }

    initializeEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Calculate buttons
        const calculateButtons = document.querySelectorAll('.btn-calculate');
        calculateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const panel = e.target.closest('.calculator-panel');
                const panelId = panel.id;
                this.calculate(panelId);
            });
        });

        // Clear buttons
        const clearButtons = document.querySelectorAll('.btn-clear');
        clearButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const panel = e.target.closest('.calculator-panel');
                this.clearPanel(panel);
            });
        });

        // Enter key support
        this.addEnterKeySupport();

        // Real-time calculation for basic percentage
        this.addRealTimeCalculation();
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update panels
        document.querySelectorAll('.calculator-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;
    }

    initializeTabs() {
        // Show first tab by default
        this.switchTab('basic');
    }

    addEnterKeySupport() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const panel = input.closest('.calculator-panel');
                    const calculateBtn = panel.querySelector('.btn-calculate');
                    if (calculateBtn) {
                        calculateBtn.click();
                    }
                }
            });
        });
    }

    addRealTimeCalculation() {
        const basicInputs = document.querySelectorAll('#basic input[type="number"]');
        basicInputs.forEach(input => {
            input.addEventListener('input', () => {
                const value = parseFloat(document.getElementById('basicValue').value);
                const percentage = parseFloat(document.getElementById('basicPercentage').value);
                
                if (!isNaN(value) && !isNaN(percentage)) {
                    this.calculateBasicPercentage();
                }
            });
        });
    }

    calculate(panelId) {
        switch (panelId) {
            case 'basic':
                this.calculateBasicPercentage();
                break;
            case 'change':
                this.calculatePercentageChange();
                break;
            case 'of':
                this.calculateWhatPercentageOf();
                break;
            case 'tip':
                this.calculateTip();
                break;
            case 'discount':
                this.calculateDiscount();
                break;
            case 'grade':
                this.calculateGrade();
                break;
        }
    }

    calculateBasicPercentage() {
        const value = parseFloat(document.getElementById('basicValue').value);
        const percentage = parseFloat(document.getElementById('basicPercentage').value);

        if (isNaN(value) || isNaN(percentage)) {
            this.showError('Please enter valid numbers!', 'basicResults');
            return;
        }

        const result = (value * percentage) / 100;
        
        this.displayBasicResults(value, percentage, result);
    }

    calculatePercentageChange() {
        const oldValue = parseFloat(document.getElementById('oldValue').value);
        const newValue = parseFloat(document.getElementById('newValue').value);

        if (isNaN(oldValue) || isNaN(newValue)) {
            this.showError('Please enter valid numbers!', 'changeResults');
            return;
        }

        if (oldValue === 0) {
            this.showError('Old value cannot be zero!', 'changeResults');
            return;
        }

        const change = newValue - oldValue;
        const percentageChange = (change / oldValue) * 100;
        const isIncrease = change >= 0;

        this.displayChangeResults(oldValue, newValue, change, percentageChange, isIncrease);
    }

    calculateWhatPercentageOf() {
        const part = parseFloat(document.getElementById('partValue').value);
        const whole = parseFloat(document.getElementById('wholeValue').value);

        if (isNaN(part) || isNaN(whole)) {
            this.showError('Please enter valid numbers!', 'ofResults');
            return;
        }

        if (whole === 0) {
            this.showError('Whole value cannot be zero!', 'ofResults');
            return;
        }

        const percentage = (part / whole) * 100;
        
        this.displayOfResults(part, whole, percentage);
    }

    calculateTip() {
        const billAmount = parseFloat(document.getElementById('billAmount').value);
        const tipPercentage = parseFloat(document.getElementById('tipPercentage').value);
        const people = parseInt(document.getElementById('people').value) || 1;

        if (isNaN(billAmount) || isNaN(tipPercentage)) {
            this.showError('Please enter valid numbers!', 'tipResults');
            return;
        }

        const tipAmount = (billAmount * tipPercentage) / 100;
        const totalAmount = billAmount + tipAmount;
        const perPerson = totalAmount / people;
        const tipPerPerson = tipAmount / people;

        this.displayTipResults(billAmount, tipPercentage, tipAmount, totalAmount, people, perPerson, tipPerPerson);
    }

    calculateDiscount() {
        const originalPrice = parseFloat(document.getElementById('originalPrice').value);
        const discountPercentage = parseFloat(document.getElementById('discountPercentage').value);

        if (isNaN(originalPrice) || isNaN(discountPercentage)) {
            this.showError('Please enter valid numbers!', 'discountResults');
            return;
        }

        const discountAmount = (originalPrice * discountPercentage) / 100;
        const finalPrice = originalPrice - discountAmount;
        const savings = discountAmount;

        this.displayDiscountResults(originalPrice, discountPercentage, discountAmount, finalPrice, savings);
    }

    calculateGrade() {
        const correctAnswers = parseInt(document.getElementById('correctAnswers').value);
        const totalQuestions = parseInt(document.getElementById('totalQuestions').value);

        if (isNaN(correctAnswers) || isNaN(totalQuestions)) {
            this.showError('Please enter valid numbers!', 'gradeResults');
            return;
        }

        if (totalQuestions === 0) {
            this.showError('Total questions cannot be zero!', 'gradeResults');
            return;
        }

        if (correctAnswers > totalQuestions) {
            this.showError('Correct answers cannot exceed total questions!', 'gradeResults');
            return;
        }

        const percentage = (correctAnswers / totalQuestions) * 100;
        const letterGrade = this.getLetterGrade(percentage);
        const incorrectAnswers = totalQuestions - correctAnswers;

        this.displayGradeResults(correctAnswers, totalQuestions, percentage, letterGrade, incorrectAnswers);
    }

    displayBasicResults(value, percentage, result) {
        const container = document.getElementById('basicResults');
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number">${this.formatNumber(result)}</span>
                <span class="result-label">${percentage}% of ${this.formatNumber(value)}</span>
            </div>

            <div class="formula-display">
                <div class="formula-title">Formula</div>
                <div class="formula-text">${this.formatNumber(value)} × ${percentage}% = ${this.formatNumber(result)}</div>
            </div>

            <div class="progress-container">
                <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%">
                    <span class="progress-text">${percentage}%</span>
                </div>
            </div>

            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-item-label">Original Value:</span>
                    <span class="result-item-value">${this.formatNumber(value)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Percentage:</span>
                    <span class="result-item-value">${percentage}%</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Result:</span>
                    <span class="result-item-value">${this.formatNumber(result)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Remainder:</span>
                    <span class="result-item-value">${this.formatNumber(value - result)}</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
        container.classList.add('success-animation');
        
        setTimeout(() => {
            container.classList.remove('success-animation');
        }, 600);
    }

    displayChangeResults(oldValue, newValue, change, percentageChange, isIncrease) {
        const container = document.getElementById('changeResults');
        const changeText = isIncrease ? 'Increase' : 'Decrease';
        const changeColor = isIncrease ? '#4ecdc4' : '#ff6b6b';
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number" style="color: ${changeColor}">${Math.abs(percentageChange).toFixed(2)}%</span>
                <span class="result-label">${changeText}</span>
            </div>

            <div class="formula-display">
                <div class="formula-title">Formula</div>
                <div class="formula-text">(${this.formatNumber(newValue)} - ${this.formatNumber(oldValue)}) / ${this.formatNumber(oldValue)} × 100</div>
            </div>

            <div class="comparison-chart">
                <div class="chart-item">
                    <span class="chart-value">${this.formatNumber(oldValue)}</span>
                    <span class="chart-label">Old Value</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">${this.formatNumber(newValue)}</span>
                    <span class="chart-label">New Value</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value" style="color: ${changeColor}">${isIncrease ? '+' : ''}${this.formatNumber(change)}</span>
                    <span class="chart-label">Change</span>
                </div>
            </div>

            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-item-label">Type of Change:</span>
                    <span class="result-item-value" style="color: ${changeColor}">${changeText}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Absolute Change:</span>
                    <span class="result-item-value">${this.formatNumber(Math.abs(change))}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Percentage Change:</span>
                    <span class="result-item-value">${Math.abs(percentageChange).toFixed(2)}%</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    displayOfResults(part, whole, percentage) {
        const container = document.getElementById('ofResults');
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number">${percentage.toFixed(2)}%</span>
                <span class="result-label">${this.formatNumber(part)} is ${percentage.toFixed(2)}% of ${this.formatNumber(whole)}</span>
            </div>

            <div class="progress-container">
                <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%">
                    <span class="progress-text">${percentage.toFixed(1)}%</span>
                </div>
            </div>

            <div class="formula-display">
                <div class="formula-title">Formula</div>
                <div class="formula-text">(${this.formatNumber(part)} / ${this.formatNumber(whole)}) × 100 = ${percentage.toFixed(2)}%</div>
            </div>

            <div class="comparison-chart">
                <div class="chart-item">
                    <span class="chart-value">${this.formatNumber(part)}</span>
                    <span class="chart-label">Part</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">${this.formatNumber(whole)}</span>
                    <span class="chart-label">Whole</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">${this.formatNumber(whole - part)}</span>
                    <span class="chart-label">Remainder</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    displayTipResults(billAmount, tipPercentage, tipAmount, totalAmount, people, perPerson, tipPerPerson) {
        const container = document.getElementById('tipResults');
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number">$${totalAmount.toFixed(2)}</span>
                <span class="result-label">Total Amount</span>
            </div>

            <div class="tip-breakdown">
                <div class="tip-item">
                    <span class="tip-percentage">${tipPercentage}%</span>
                    <span class="tip-amount">$${tipAmount.toFixed(2)}</span>
                    <span class="tip-total">Tip Amount</span>
                </div>
                <div class="tip-item">
                    <span class="tip-percentage">Bill</span>
                    <span class="tip-amount">$${billAmount.toFixed(2)}</span>
                    <span class="tip-total">Original</span>
                </div>
                <div class="tip-item">
                    <span class="tip-percentage">Per Person</span>
                    <span class="tip-amount">$${perPerson.toFixed(2)}</span>
                    <span class="tip-total">Each Pays</span>
                </div>
            </div>

            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-item-label">Bill Amount:</span>
                    <span class="result-item-value">$${billAmount.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Tip (${tipPercentage}%):</span>
                    <span class="result-item-value">$${tipAmount.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Total Amount:</span>
                    <span class="result-item-value">$${totalAmount.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Number of People:</span>
                    <span class="result-item-value">${people}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Per Person Total:</span>
                    <span class="result-item-value">$${perPerson.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Tip Per Person:</span>
                    <span class="result-item-value">$${tipPerPerson.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    displayDiscountResults(originalPrice, discountPercentage, discountAmount, finalPrice, savings) {
        const container = document.getElementById('discountResults');
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number">$${finalPrice.toFixed(2)}</span>
                <span class="result-label">Final Price</span>
            </div>

            <div class="discount-summary">
                <div class="savings-amount">$${savings.toFixed(2)}</div>
                <div class="savings-label">You Save ${discountPercentage}%!</div>
            </div>

            <div class="comparison-chart">
                <div class="chart-item">
                    <span class="chart-value">$${originalPrice.toFixed(2)}</span>
                    <span class="chart-label">Original</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">-$${discountAmount.toFixed(2)}</span>
                    <span class="chart-label">Discount</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">$${finalPrice.toFixed(2)}</span>
                    <span class="chart-label">Final</span>
                </div>
            </div>

            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-item-label">Original Price:</span>
                    <span class="result-item-value">$${originalPrice.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Discount (${discountPercentage}%):</span>
                    <span class="result-item-value">-$${discountAmount.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Final Price:</span>
                    <span class="result-item-value">$${finalPrice.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">You Save:</span>
                    <span class="result-item-value">$${savings.toFixed(2)} (${discountPercentage}%)</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    displayGradeResults(correct, total, percentage, letterGrade, incorrect) {
        const container = document.getElementById('gradeResults');
        
        container.innerHTML = `
            <div class="result-main">
                <span class="result-number">${percentage.toFixed(1)}%</span>
                <span class="result-label">Grade ${letterGrade}</span>
            </div>

            <div class="grade-scale">
                <div class="grade-item grade-a ${letterGrade === 'A' ? 'active' : ''}">A (90-100%)</div>
                <div class="grade-item grade-b ${letterGrade === 'B' ? 'active' : ''}">B (80-89%)</div>
                <div class="grade-item grade-c ${letterGrade === 'C' ? 'active' : ''}">C (70-79%)</div>
                <div class="grade-item grade-d ${letterGrade === 'D' ? 'active' : ''}">D (60-69%)</div>
                <div class="grade-item grade-f ${letterGrade === 'F' ? 'active' : ''}">F (0-59%)</div>
            </div>

            <div class="progress-container">
                <div class="progress-bar" style="width: ${percentage}%">
                    <span class="progress-text">${percentage.toFixed(1)}%</span>
                </div>
            </div>

            <div class="comparison-chart">
                <div class="chart-item">
                    <span class="chart-value">${correct}</span>
                    <span class="chart-label">Correct</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">${incorrect}</span>
                    <span class="chart-label">Incorrect</span>
                </div>
                <div class="chart-item">
                    <span class="chart-value">${total}</span>
                    <span class="chart-label">Total</span>
                </div>
            </div>

            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-item-label">Correct Answers:</span>
                    <span class="result-item-value">${correct} / ${total}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Percentage:</span>
                    <span class="result-item-value">${percentage.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Letter Grade:</span>
                    <span class="result-item-value">${letterGrade}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Incorrect:</span>
                    <span class="result-item-value">${incorrect}</span>
                </div>
            </div>
        `;
        
        container.style.display = 'block';
    }

    getLetterGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    formatNumber(num) {
        if (num % 1 === 0) {
            return num.toLocaleString();
        } else {
            return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
    }

    showError(message, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="error-message">
                ⚠️ ${message}
            </div>
        `;
        container.style.display = 'block';
    }

    clearPanel(panel) {
        const inputs = panel.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });

        const resultContainer = panel.querySelector('.result-section');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
    }

    generateExamples() {
        const examplesContainer = document.getElementById('examplesContainer');
        if (!examplesContainer) return;

        const examples = [
            {
                title: "Calculate 25% of 200",
                calculation: "200 × 25% = 50",
                result: "25% of 200 is 50"
            },
            {
                title: "Price increased from $100 to $120",
                calculation: "(120 - 100) / 100 × 100 = 20%",
                result: "20% increase"
            },
            {
                title: "15% tip on $80 bill",
                calculation: "80 × 15% = $12",
                result: "Tip: $12, Total: $92"
            },
            {
                title: "30% discount on $150 item",
                calculation: "150 × 30% = $45 off",
                result: "Final price: $105"
            }
        ];

        examplesContainer.innerHTML = examples.map(example => `
            <div class="example-card">
                <div class="example-title">${example.title}</div>
                <div class="example-calculation">${example.calculation}</div>
                <div class="example-result">${example.result}</div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PercentageCalculator();
}); 