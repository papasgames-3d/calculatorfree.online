/**
 * AGE CALCULATOR JAVASCRIPT
 * Tính tuổi chi tiết từ ngày sinh hoặc tại một thời điểm cụ thể
 */

class AgeCalculator {
    constructor() {
        this.initializeEventListeners();
        this.initializeFAQ();
        this.setCurrentDate();
    }

    initializeEventListeners() {
        // Current Age Calculator
        const currentAgeBtn = document.getElementById('calculateCurrentAge');
        if (currentAgeBtn) {
            currentAgeBtn.addEventListener('click', () => this.calculateCurrentAge());
        }

        // Age at Date Calculator
        const ageAtDateBtn = document.getElementById('calculateAgeAtDate');
        if (ageAtDateBtn) {
            ageAtDateBtn.addEventListener('click', () => this.calculateAgeAtDate());
        }

        // Clear buttons
        const clearCurrentBtn = document.getElementById('clearCurrent');
        if (clearCurrentBtn) {
            clearCurrentBtn.addEventListener('click', () => this.clearCurrentAge());
        }

        const clearDateBtn = document.getElementById('clearDate');
        if (clearDateBtn) {
            clearDateBtn.addEventListener('click', () => this.clearAgeAtDate());
        }

        // Enter key support
        this.addEnterKeySupport();
    }

    setCurrentDate() {
        const today = new Date();
        const currentDateField = document.getElementById('currentDate');
        if (currentDateField) {
            currentDateField.valueAsDate = today;
        }
    }

