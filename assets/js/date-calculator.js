/**
 * DATE CALCULATOR JAVASCRIPT
 * Tính toán khoảng cách giữa các ngày, thêm/trừ ngày, và các phép tính ngày tháng khác
 */

class DateCalculator {
    constructor() {
        this.initializeEventListeners();
        this.setCurrentDate();
        this.initializeCalendar();
    }

    initializeEventListeners() {
        // Date Difference Calculator
        const diffBtn = document.getElementById('calculateDifference');
        if (diffBtn) {
            diffBtn.addEventListener('click', () => this.calculateDateDifference());
        }

        // Add/Subtract Days Calculator
        const addBtn = document.getElementById('calculateAddSubtract');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.calculateAddSubtract());
        }

        // Working Days Calculator
        const workingBtn = document.getElementById('calculateWorkingDays');
        if (workingBtn) {
            workingBtn.addEventListener('click', () => this.calculateWorkingDays());
        }

        // Clear buttons
        const clearBtns = document.querySelectorAll('.btn-clear');
        clearBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.calculator-card');
                this.clearCalculator(card);
            });
        });

        // Enter key support
        this.addEnterKeySupport();
    }

    setCurrentDate() {
        const today = new Date();
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        // Set current date for all date inputs
        const currentDateInputs = document.querySelectorAll('input[type="date"]');
        currentDateInputs.forEach((input, index) => {
            if (index === 0 || input.id.includes('start') || input.id.includes('from')) {
                input.value = formatDate(today);
            } else if (input.id.includes('end') || input.id.includes('to')) {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                input.value = formatDate(tomorrow);
            }
        });
    }

    addEnterKeySupport() {
        const inputs = document.querySelectorAll('input[type="date"], input[type="number"], select');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const card = input.closest('.calculator-card');
                    const calculateBtn = card.querySelector('.btn-calculate');
                    if (calculateBtn) {
                        calculateBtn.click();
                    }
                }
            });
        });
    }

    calculateDateDifference() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);

        if (!this.validateDates(startDate, endDate, 'diffResults')) return;

        if (endDate < startDate) {
            this.showError('End date must be after start date!', 'diffResults');
            return;
        }

        const diff = this.getDateDifference(startDate, endDate);
        this.displayDifference(diff, startDate, endDate);
    }

    calculateAddSubtract() {
        const baseDate = new Date(document.getElementById('baseDate').value);
        const daysToAdd = parseInt(document.getElementById('daysToAdd').value);
        const operation = document.getElementById('operation').value;

        if (!baseDate || isNaN(daysToAdd)) {
            this.showError('Please enter valid date and number of days!', 'addSubtractResults');
            return;
        }

        const resultDate = new Date(baseDate);
        const actualDays = operation === 'subtract' ? -daysToAdd : daysToAdd;
        resultDate.setDate(resultDate.getDate() + actualDays);

        this.displayAddSubtractResult(baseDate, daysToAdd, operation, resultDate);
    }

    calculateWorkingDays() {
        const startDate = new Date(document.getElementById('workStartDate').value);
        const endDate = new Date(document.getElementById('workEndDate').value);

        if (!this.validateDates(startDate, endDate, 'workingDaysResults')) return;

        if (endDate < startDate) {
            this.showError('End date must be after start date!', 'workingDaysResults');
            return;
        }

        const workingDays = this.calculateBusinessDays(startDate, endDate);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const weekendDays = totalDays - workingDays;

        this.displayWorkingDaysResult(startDate, endDate, workingDays, weekendDays, totalDays);
    }

    validateDates(date1, date2, containerId) {
        if (!date1 || !date2 || isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            this.showError('Please select valid dates!', containerId);
            return false;
        }
        return true;
    }

    getDateDifference(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const weeks = Math.floor(daysDiff / 7);
        const hours = daysDiff * 24;
        const minutes = hours * 60;
        const seconds = minutes * 60;

        return {
            years,
            months,
            days: days,
            totalDays: daysDiff,
            weeks,
            hours,
            minutes,
            seconds
        };
    }

    calculateBusinessDays(startDate, endDate) {
        let count = 0;
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return count;
    }

    displayDifference(diff, startDate, endDate) {
        const container = document.getElementById('diffResults');
        
        container.innerHTML = `
            <div class="result-grid">
                <div class="result-card">
                    <span class="result-number">${diff.years}</span>
                    <span class="result-label">Years</span>
                </div>
                <div class="result-card">
                    <span class="result-number">${diff.months}</span>
                    <span class="result-label">Months</span>
                </div>
                <div class="result-card">
                    <span class="result-number">${diff.days}</span>
                    <span class="result-label">Days</span>
                </div>
                <div class="result-card">
                    <span class="result-number">${diff.weeks}</span>
                    <span class="result-label">Weeks</span>
                </div>
            </div>

            <div class="result-details">
                <div class="result-item">
                    <span class="result-item-label">Exact Difference:</span>
                    <span class="result-item-value">${diff.years} years, ${diff.months} months, ${diff.days} days</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Total Days:</span>
                    <span class="result-item-value">${diff.totalDays.toLocaleString()} days</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Total Hours:</span>
                    <span class="result-item-value">${diff.hours.toLocaleString()} hours</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Total Minutes:</span>
                    <span class="result-item-value">${diff.minutes.toLocaleString()} minutes</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Start Date:</span>
                    <span class="result-item-value">${this.formatDateLong(startDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">End Date:</span>
                    <span class="result-item-value">${this.formatDateLong(endDate)}</span>
                </div>
            </div>
        `;

        container.style.display = 'block';
    }

    displayAddSubtractResult(baseDate, daysCount, operation, resultDate) {
        const container = document.getElementById('addSubtractResults');
        const operationText = operation === 'add' ? 'added to' : 'subtracted from';
        const sign = operation === 'add' ? '+' : '-';
        
        container.innerHTML = `
            <div class="result-details">
                <div class="result-item">
                    <span class="result-item-label">Operation:</span>
                    <span class="result-item-value">${daysCount} days ${operationText} ${this.formatDateLong(baseDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Formula:</span>
                    <span class="result-item-value">${this.formatDateShort(baseDate)} ${sign} ${daysCount} days</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Result Date:</span>
                    <span class="result-item-value">${this.formatDateLong(resultDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Day of Week:</span>
                    <span class="result-item-value">${this.getDayOfWeek(resultDate)}</span>
                </div>
            </div>

            <div class="format-options">
                <div class="format-option">
                    <div class="format-label">ISO Format:</div>
                    <div class="format-example">${resultDate.toISOString().split('T')[0]}</div>
                </div>
                <div class="format-option">
                    <div class="format-label">US Format:</div>
                    <div class="format-example">${resultDate.toLocaleDateString('en-US')}</div>
                </div>
                <div class="format-option">
                    <div class="format-label">Long Format:</div>
                    <div class="format-example">${this.formatDateLong(resultDate)}</div>
                </div>
            </div>
        `;

        container.style.display = 'block';
    }

    displayWorkingDaysResult(startDate, endDate, workingDays, weekendDays, totalDays) {
        const container = document.getElementById('workingDaysResults');
        
        container.innerHTML = `
            <div class="working-days-section">
                <div class="working-days-title">Working Days Analysis</div>
                <div class="working-days-grid">
                    <div class="working-days-item">
                        <span class="working-days-number">${workingDays}</span>
                        <span class="working-days-label">Working Days</span>
                    </div>
                    <div class="working-days-item">
                        <span class="working-days-number">${weekendDays}</span>
                        <span class="working-days-label">Weekend Days</span>
                    </div>
                    <div class="working-days-item">
                        <span class="working-days-number">${totalDays}</span>
                        <span class="working-days-label">Total Days</span>
                    </div>
                    <div class="working-days-item">
                        <span class="working-days-number">${Math.round((workingDays / totalDays) * 100)}%</span>
                        <span class="working-days-label">Work Ratio</span>
                    </div>
                </div>
            </div>

            <div class="result-details">
                <div class="result-item">
                    <span class="result-item-label">Period:</span>
                    <span class="result-item-value">${this.formatDateShort(startDate)} to ${this.formatDateShort(endDate)}</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Working Weeks:</span>
                    <span class="result-item-value">${(workingDays / 5).toFixed(1)} weeks</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Working Hours (8h/day):</span>
                    <span class="result-item-value">${workingDays * 8} hours</span>
                </div>
                <div class="result-item">
                    <span class="result-item-label">Working Hours (7.5h/day):</span>
                    <span class="result-item-value">${workingDays * 7.5} hours</span>
                </div>
            </div>
        `;

        container.style.display = 'block';
    }

    formatDateLong(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateShort(date) {
        return date.toLocaleDateString('en-US');
    }

    getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    initializeCalendar() {
        const today = new Date();
        this.currentCalendarDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.renderCalendar();
        this.setupCalendarNavigation();
    }

    setupCalendarNavigation() {
        const prevBtn = document.getElementById('calendarPrev');
        const nextBtn = document.getElementById('calendarNext');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
                this.renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
                this.renderCalendar();
            });
        }
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarTitle = document.getElementById('calendarTitle');
        
        if (!calendarGrid || !calendarTitle) return;

        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        calendarTitle.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Clear calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const currentDate = new Date(year, month, day);
            
            // Highlight today
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Highlight weekends
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                dayElement.classList.add('weekend');
            }

            // Add click event
            dayElement.addEventListener('click', () => {
                this.selectCalendarDate(currentDate);
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    selectCalendarDate(date) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked date
        event.target.classList.add('selected');

        // Update any focused date input
        const focusedInput = document.activeElement;
        if (focusedInput && focusedInput.type === 'date') {
            focusedInput.value = date.toISOString().split('T')[0];
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

    clearCalculator(card) {
        const inputs = card.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'date') {
                input.value = '';
            } else if (input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });

        const resultContainer = card.querySelector('.results-section');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }

        // Reset to current date
        setTimeout(() => {
            this.setCurrentDate();
        }, 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DateCalculator();
}); 