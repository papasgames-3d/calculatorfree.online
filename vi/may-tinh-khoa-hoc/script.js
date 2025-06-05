class EnhancedTemplateCalculator {  
    constructor() {  
        this.currentTemplate = null;  
        this.parameters = [];  
        this.activeParamIndex = 0;  
        this.cursorPosition = 0;  
        this.memory = 0;  
        this.history = this.loadHistory();  
        this.undoStack = [];  
        this.redoStack = [];  
        this.isRadianMode = false;  
        
        this.initElements();  
        this.setupEventListeners();  
        this.updateDisplay();  
    }  

    initElements() {  
        this.visualExpression = document.getElementById('visualExpression');  
        this.parameterGuide = document.getElementById('parameterGuide');  
        this.resultDisplay = document.getElementById('resultDisplay');  
        this.helpPanel = document.getElementById('helpPanel');  
        this.historyPanel = document.getElementById('historyPanel');  
        this.historyContent = document.getElementById('historyContent');  
        this.angleMode = document.getElementById('angleMode');  
        
        // Navigation buttons  
        this.moveLeftBtn = document.getElementById('moveLeft');  
        this.moveRightBtn = document.getElementById('moveRight');  
        this.moveUpBtn = document.getElementById('moveUp');  
        this.moveDownBtn = document.getElementById('moveDown');  
    }  

    setupEventListeners() {  
        this.angleMode.addEventListener('change', () => {  
            this.isRadianMode = this.angleMode.checked;  
            this.calculateLiveResult();  
        });  

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));  
    }  

    // Enhanced template definitions  
    getTemplates() {  
        return {  
            'power': {  
                name: 'x^y',  
                display: '{x}^{y}',  
                params: ['x', 'y'],  
                mathjs: 'pow({x}, {y})',  
                description: 'x mũ y',  
                example: '2^3 = 8'  
            },  
            'root': {  
                name: 'ʸ√x',  
                display: 'ʸ√{x}',  
                params: ['y', 'x'],  
                mathjs: 'nthRoot({x}, {y})',  
                description: 'căn bậc y của x',  
                example: '3√8 = 2'  
            },  
            'log_base': {  
                name: 'log_y(x)',  
                display: 'log_{y}({x})',  
                params: ['y', 'x'],  
                mathjs: 'log({x}) / log({y})',  
                description: 'logarit cơ số y của x',  
                example: 'log₂(8) = 3'  
            },  
            'trig': {  
                name: 'trig(x)',  
                display: '{func}({x})',  
                params: ['x'],  
                mathjs: '{func}({x})',  
                description: 'hàm lượng giác',  
                example: 'sin(30°) = 0.5'  
            },  
            'trig_inv': {  
                name: 'trig⁻¹(x)',  
                display: '{func}({x})',  
                params: ['x'],  
                mathjs: '{func}({x})',  
                description: 'hàm lượng giác nghịch đảo',  
                example: 'sin⁻¹(0.5) = 30°'  
            },  
            'simple_func': {  
                name: 'func(x)',  
                display: '{func}({x})',  
                params: ['x'],  
                mathjs: '{func}({x})',  
                description: 'hàm một biến',  
                example: 'ln(e) = 1'  
            },  
            'abs': {  
                name: '|x|',  
                display: '|{x}|',  
                params: ['x'],  
                mathjs: 'abs({x})',  
                description: 'trị tuyệt đối của x',  
                example: '|-5| = 5'  
            },  
            'round': {  
                name: 'round(x)',  
                display: '{symbol}{x}{symbol}',  
                params: ['x'],  
                mathjs: '{func}({x})',  
                description: 'làm tròn x',  
                example: '⌊3.7⌋ = 3, ⌈3.2⌉ = 4'  
            },  
            'factorial': {  
                name: 'x!',  
                display: '{x}!',  
                params: ['x'],  
                mathjs: 'factorial({x})',  
                description: 'giai thừa của x',  
                example: '5! = 120'  
            },  
            'two_param': {  
                name: 'func(x,y)',  
                display: '{func}({x}, {y})',  
                params: ['x', 'y'],  
                mathjs: '{func}({x}, {y})',  
                description: 'hàm hai biến',  
                example: 'gcd(12, 8) = 4'  
            },  
            'mod': {  
                name: 'x mod y',  
                display: '{x} mod {y}',  
                params: ['x', 'y'],  
                mathjs: 'mod({x}, {y})',  
                description: 'x chia lấy dư y',  
                example: '7 mod 3 = 1'  
            },  
            'reciprocal': {  
                name: '1/x',  
                display: '1/{x}',  
                params: ['x'],  
                mathjs: '1/({x})',  
                description: 'nghịch đảo của x',  
                example: '1/4 = 0.25'  
            },  
            'exp_base': {  
                name: 'e^x',  
                display: 'e^{x}',  
                params: ['x'],  
                mathjs: 'exp({x})',  
                description: 'e mũ x',  
                example: 'e^1 = 2.718'  
            },  
            'power_10': {  
                name: '10^x',  
                display: '10^{x}',  
                params: ['x'],  
                mathjs: 'pow(10, {x})',  
                description: '10 mũ x',  
                example: '10^2 = 100'  
            }  
        };  
    }  

    // Insert template function with enhanced functionality  
    insertTemplate(templateType, funcName = '') {  
        const templates = this.getTemplates();  
        const template = templates[templateType];  
        
        if (!template) return;  

        // Save current state for undo  
        this.saveState();  

        this.currentTemplate = {  
            ...template,  
            type: templateType,  
            funcName: funcName  
        };  
        
        this.parameters = template.params.map(() => '');  
        this.activeParamIndex = 0;  
        this.cursorPosition = 0;  
        
        this.updateDisplay();  
        this.updateParameterGuide();  
        this.updateNavigationState();  
    }  

    // Enhanced navigation with proper cursor movement  
    moveCursor(direction) {  
        if (!this.currentTemplate) return;  
        
        const currentParam = this.parameters[this.activeParamIndex] || '';  
        
        if (direction === 'left' && this.cursorPosition > 0) {  
            this.cursorPosition--;  
        } else if (direction === 'right' && this.cursorPosition < currentParam.length) {  
            this.cursorPosition++;  
        }  
        
        this.updateDisplay();  
        this.updateNavigationState();  
    }  

    moveToParam(direction) {  
        if (!this.currentTemplate) return;  
        
        if (direction === 'next' && this.activeParamIndex < this.parameters.length - 1) {  
            this.activeParamIndex++;  
            this.cursorPosition = 0;  
        } else if (direction === 'prev' && this.activeParamIndex > 0) {  
            this.activeParamIndex--;  
            this.cursorPosition = 0;  
        }  
        
        this.updateDisplay();  
        this.updateParameterGuide();  
        this.updateNavigationState();  
    }  

    updateNavigationState() {  
        // Update navigation button states  
        this.moveLeftBtn.disabled = this.cursorPosition === 0;  
        this.moveRightBtn.disabled = !this.currentTemplate ||   
            this.cursorPosition >= (this.parameters[this.activeParamIndex] || '').length;  
        this.moveUpBtn.disabled = !this.currentTemplate || this.activeParamIndex === 0;  
        this.moveDownBtn.disabled = !this.currentTemplate ||   
            this.activeParamIndex >= this.parameters.length - 1;  
        
        // Visual feedback  
        [this.moveLeftBtn, this.moveRightBtn, this.moveUpBtn, this.moveDownBtn].forEach(btn => {  
            if (btn.disabled) {  
                btn.style.opacity = '0.5';  
                btn.style.cursor = 'not-allowed';  
            } else {  
                btn.style.opacity = '1';  
                btn.style.cursor = 'pointer';  
            }  
        });  
    }  

    // Input functions with cursor support  
    insertNumber(num) {  
        if (!this.currentTemplate) {  
            this.insertDirect(num);  
            return;  
        }  
        
        this.insertIntoCurrentParam(num);  
    }  

    insertBasic(text) {  
        if (!this.currentTemplate) {  
            this.insertDirect(text);  
            return;  
        }  
        
        this.insertIntoCurrentParam(text);  
    }  

    insertIntoCurrentParam(text) {  
        if (this.activeParamIndex < this.parameters.length) {  
            const currentParam = this.parameters[this.activeParamIndex] || '';  
            const before = currentParam.slice(0, this.cursorPosition);  
            const after = currentParam.slice(this.cursorPosition);  
            
            this.parameters[this.activeParamIndex] = before + text + after;  
            this.cursorPosition += text.length;  
            
            this.updateDisplay();  
            this.calculateLiveResult();  
            this.updateNavigationState();  
        }  
    }  

    insertDirect(text) {  
        // For direct input when no template is active  
        const current = this.visualExpression.textContent;  
        if (current === 'Chọn chức năng để bắt đầu') {  
            this.visualExpression.textContent = text;  
        } else {  
            this.visualExpression.textContent += text;  
        }  
        this.calculateDirectResult();  
    }  

    insertConstant(constant) {  
        const constants = {  
            'π': 'pi',  
            'e': 'e'  
        };  
        
        const value = constants[constant] || constant;  
        
        if (!this.currentTemplate) {  
            this.insertDirect(value);  
        } else {  
            this.insertIntoCurrentParam(value);  
        }  
    }  

    // Enhanced display functions  
    updateDisplay() {  
        this.visualExpression.classList.toggle('active', !!this.currentTemplate);  
        
        if (!this.currentTemplate) {  
            this.updateParameterGuide();  
            return;  
        }  

        let display = this.currentTemplate.display;  
        
        // Handle special symbols for rounding functions  
        if (this.currentTemplate.type === 'round') {  
            const symbols = {  
                'floor': ['⌊', '⌋'],  
                'ceil': ['⌈', '⌉'],  
                'round': ['⚬', '⚬']  
            };  
            const symbol = symbols[this.currentTemplate.funcName] || ['', ''];  
            display = display.replace(/{symbol}/g, symbol[0]);  
            display = display.replace(/{symbol}/g, symbol[1]);  
        }  
        
        // Replace function name  
        if (this.currentTemplate.funcName) {  
            display = display.replace('{func}', this.currentTemplate.funcName);  
        }  
        
        // Replace parameters with enhanced cursor support  
        this.currentTemplate.params.forEach((param, index) => {  
            const value = this.parameters[index] || '';  
            const placeholder = `{${param}}`;  
            
            if (index === this.activeParamIndex) {  
                // Show cursor in active parameter  
                const before = value.slice(0, this.cursorPosition);  
                const after = value.slice(this.cursorPosition);  
                const displayValue = value || `[${param}]`;  
                const withCursor = before + '|' + after;  
                
                display = display.replace(placeholder,   
                    `<span class="param-active">${withCursor || `[${param}]`}</span>`);  
            } else if (value) {  
                display = display.replace(placeholder,   
                    `<span class="param-filled">${value}</span>`);  
            } else {  
                display = display.replace(placeholder,   
                    `<span class="param-placeholder">${param}</span>`);  
            }  
        });  
        
        this.visualExpression.innerHTML = display;  
    }  

    updateParameterGuide() {  
        const guideText = this.parameterGuide.querySelector('.guide-text');  
        
        if (!this.currentTemplate) {  
            guideText.innerHTML = 'Nhấn nút template để bắt đầu nhập công thức';  
            return;  
        }  
        
        const currentParam = this.currentTemplate.params[this.activeParamIndex];  
        const paramNumber = this.activeParamIndex + 1;  
        const totalParams = this.currentTemplate.params.length;  
        
        guideText.innerHTML = `  
            <strong>${this.currentTemplate.description}</strong><br>  
            Đang nhập: <strong>${currentParam}</strong> (${paramNumber}/${totalParams})<br>  
            <em>${this.currentTemplate.example}</em>  
        `;  
    }  

    // Enhanced calculation functions  
    calculateLiveResult() {  
        try {  
            if (!this.currentTemplate) {  
                this.calculateDirectResult();  
                return;  
            }  
            
            // Check if all parameters are filled  
            const allFilled = this.parameters.every(param => param.trim() !== '');  
            if (!allFilled) {  
                this.resultDisplay.textContent = 'Nhập đủ tham số...';  
                return;  
            }  
            
            let expression = this.currentTemplate.mathjs;  
            
            // Replace function name  
            if (this.currentTemplate.funcName) {  
                expression = expression.replace('{func}', this.currentTemplate.funcName);  
            }  
            
            // Replace parameters  
            this.currentTemplate.params.forEach((param, index) => {  
                const value = this.parameters[index];  
                expression = expression.replace(new RegExp(`{${param}}`, 'g'), `(${value})`);  
            });  
            
            // Prepare for evaluation  
            expression = this.prepareTrigExpression(expression);  
            
            const result = math.evaluate(expression);  
            
            if (typeof result === 'number' && isFinite(result)) {  
                this.resultDisplay.textContent = this.formatNumber(result);  
            } else {  
                this.resultDisplay.textContent = 'Lỗi';  
            }  
        } catch (error) {  
            this.resultDisplay.textContent = 'Lỗi';  
        }  
    }  

    calculateDirectResult() {  
        try {  
            let expression = this.visualExpression.textContent;  
            if (!expression || expression === 'Chọn chức năng để bắt đầu') {  
                this.resultDisplay.textContent = '0';  
                return;  
            }  
            
            // Replace display symbols with math.js equivalents  
            expression = expression  
                .replace(/×/g, '*')  
                .replace(/÷/g, '/')  
                .replace(/π/g, 'pi')  
                .replace(/²/g, '^2')  
                .replace(/³/g, '^3');  
            
            expression = this.prepareTrigExpression(expression);  
            const result = math.evaluate(expression);  
            
            if (typeof result === 'number' && isFinite(result)) {  
                this.resultDisplay.textContent = this.formatNumber(result);  
            } else {  
                this.resultDisplay.textContent = 'Lỗi';  
            }  
        } catch (error) {  
            this.resultDisplay.textContent = 'Lỗi';  
        }  
    }  

    prepareTrigExpression(expr) {  
        // Handle trigonometric functions based on angle mode  
        if (!this.isRadianMode) {  
            expr = expr  
                .replace(/sin\(/g, 'sin(pi/180*')  
                .replace(/cos\(/g, 'cos(pi/180*')  
                .replace(/tan\(/g, 'tan(pi/180*');  
        }  
        
        // Handle inverse trig functions  
        if (!this.isRadianMode) {  
            expr = expr  
                .replace(/asin\(/g, '180/pi*asin(')  
                .replace(/acos\(/g, '180/pi*acos(')  
                .replace(/atan\(/g, '180/pi*atan(');  
        }  
        
        return expr;  
    }  

    formatNumber(num) {  
        if (Math.abs(num) < 1e-10) return '0';  
        if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-4 && num !== 0)) {  
            return num.toExponential(8).replace(/\.?0+e/, 'e');  
        }  
        return parseFloat(num.toPrecision(12)).toString();  
    }  

    // Calculation and completion  
    calculateResult() {  
        this.completeTemplate();  
    }  

    completeTemplate() {  
        try {  
            if (!this.currentTemplate) {  
                this.calculateDirectResult();  
                return;  
            }  
            
            const allFilled = this.parameters.every(param => param.trim() !== '');  
            if (!allFilled) {  
                alert('Vui lòng nhập đủ tất cả tham số!');  
                return;  
            }  
            
            let expression = this.currentTemplate.mathjs;  
            
            if (this.currentTemplate.funcName) {  
                expression = expression.replace('{func}', this.currentTemplate.funcName);  
            }  
            
            this.currentTemplate.params.forEach((param, index) => {  
                const value = this.parameters[index];  
                expression = expression.replace(new RegExp(`{${param}}`, 'g'), `(${value})`);  
            });  
            
            expression = this.prepareTrigExpression(expression);  
            const result = math.evaluate(expression);  
            
            if (typeof result === 'number' && isFinite(result)) {  
                const displayExpr = this.getDisplayExpression();  
                this.addToHistory(displayExpr, result);  
                
                this.clearTemplate();  
                this.visualExpression.textContent = this.formatNumber(result);  
                this.resultDisplay.textContent = '';  
                this.updateNavigationState();  
            } else {  
                throw new Error('Invalid result');  
            }  
        } catch (error) {  
            alert('Lỗi tính toán: ' + error.message);  
        }  
    }  

    getDisplayExpression() {  
        if (!this.currentTemplate) {  
            return this.visualExpression.textContent;  
        }  
        
        let display = this.currentTemplate.display;  
        
        // Handle special symbols  
        if (this.currentTemplate.type === 'round') {  
            const symbols = {  
                'floor': ['⌊', '⌋'],  
                'ceil': ['⌈', '⌉'],  
                'round': ['⚬', '⚬']  
            };  
            const symbol = symbols[this.currentTemplate.funcName] || ['', ''];  
            display = display.replace(/{symbol}/g, symbol[0]);  
            display = display.replace(/{symbol}/g, symbol[1]);  
        }  
        
        if (this.currentTemplate.funcName) {  
            display = display.replace('{func}', this.currentTemplate.funcName);  
        }  
        
        this.currentTemplate.params.forEach((param, index) => {  
            const value = this.parameters[index];  
            display = display.replace(`{${param}}`, value);  
        });  
        
        return display;  
    }  

    // Editing functions  
    clearCurrentParam() {  
        if (!this.currentTemplate) {  
            this.clearAll();  
            return;  
        }  
        
        if (this.activeParamIndex < this.parameters.length) {  
            this.parameters[this.activeParamIndex] = '';  
            this.cursorPosition = 0;  
            this.updateDisplay();  
            this.calculateLiveResult();  
            this.updateNavigationState();  
        }  
    }  

    clearTemplate() {  
        this.currentTemplate = null;  
        this.parameters = [];  
        this.activeParamIndex = 0;  
        this.cursorPosition = 0;  
        this.updateDisplay();  
        this.updateParameterGuide();  
        this.updateNavigationState();  
    }  

    clearAll() {  
        this.clearTemplate();  
        this.visualExpression.textContent = 'Chọn chức năng để bắt đầu';  
        this.resultDisplay.textContent = '0';  
        this.updateParameterGuide();  
        this.updateNavigationState();  
    }  

    clearEntry() {  
        this.clearCurrentParam();  
    }  

    backspace() {  
        if (!this.currentTemplate) {  
            const current = this.visualExpression.textContent;  
            if (current && current !== 'Chọn chức năng để bắt đầu') {  
                this.visualExpression.textContent = current.slice(0, -1);  
                this.calculateDirectResult();  
            }  
            return;  
        }  
        
        if (this.activeParamIndex < this.parameters.length && this.cursorPosition > 0) {  
            const currentParam = this.parameters[this.activeParamIndex];  
            const before = currentParam.slice(0, this.cursorPosition - 1);  
            const after = currentParam.slice(this.cursorPosition);  
            
            this.parameters[this.activeParamIndex] = before + after;  
            this.cursorPosition--;  
            
            this.updateDisplay();  
            this.calculateLiveResult();  
            this.updateNavigationState();  
        }  
    }
    toggleSign() {
        if (!this.currentTemplate) {
            const current = this.visualExpression.textContent;
            if (current && current !== 'Chọn chức năng để bắt đầu') {
                if (current.startsWith('-')) {
                    this.visualExpression.textContent = current.slice(1);
                } else {
                    this.visualExpression.textContent = '-' + current;
                }
                this.calculateDirectResult();
            }
            return;
        }
        
        if (this.activeParamIndex < this.parameters.length) {
            const currentParam = this.parameters[this.activeParamIndex];
            if (currentParam.startsWith('-')) {
                this.parameters[this.activeParamIndex] = currentParam.slice(1);
            } else {
                this.parameters[this.activeParamIndex] = '-' + currentParam;
            }
            
            this.updateDisplay();
            this.calculateLiveResult();
            this.updateNavigationState();
        }
    }

    percentage() {
        if (!this.currentTemplate) {
            this.insertDirect('/100');
        } else {
            this.insertIntoCurrentParam('/100');
        }
    }

    // Memory functions
    memoryAction(action) {
        try {
            const currentValue = parseFloat(this.resultDisplay.textContent) || 0;
            
            switch (action) {
                case 'clear':
                    this.memory = 0;
                    this.saveMemory();
                    break;
                case 'recall':
                    if (!this.currentTemplate) {
                        this.visualExpression.textContent = this.memory.toString();
                        this.calculateDirectResult();
                    } else {
                        this.insertIntoCurrentParam(this.memory.toString());
                    }
                    break;
                case 'store':
                    this.memory = currentValue;
                    this.saveMemory();
                    break;
                case 'add':
                    this.memory += currentValue;
                    this.saveMemory();
                    break;
            }
        } catch (error) {
            console.error('Memory operation error:', error);
        }
    }

    saveMemory() {
        localStorage.setItem('templateCalcMemory', this.memory.toString());
    }

    loadMemory() {
        return parseFloat(localStorage.getItem('templateCalcMemory')) || 0;
    }

    // State management for undo/redo
    saveState() {
        const state = {
            currentTemplate: this.currentTemplate,
            parameters: [...this.parameters],
            activeParamIndex: this.activeParamIndex,
            cursorPosition: this.cursorPosition,
            visualContent: this.visualExpression.textContent
        };
        
        this.undoStack.push(state);
        this.redoStack = []; // Clear redo stack when new action is performed
        
        // Limit undo stack size
        if (this.undoStack.length > 20) {
            this.undoStack.shift();
        }
    }

    undoLastAction() {
        if (this.undoStack.length > 0) {
            // Save current state to redo stack
            this.redoStack.push({
                currentTemplate: this.currentTemplate,
                parameters: [...this.parameters],
                activeParamIndex: this.activeParamIndex,
                cursorPosition: this.cursorPosition,
                visualContent: this.visualExpression.textContent
            });
            
            // Restore previous state
            const previousState = this.undoStack.pop();
            this.currentTemplate = previousState.currentTemplate;
            this.parameters = [...previousState.parameters];
            this.activeParamIndex = previousState.activeParamIndex;
            this.cursorPosition = previousState.cursorPosition;
            
            if (!this.currentTemplate) {
                this.visualExpression.textContent = previousState.visualContent;
                this.calculateDirectResult();
            }
            
            this.updateDisplay();
            this.updateParameterGuide();
            this.updateNavigationState();
        }
    }

    redoLastAction() {
        if (this.redoStack.length > 0) {
            // Save current state to undo stack
            this.undoStack.push({
                currentTemplate: this.currentTemplate,
                parameters: [...this.parameters],
                activeParamIndex: this.activeParamIndex,
                cursorPosition: this.cursorPosition,
                visualContent: this.visualExpression.textContent
            });
            
            // Restore next state
            const nextState = this.redoStack.pop();
            this.currentTemplate = nextState.currentTemplate;
            this.parameters = [...nextState.parameters];
            this.activeParamIndex = nextState.activeParamIndex;
            this.cursorPosition = nextState.cursorPosition;
            
            if (!this.currentTemplate) {
                this.visualExpression.textContent = nextState.visualContent;
                this.calculateDirectResult();
            }
            
            this.updateDisplay();
            this.updateParameterGuide();
            this.updateNavigationState();
        }
    }

    // History functions
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleString('vi-VN')
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        this.saveHistory();
    }

    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('enhancedTemplateCalcHistory')) || [];
        } catch {
            return [];
        }
    }

    saveHistory() {
        localStorage.setItem('enhancedTemplateCalcHistory', JSON.stringify(this.history));
    }

    updateHistoryDisplay() {
        this.historyContent.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyContent.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Chưa có lịch sử tính toán</p>';
            return;
        }
        
        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.onclick = () => this.useHistoryItem(item);
            
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${this.formatNumber(item.result)}</div>
                <div style="font-size: 12px; color: #999; margin-top: 8px;">${item.timestamp}</div>
            `;
            
            this.historyContent.appendChild(historyItem);
        });
    }

    useHistoryItem(item) {
        this.clearAll();
        this.visualExpression.textContent = this.formatNumber(item.result);
        this.resultDisplay.textContent = '';
        this.toggleHistory();
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('show');
        if (this.historyPanel.classList.contains('show')) {
            this.updateHistoryDisplay();
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    copyResult() {
        const result = this.resultDisplay.textContent;
        if (result && result !== 'Lỗi' && result !== 'Nhập đủ tham số...') {
            navigator.clipboard.writeText(result).then(() => {
                const originalText = this.resultDisplay.textContent;
                this.resultDisplay.textContent = 'Đã sao chép!';
                setTimeout(() => {
                    this.resultDisplay.textContent = originalText;
                }, 1500);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = result;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = this.resultDisplay.textContent;
                this.resultDisplay.textContent = 'Đã sao chép!';
                setTimeout(() => {
                    this.resultDisplay.textContent = originalText;
                }, 1500);
            });
        }
    }

    // Help functions
    showHelp() {
        this.helpPanel.classList.toggle('show');
    }

    // Enhanced keyboard handling with full template support
    handleKeyboard(event) {
        const key = event.key;
        
        // Prevent default behavior for handled keys
        const handledKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                            '+', '-', '*', '/', '(', ')', '.', 'Enter', '=', 
                            'Escape', 'Backspace', 'Tab', 'ArrowUp', 'ArrowDown', 
                            'ArrowLeft', 'ArrowRight'];
        
        if (handledKeys.includes(key)) {
            event.preventDefault();
        }
        
        // Handle number input
        if ('0123456789'.includes(key)) {
            this.insertNumber(key);
        }
        // Handle operators
        else if (key === '+') {
            this.insertBasic('+');
        } else if (key === '-') {
            this.insertBasic('-');
        } else if (key === '*') {
            this.insertBasic('*');
        } else if (key === '/') {
            this.insertBasic('/');
        } else if (key === '(' || key === ')') {
            this.insertBasic(key);
        } else if (key === '.') {
            this.insertNumber('.');
        }
        // Handle special keys
        else if (key === 'Enter' || key === '=') {
            this.calculateResult();
        } else if (key === 'Escape') {
            this.clearAll();
        } else if (key === 'Backspace') {
            this.backspace();
        } 
        // Handle navigation
        else if (key === 'Tab') {
            if (event.shiftKey) {
                this.moveToParam('prev');
            } else {
                this.moveToParam('next');
            }
        } else if (key === 'ArrowUp') {
            this.moveToParam('prev');
        } else if (key === 'ArrowDown') {
            this.moveToParam('next');
        } else if (key === 'ArrowLeft') {
            this.moveCursor('left');
        } else if (key === 'ArrowRight') {
            this.moveCursor('right');
        }
        // Handle special functions with Ctrl/Alt combinations
        else if (event.ctrlKey && key === 'z') {
            this.undoLastAction();
        } else if (event.ctrlKey && key === 'y') {
            this.redoLastAction();
        } else if (event.ctrlKey && key === 'c') {
            this.copyResult();
        }
    }
}

// Global instance
let calculator;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    calculator = new EnhancedTemplateCalculator();
    
    // Load saved memory
    calculator.memory = calculator.loadMemory();
    
    // Setup additional event listeners
    document.addEventListener('click', (e) => {
        // Close panels when clicking outside
        if (!calculator.helpPanel.contains(e.target) && 
            !e.target.classList.contains('help-btn')) {
            calculator.helpPanel.classList.remove('show');
        }
        
        if (!calculator.historyPanel.contains(e.target) && 
            !e.target.classList.contains('history-btn')) {
            calculator.historyPanel.classList.remove('show');
        }
    });
});

// Global functions for HTML onclick handlers
function insertNumber(num) {
    calculator.insertNumber(num);
}

function insertBasic(text) {
    calculator.insertBasic(text);
}

function insertConstant(constant) {
    calculator.insertConstant(constant);
}

function insertTemplate(templateType, funcName) {
    calculator.insertTemplate(templateType, funcName);
}

function calculateResult() {
    calculator.calculateResult();
}

function completeTemplate() {
    calculator.completeTemplate();
}

function clearAll() {
    calculator.clearAll();
}

function clearEntry() {
    calculator.clearEntry();
}

function backspace() {
    calculator.backspace();
}

function toggleSign() {
    calculator.toggleSign();
}

function percentage() {
    calculator.percentage();
}

function memoryAction(action) {
    calculator.memoryAction(action);
}

function moveCursor(direction) {
    calculator.moveCursor(direction);
}

function moveToParam(direction) {
    calculator.moveToParam(direction);
}

function clearCurrentParam() {
    calculator.clearCurrentParam();
}

function copyResult() {
    calculator.copyResult();
}

function toggleHistory() {
    calculator.toggleHistory();
}

function clearHistory() {
    calculator.clearHistory();
}

function showHelp() {
    calculator.showHelp();
}

function undoLastAction() {
    calculator.undoLastAction();
}

function redoLastAction() {
    calculator.redoLastAction();
}