    addEnterKeySupport() {
        const inputs = document.querySelectorAll('input[type="date"], input[type="number"], select');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const section = input.closest('.calculator-section');
                    const calculateBtn = section.querySelector('.btn-primary');
                    if (calculateBtn) {
                        calculateBtn.click();
                    }
                }
            });
        });
    }

    calculateCurrentAge() {
        const birthDate = this.getBirthDate('birth');
        if (!birthDate) return;

        const today = new Date();
        const age = this.calculateAge(birthDate, today);
        
        this.displayCurrentAgeResults(age, birthDate, today);
    }

    calculateAgeAtDate() {
        const birthDate = this.getBirthDate('birthAtDate');
        const targetDate = this.getTargetDate();
        
        if (!birthDate || !targetDate) return;

        if (targetDate < birthDate) {
            this.showError('Target date cannot be before birth date!', 'ageAtDateResults');
            return;
        }

        const age = this.calculateAge(birthDate, targetDate);
        this.displayAgeAtDateResults(age, birthDate, targetDate);
    }

    getBirthDate(prefix) {
        const day = parseInt(document.getElementById(`${prefix}Day`).value);
        const month = parseInt(document.getElementById(`${prefix}Month`).value) - 1; // JS months are 0-indexed
        const year = parseInt(document.getElementById(`${prefix}Year`).value);

        if (!day || month < 0 || !year) {
            this.showError('Please enter a valid birth date!', `${prefix === 'birth' ? 'currentAge' : 'ageAtDate'}Results`);
            return null;
        }

        if (year < 1900 || year > new Date().getFullYear()) {
            this.showError('Please enter a valid year (1900-' + new Date().getFullYear() + ')!', `${prefix === 'birth' ? 'currentAge' : 'ageAtDate'}Results`);
            return null;
        }

        const date = new Date(year, month, day);
        
        // Validate the date
        if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
            this.showError('Invalid date! Please check your input.', `${prefix === 'birth' ? 'currentAge' : 'ageAtDate'}Results`);
            return null;
        }

        return date;
    }

    getTargetDate() {
        const targetInput = document.getElementById('targetDate');
        if (!targetInput.value) {
            this.showError('Please select a target date!', 'ageAtDateResults');
            return null;
        }
        return new Date(targetInput.value);
    }

    calculateAge(birthDate, targetDate) {
        let years = targetDate.getFullYear() - birthDate.getFullYear();
        let months = targetDate.getMonth() - birthDate.getMonth();
        let days = targetDate.getDate() - birthDate.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total values
        const totalDays = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24));
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;

        return {
            years,
            months,
            days,
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
            totalWeeks,
            totalMonths
        };
    }

    displayCurrentAgeResults(age, birthDate, currentDate) {
        const resultsContainer = document.getElementById('currentAgeResults');
        
        const nextBirthday = this.getNextBirthday(birthDate);
        const daysUntilBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
        
        const zodiacSign = this.getZodiacSign(birthDate);
        const dayOfWeek = this.getDayOfWeek(birthDate);
        
        resultsContainer.innerHTML = `
            <div class="age-breakdown">
                <div class="age-stat">
                    <span class="age-number">${age.years}</span>
                    <span class="age-unit">Years</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.months}</span>
                    <span class="age-unit">Months</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.days}</span>
                    <span class="age-unit">Days</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.totalWeeks.toLocaleString()}</span>
                    <span class="age-unit">Weeks</span>
                </div>
            </div>

            <div class="results-container">
                <div class="result-item">
                    <span class="result-label">Exact Age:</span>
                    <span class="result-value">${age.years} years, ${age.months} months, ${age.days} days</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Days:</span>
                    <span class="result-value">${age.totalDays.toLocaleString()} days</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Hours:</span>
                    <span class="result-value">${age.totalHours.toLocaleString()} hours</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Minutes:</span>
                    <span class="result-value">${age.totalMinutes.toLocaleString()} minutes</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Born on:</span>
                    <span class="result-value">${dayOfWeek}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Zodiac Sign:</span>
                    <span class="result-value">${zodiacSign}</span>
                </div>
            </div>

            <div class="next-birthday">
                <strong>Next Birthday:</strong> ${daysUntilBirthday} days to go!
                <br><small>${nextBirthday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
            </div>

            ${this.getMilestoneAlert(age.years)}
        `;

        resultsContainer.style.display = 'block';
    }

    displayAgeAtDateResults(age, birthDate, targetDate) {
        const resultsContainer = document.getElementById('ageAtDateResults');
        
        const zodiacSign = this.getZodiacSign(birthDate);
        const dayOfWeek = this.getDayOfWeek(birthDate);
        
        resultsContainer.innerHTML = `
            <div class="age-breakdown">
                <div class="age-stat">
                    <span class="age-number">${age.years}</span>
                    <span class="age-unit">Years</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.months}</span>
                    <span class="age-unit">Months</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.days}</span>
                    <span class="age-unit">Days</span>
                </div>
                <div class="age-stat">
                    <span class="age-number">${age.totalWeeks.toLocaleString()}</span>
                    <span class="age-unit">Weeks</span>
                </div>
            </div>

            <div class="results-container">
                <div class="result-item">
                    <span class="result-label">Age on ${targetDate.toLocaleDateString()}:</span>
                    <span class="result-value">${age.years} years, ${age.months} months, ${age.days} days</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Days Lived:</span>
                    <span class="result-value">${age.totalDays.toLocaleString()} days</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Hours Lived:</span>
                    <span class="result-value">${age.totalHours.toLocaleString()} hours</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Born on:</span>
                    <span class="result-value">${dayOfWeek}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Zodiac Sign:</span>
                    <span class="result-value">${zodiacSign}</span>
                </div>
            </div>

            ${this.getMilestoneAlert(age.years)}
        `;

        resultsContainer.style.display = 'block';
    }

    getNextBirthday(birthDate) {
        const today = new Date();
        const thisYear = today.getFullYear();
        let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday <= today) {
            nextBirthday.setFullYear(thisYear + 1);
        }
        
        return nextBirthday;
    }

    getZodiacSign(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const signs = [
            {sign: 'Capricorn ♑', start: [12, 22], end: [1, 19]},
            {sign: 'Aquarius ♒', start: [1, 20], end: [2, 18]},
            {sign: 'Pisces ♓', start: [2, 19], end: [3, 20]},
            {sign: 'Aries ♈', start: [3, 21], end: [4, 19]},
            {sign: 'Taurus ♉', start: [4, 20], end: [5, 20]},
            {sign: 'Gemini ♊', start: [5, 21], end: [6, 20]},
            {sign: 'Cancer ♋', start: [6, 21], end: [7, 22]},
            {sign: 'Leo ♌', start: [7, 23], end: [8, 22]},
            {sign: 'Virgo ♍', start: [8, 23], end: [9, 22]},
            {sign: 'Libra ♎', start: [9, 23], end: [10, 22]},
            {sign: 'Scorpio ♏', start: [10, 23], end: [11, 21]},
            {sign: 'Sagittarius ♐', start: [11, 22], end: [12, 21]}
        ];
        
        for (let zodiac of signs) {
            const [startMonth, startDay] = zodiac.start;
            const [endMonth, endDay] = zodiac.end;
            
            if ((month === startMonth && day >= startDay) || 
                (month === endMonth && day <= endDay)) {
                return zodiac.sign;
            }
        }
        
        return 'Capricorn ♑'; // Default for Dec 22-31
    }

    getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    getMilestoneAlert(years) {
        const milestones = [1, 5, 10, 13, 16, 18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100];
        
        if (milestones.includes(years)) {
            return `
                <div class="milestone-alert">
                    🎉 Milestone Birthday! You're ${years} years old! 🎉
                </div>
            `;
        }
        return '';
    }

    showError(message, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="background: #ff6b6b; color: white; padding: 20px; border-radius: 10px; text-align: center; font-weight: 600;">
                ⚠️ ${message}
            </div>
        `;
        container.style.display = 'block';
    }

    clearCurrentAge() {
        document.getElementById('birthDay').value = '';
        document.getElementById('birthMonth').value = '';
        document.getElementById('birthYear').value = '';
        document.getElementById('currentAgeResults').style.display = 'none';
    }

    clearAgeAtDate() {
        document.getElementById('birthAtDateDay').value = '';
        document.getElementById('birthAtDateMonth').value = '';
        document.getElementById('birthAtDateYear').value = '';
        document.getElementById('targetDate').value = '';
        document.getElementById('ageAtDateResults').style.display = 'none';
    }

    initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    populateYearDropdowns() {
        const currentYear = new Date().getFullYear();
        const startYear = 1900;
        
        const yearSelects = document.querySelectorAll('select[id$="Year"]');
        yearSelects.forEach(select => {
            select.innerHTML = '<option value="">Year</option>';
            for (let year = currentYear; year >= startYear; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                select.appendChild(option);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new AgeCalculator();
    calculator.populateYearDropdowns();
}); 