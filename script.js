let expenses = [];

function loadExpenses() {
    if (typeof(Storage) !== "undefined") {
        try {
            const storedExpenses = localStorage.getItem('expenses');
            if (storedExpenses) {
                expenses = JSON.parse(storedExpenses);
            }
        } catch (error) {
            console.error(error);
            expenses = [];
        }
    } else {
        expenses = [];
    }
    return expenses;
}

function saveExpenses() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error(error);
    }
}

function addExpense(description, amount) {
    const expense = {
        id: Date.now(),
        description: description,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    expenses.push(expense);
    saveExpenses();
    return expense;
}

function calculateTotalBudget() {
    return expenses.reduce(function(total, expense) {
        return total + expense.amount;
    }, 0);
}

function updateBudgetDisplay() {
    const total = calculateTotalBudget();
    const budgetElement = document.getElementById('totalBudget');
    budgetElement.textContent = `${total.toFixed(2)} €`;
}

function createExpenseRow(expense) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', expense.id);
    
    row.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.amount.toFixed(2)} €</td>
        <td>${expense.date}</td>
        <td>
            <button class="btn-delete" onclick="deleteExpense(${expense.id})">
                Supprimer
            </button>
        </td>
    `;
    
    return row;
}

function renderExpenseTable() {
    const tbody = document.getElementById('expenseTableBody');
    tbody.innerHTML = ''; 
    
    if (expenses.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">
                    <div>
                        <p>Aucune dépense enregistrée</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        expenses.forEach(function(expense) {
            const row = createExpenseRow(expense);
            tbody.appendChild(row);
        });
    }
    
    updateBudgetDisplay();
}

function deleteExpense(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        expenses = expenses.filter(function(expense) {
            return expense.id !== id;
        });
        
        saveExpenses();
        renderExpenseTable();
    }
}

function initFormHandler() {
    const form = document.getElementById('expenseForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        
        addExpense(description, amount);
        renderExpenseTable();
        form.reset();
    });
}

function init() {
    loadExpenses();
    renderExpenseTable();
    initFormHandler();
}

document.addEventListener('DOMContentLoaded', init);