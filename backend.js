
        // ==================== DATA MANAGEMENT SYSTEM ====================
        
        // Centralized Data Store
        const appData = {
            income: {
                monthly: 30000,
                sources: [
                    { id: 1, name: 'Full-time Salary', amount: 25000, type: 'active', description: 'Fulltime monthly' },
                    { id: 2, name: 'Interest Income', amount: 3000, type: 'active', description: 'Most recent from niap FD Apr 15.1.5 Lakhs' },
                    { id: 3, name: 'Freelance or Side Income', amount: 2000, type: 'passive', description: 'Graphic designing gig payment April' },
                    { id: 4, name: 'Shopping', amount: 1600, type: 'passive', description: 'Interment April' }
                ],
                history: [
                    { month: 'Sep', amount: 26000 },
                    { month: 'Oct', amount: 28000 },
                    { month: 'Nov', amount: 27000 },
                    { month: 'Dec', amount: 29000 },
                    { month: 'Jan', amount: 28000 },
                    { month: 'Apr', amount: 30000 }
                ]
            },
            expenses: {
                monthly: 19000,
                categories: [
                    { name: 'Dining Out', amount: 7000, color: '#f97316' },
                    { name: 'Groceries', amount: 4100, color: '#22c55e' },
                    { name: 'Entertainment', amount: 3000, color: '#8b5cf6' },
                    { name: 'Transportation', amount: 2200, color: '#3b82f6' },
                    { name: 'Bills & Utilities', amount: 1900, color: '#eab308' },
                    { name: 'Shopping', amount: 1600, color: '#14b8a6' }
                ],
                transactions: []
            },
            investments: {
                total: 275000,
                breakdown: [
                    { name: 'SIP Investments', amount: 140000 },
                    { name: 'Stocks', amount: 75000 },
                    { name: 'FDs', amount: 50000 },
                    { name: 'Mutual Funds', amount: 10000 }
                ]
            },
            goals: [
                { id: 1, name: 'Monthly SIP', target: 5000, current: 5000, completed: true },
                { id: 2, name: 'Trip Fund', target: 22000, current: 10000, completed: false },
                { id: 3, name: 'Emergency Fund', target: 10000, current: 12000, completed: true }
            ],
            emi: {
                monthly: 5000,
                emiDue: 3500,
                billsDue: 1500
            }
        };

        // Calculate derived values
        function calculateDerivedValues() {
            appData.income.monthly = appData.income.sources.reduce((sum, source) => sum + source.amount, 0);
            appData.expenses.monthly = appData.expenses.categories.reduce((sum, cat) => sum + cat.amount, 0);
        }

        // Update all pages when data changes
        function updateAllPages() {
            calculateDerivedValues();
            updateDashboard();
            updateIncomePage();
            updateExpensesPage();
            updateInsightsPage();
            updateProfileStats();
            updateCharts();
        }

        // Add Income Source
        function addIncomeSource(name, amount, type, description) {
            const newId = Math.max(...appData.income.sources.map(s => s.id), 0) + 1;
            appData.income.sources.push({
                id: newId,
                name: name,
                amount: parseFloat(amount),
                type: type,
                description: description || ''
            });
            updateAllPages();
        }

        // Add Expense
        function addExpense(categoryName, amount) {
            const category = appData.expenses.categories.find(cat => cat.name === categoryName);
            if (category) {
                category.amount += parseFloat(amount);
            } else {
                // Default colors for new categories
                const colors = ['#f97316', '#22c55e', '#8b5cf6', '#3b82f6', '#eab308', '#14b8a6', '#ef4444', '#8b5cf6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                appData.expenses.categories.push({
                    name: categoryName,
                    amount: parseFloat(amount),
                    color: randomColor
                });
            }
            updateAllPages();
        }

        // Update Dashboard
        function updateDashboard() {
            const savings = appData.income.monthly - appData.expenses.monthly;
            const savingsPercent = ((savings / appData.income.monthly) * 100).toFixed(0);

            // Update summary boxes
            const incomeEl = document.querySelector('.dash-summary-strip .summary-box:first-child .amount');
            const expensesEl = document.querySelector('.dash-summary-strip .summary-box:nth-child(2) .amount');
            const savingsEl = document.querySelector('.dash-summary-strip .savings-box h4');
            const savingsPercentEl = document.querySelector('.dash-summary-strip .savings-box .progress-labels span:last-child');
            const progressBar = document.querySelector('.dash-summary-strip .progress-bar-fill');

            if (incomeEl) incomeEl.textContent = `₹ ${appData.income.monthly.toLocaleString('en-IN')}`;
            if (expensesEl) expensesEl.textContent = `₹ ${appData.expenses.monthly.toLocaleString('en-IN')}`;
            if (savingsEl) savingsEl.textContent = `₹ ${savings.toLocaleString('en-IN')}`;
            if (savingsPercentEl) savingsPercentEl.textContent = `${savingsPercent}% saved`;
            if (progressBar) progressBar.style.width = `${savingsPercent}%`;
        }

        // Update Income Page
        function updateIncomePage() {
            const monthlyIncomeEl = document.querySelector('.income-monthly-card h3');
            if (monthlyIncomeEl) monthlyIncomeEl.textContent = `₹${appData.income.monthly.toLocaleString('en-IN')}`;

            // Update income sources list
            const sourcesContainer = document.querySelector('.income-sources-card');
            if (sourcesContainer) {
                const activeContainer = sourcesContainer.querySelector('.income-category:first-child');
                const passiveContainer = sourcesContainer.querySelector('.income-category:last-child');
                
                if (activeContainer && passiveContainer) {
                    // Clear existing items (keep labels)
                    const activeItems = activeContainer.querySelectorAll('.income-source-item');
                    const passiveItems = passiveContainer.querySelectorAll('.income-source-item');
                    activeItems.forEach(item => item.remove());
                    passiveItems.forEach(item => item.remove());

                    // Add updated sources
                    appData.income.sources.forEach(source => {
                        const item = createIncomeSourceItem(source);
                        if (source.type === 'active') {
                            activeContainer.appendChild(item);
                        } else {
                            passiveContainer.appendChild(item);
                        }
                    });
                }
            }
        }

        // Create Income Source Item HTML
        function createIncomeSourceItem(source) {
            const div = document.createElement('div');
            div.className = 'income-source-item';
            const iconClass = source.type === 'active' ? 'bg-blue' : 'bg-purple';
            const icon = source.name.includes('Interest') ? 'ri-circle-fill' : 
                        source.name.includes('Freelance') ? 'ri-user-line' : 
                        source.name.includes('Shopping') ? 'ri-shopping-bag-line' : 'ri-building-line';
            
            div.innerHTML = `
                <div class="source-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="source-details">
                    <h4>${source.name}</h4>
                    <p>${source.description}</p>
                </div>
                <div class="source-amount">₹${source.amount.toLocaleString('en-IN')}</div>
            `;
            return div;
        }

        // Update Expenses Page
        function updateExpensesPage() {
            const totalExpensesEl = document.querySelector('.spending-summary-card .chart-center-label');
            if (totalExpensesEl) {
                totalExpensesEl.innerHTML = `₹${appData.expenses.monthly.toLocaleString('en-IN')}<br><span>Total Expenses</span>`;
            }

            // Update category list
            const categoriesList = document.querySelector('.spending-categories-list');
            if (categoriesList) {
                const categoryItems = categoriesList.querySelectorAll('.category-item');
                categoryItems.forEach(item => item.remove());
                
                // Remove savings message temporarily
                const savingsMsg = categoriesList.querySelector('.savings-message');
                
                appData.expenses.categories.forEach(category => {
                    const percentage = ((category.amount / appData.expenses.monthly) * 100).toFixed(0);
                    const item = document.createElement('div');
                    item.className = 'category-item';
                    item.innerHTML = `
                        <div class="category-info">
                            <div class="category-header">
                                <span class="dot" style="background: ${category.color};"></span>
                                <span class="category-name">${category.name}</span>
                            </div>
                            <div class="category-amounts">
                                <span class="amount">₹${category.amount.toLocaleString('en-IN')}</span>
                                <span class="percentage">${percentage}%</span>
                            </div>
                        </div>
                        <div class="category-progress-bar">
                            <div class="category-progress-fill" style="width: ${percentage}%; background: ${category.color};"></div>
                        </div>
                    `;
                    categoriesList.insertBefore(item, savingsMsg.nextSibling);
                });
            }

            // Update savings message
            const savingsPercent = ((appData.income.monthly - appData.expenses.monthly) / appData.income.monthly * 100).toFixed(0);
            const savingsMsgEl = document.querySelector('.savings-message span:last-child');
            if (savingsMsgEl) {
                savingsMsgEl.textContent = `You saved ${savingsPercent}% of your income this month!`;
            }
        }

        // Update Insights Page
        function updateInsightsPage() {
            const savingsPercent = ((appData.income.monthly - appData.expenses.monthly) / appData.income.monthly * 100).toFixed(0);
            const highlightEl = document.querySelector('.insights-view .highlight');
            if (highlightEl) highlightEl.textContent = `${savingsPercent}% of your income`;

            // Update insight rows
            const insightsList = document.querySelector('.insights-list');
            if (insightsList) {
                insightsList.innerHTML = '';
                appData.expenses.categories.forEach(category => {
                    const percentage = ((category.amount / appData.expenses.monthly) * 100).toFixed(0);
                    const row = document.createElement('div');
                    row.className = 'insight-row';
                    row.innerHTML = `
                        <div class="insight-label">
                            <span class="dot" style="background: ${category.color};"></span>
                            ${category.name}
                        </div>
                        <div class="insight-values">
                            <span>₹ ${category.amount.toLocaleString('en-IN')}</span>
                            <span>${percentage}%</span>
                        </div>
                    `;
                    insightsList.appendChild(row);
                });
            }
        }

        // Update Profile Stats
        function updateProfileStats() {
            const incomeStat = document.querySelector('.profile-stats-card .stat-item:first-child .stat-value');
            const expensesStat = document.querySelector('.profile-stats-card .stat-item:nth-child(2) .stat-value');
            if (incomeStat) incomeStat.textContent = `₹${appData.income.monthly.toLocaleString('en-IN')}`;
            if (expensesStat) expensesStat.textContent = `₹${appData.expenses.monthly.toLocaleString('en-IN')}`;
        }

        // Update Charts
        function updateCharts() {
            // Destroy existing charts to force re-render
            if (spendingChartInstance) {
                spendingChartInstance.destroy();
                spendingChartInstance = null;
            }
            if (spendingChartMainInstance) {
                spendingChartMainInstance.destroy();
                spendingChartMainInstance = null;
            }
            if (incomeChartInstance) {
                incomeChartInstance.destroy();
                incomeChartInstance = null;
            }
        }

        // Simple View Switcher
        function switchTab(viewId, btnElement, quickQuery = null) {
            // Update Navigation UI
            if (btnElement) {
                document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
                btnElement.classList.add('active');
            }

            // Hide all views
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('ask-view').style.display = 'none';
            const insightsView = document.getElementById('insights-view');
            if (insightsView) insightsView.style.display = 'none';
            const expensesView = document.getElementById('expenses-view');
            const incomeView = document.getElementById('income-view');
            const investmentsView = document.getElementById('investments-view');
            const emiView = document.getElementById('emi-view');
            const goalsView = document.getElementById('goals-view');
            const profileView = document.getElementById('profile-view');
            if (expensesView) expensesView.style.display = 'none';
            if (incomeView) incomeView.style.display = 'none';
            if (investmentsView) investmentsView.style.display = 'none';
            if (emiView) emiView.style.display = 'none';
            if (goalsView) goalsView.style.display = 'none';
            if (profileView) profileView.style.display = 'none';

            // Show selected view
            if (viewId === 'dashboard') {
                document.getElementById('dashboard-view').style.display = 'grid';
                document.getElementById('page-title').innerHTML = "Hello <span>Arjun</span>, here's your current month overview.";
            } else if (viewId === 'ask') {
                document.getElementById('ask-view').style.display = 'flex';
                document.getElementById('page-title').innerText = "Ask FinGuide";
                
                // If clicked from a quick action button
                if (quickQuery) {
                    document.getElementById('user-input').value = quickQuery;
                    sendMessage();
                }
            } else if (viewId === 'insights') {
                if (insightsView) {
                    insightsView.style.display = 'grid';
                    updateInsightsPage();
                    renderSpendingChart();
                }
                document.getElementById('page-title').innerText = "Spending Insights";
            } else if (viewId === 'expenses') {
                if (expensesView) {
                    expensesView.style.display = 'block';
                    updateExpensesPage();
                    renderSpendingChartMain();
                }
                document.getElementById('page-title').innerText = "Spending";
            } else if (viewId === 'income') {
                if (incomeView) {
                    incomeView.style.display = 'block';
                    updateIncomePage();
                    renderIncomeChart();
                }
                document.getElementById('page-title').innerHTML = "Income";
            } else if (viewId === 'investments') {
                if (investmentsView) {
                    investmentsView.style.display = 'block';
                    renderInvestmentsChart();
                }
                document.getElementById('page-title').innerText = "Investments";
            } else if (viewId === 'emi') {
                if (emiView) emiView.style.display = 'block';
                document.getElementById('page-title').innerText = "EMI / Bills";
            } else if (viewId === 'goals') {
                if (goalsView) goalsView.style.display = 'block';
                document.getElementById('page-title').innerText = "Goals";
            } else if (viewId === 'profile') {
                if (profileView) {
                    profileView.style.display = 'block';
                    updateProfileStats();
                }
                document.getElementById('page-title').innerText = "Profile";
            }
        }

        // Modal Functions
        function openAddIncomeModal() {
            document.getElementById('addIncomeModal').style.display = 'flex';
        }

        function closeAddIncomeModal() {
            document.getElementById('addIncomeModal').style.display = 'none';
            document.getElementById('addIncomeForm').reset();
        }

        function openAddExpenseModal() {
            document.getElementById('addExpenseModal').style.display = 'flex';
        }

        function closeAddExpenseModal() {
            document.getElementById('addExpenseModal').style.display = 'none';
            document.getElementById('addExpenseForm').reset();
        }

        // Handle Income Form Submission
        function handleAddIncome(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('incomeName');
            const amount = formData.get('incomeAmount');
            const type = formData.get('incomeType');
            const description = formData.get('incomeDescription') || '';

            if (name && amount && type) {
                addIncomeSource(name, amount, type, description);
                closeAddIncomeModal();
                // Show success message
                showNotification('Income source added successfully!', 'success');
            }
        }

        // Handle Expense Form Submission
        function handleAddExpense(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const category = formData.get('expenseCategory');
            const amount = formData.get('expenseAmount');
            const customCategory = formData.get('customCategory');

            const categoryName = category === 'custom' ? customCategory : category;

            if (categoryName && amount) {
                addExpense(categoryName, amount);
                closeAddExpenseModal();
                // Show success message
                showNotification('Expense added successfully!', 'success');
            }
        }

        // Notification System
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            updateAllPages();
            
            // Attach form handlers
            const incomeForm = document.getElementById('addIncomeForm');
            const expenseForm = document.getElementById('addExpenseForm');
            if (incomeForm) incomeForm.addEventListener('submit', handleAddIncome);
            if (expenseForm) expenseForm.addEventListener('submit', handleAddExpense);
        });

        // Insights Chart
        let spendingChartInstance = null;

        function renderSpendingChart() {
            const ctx = document.getElementById('spendingChart');
            if (!ctx || typeof Chart === 'undefined') return;

            if (spendingChartInstance) {
                spendingChartInstance.destroy();
            }

            const labels = appData.expenses.categories.map(cat => cat.name);
            const data = appData.expenses.categories.map(cat => cat.amount);
            const colors = appData.expenses.categories.map(cat => cat.color);

            spendingChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10
                        }
                    }
                }
            });
        }

        // Income Chart
        let incomeChartInstance = null;

        function renderIncomeChart() {
            const ctx = document.getElementById('incomeChart');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (incomeChartInstance) {
                incomeChartInstance.destroy();
            }

            incomeChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Apr'],
                    datasets: [{
                        label: 'Income',
                        data: [26000, 28000, 27000, 29000, 28000, 30000],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.parsed.y.toLocaleString('en-IN');
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 20000,
                            max: 35000,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + (value / 1000) + 'k';
                                },
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            },
                            grid: {
                                color: '#f1f5f9',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Spending Chart (Main)
        let spendingChartMainInstance = null;

        function renderSpendingChartMain() {
            const ctx = document.getElementById('spendingChartMain');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (spendingChartMainInstance) {
                spendingChartMainInstance.destroy();
            }

            const labels = appData.expenses.categories.map(cat => cat.name);
            const data = appData.expenses.categories.map(cat => cat.amount);
            const colors = appData.expenses.categories.map(cat => cat.color);

            spendingChartMainInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toLocaleString('en-IN');
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(0);
                                    return label + ': ' + value + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Investments Chart
        let investmentsChartInstance = null;

        function renderInvestmentsChart() {
            const ctx = document.getElementById('investmentsChart');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (investmentsChartInstance) {
                investmentsChartInstance.destroy();
            }

            investmentsChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['SIP Investments', 'Stocks', 'FDs', 'Mutual Funds'],
                    datasets: [{
                        data: [140000, 75000, 50000, 10000],
                        backgroundColor: [
                            '#3b82f6',
                            '#8b5cf6',
                            '#f59e0b',
                            '#22c55e'
                        ],
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toLocaleString('en-IN');
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(0);
                                    return label + ': ' + value + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Income Subnav Handler
        function switchIncomeSubnav(activeBtn) {
            document.querySelectorAll('.subnav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }

        // Initialize subnav buttons
        document.addEventListener('DOMContentLoaded', function() {
            const subnavButtons = document.querySelectorAll('.subnav-btn');
            subnavButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Check which view it belongs to
                    const isIncomeView = this.closest('.income-view');
                    const isSpendingView = this.closest('.spending-view');
                    const isInvestmentsView = this.closest('.investments-view');
                    const isGoalsView = this.closest('.goals-view');
                    const isEmiView = this.closest('.emi-view');
                    
                    if (isIncomeView || isSpendingView || isInvestmentsView || isGoalsView || isEmiView) {
                        switchIncomeSubnav(this); // Same function works for all
                    }
                });
            });
        });

        // Chat Logic
        function handleEnter(e) {
            if (e.key === 'Enter') sendMessage();
        }

        function sendMessage() {
            const input = document.getElementById('user-input');
            const message = input.value.trim();
            const chatHistory = document.getElementById('chat-history');

            if (message === "") return;

            // 1. Add User Message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message msg-user';
            userMsgDiv.innerText = message;
            chatHistory.appendChild(userMsgDiv);

            // Clear Input
            input.value = "";

            // 2. Simulate AI Typing/Response (based on Image 1 content)
            setTimeout(() => {
                const aiMsgDiv = document.createElement('div');
                aiMsgDiv.className = 'message msg-ai';
                
                // Static response logic to mimic the screenshots
                if (message.includes("SIP") || message.includes("afford")) {
                    aiMsgDiv.innerHTML = `
                        <strong>Gemini</strong><br>
                        Sure! Based on your ₹30,000 income and ₹19,000 expenses, yes, you can afford a ₹5,000 SIP.
                        <div class="ai-insight">
                            <strong>Here's why:</strong>
                            <ul>
                                <li>After SIP, you'll have ₹6,000 leftover. 👍 Good cushion!</li>
                                <li>SIP is a smart way to grow money long-term.</li>
                            </ul>
                        </div>
                        <div class="status-badge" style="margin-top:10px;">✅ Yes, a ₹5,000 SIP is a Good Move!</div>
                    `;
                } else {
                    aiMsgDiv.innerText = "I'm analyzing your spending patterns... (This is a demo response based on your design).";
                }
                
                chatHistory.appendChild(aiMsgDiv);
                chatHistory.scrollTop = chatHistory.scrollHeight; // Auto scroll
            }, 800);
        }
    