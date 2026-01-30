let expenses = [];

// FONCTION 1: RÉCUPÉRATION DES DONNÉES

/**
 * Récupère les données des dépenses depuis le localStorage
 */
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }
    return expenses;
}

/**
 * Sauvegarde les dépenses dans le localStorage
 */
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Ajoute une nouvelle dépense
 */
function addExpense(description, amount, category) {
    const expense = {
        id: Date.now(), // Identifiant unique basé sur le timestamp
        description: description,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    expenses.push(expense);
    saveExpenses();
    return expense;
}

// FONCTION 2: CRÉATION VUE TABULAIRE + MAJ BUDGET

/**
 * Calcule le budget total de toutes les dépenses
 */
function calculateTotalBudget() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Met à jour l'affichage du budget total
 */
function updateBudgetDisplay() {
    const total = calculateTotalBudget();
    const budgetElement = document.getElementById('totalBudget');
    budgetElement.textContent = `${total.toFixed(2)} €`;
}

/**
 * Crée une ligne de tableau pour une dépense
 */
function createExpenseRow(expense) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', expense.id);
    
    row.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.amount.toFixed(2)} €</td>
        <td>${expense.date}</td>
        <td>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                Supprimer
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Affiche toutes les dépenses dans le tableau
 */
function renderExpenseTable() {
    const tbody = document.getElementById('expenseTableBody');
    tbody.innerHTML = ''; // Vide le tableau
    
    if (expenses.length === 0) {
        // Affiche un message si aucune dépense
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="5">
                    <div>
                    
                    </div>
                </td>
            </tr>
        `;
    } else {
        // Affiche chaque dépense
        expenses.forEach(expense => {
            const row = createExpenseRow(expense);
            tbody.appendChild(row);
        });
    }
    
    // Met à jour le budget total
    updateBudgetDisplay();
}


// FONCTION 3: GESTION DE LA SUPPRESSION

/**
 * Supprime une dépense par son ID
 */
function deleteExpense(id) {
    // Confirmation avant suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        // Filtre les dépenses pour retirer celle avec l'ID correspondant
        expenses = expenses.filter(expense => expense.id !== id);
        
        // Sauvegarde les modifications
        saveExpenses();
        
        // Rafraîchit l'affichage
        renderExpenseTable();
    }
}

// GESTION DU FORMULAIRE

/**
 * Initialise le gestionnaire d'événements du formulaire
 */
function initFormHandler() {
    const form = document.getElementById('expenseForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche le rechargement de la page
        
        // Récupère les valeurs du formulaire
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        
        // Ajoute la dépense
        addExpense(description, amount, category);
        
        // Rafraîchit l'affichage
        renderExpenseTable();
        
        // Réinitialise le formulaire
        form.reset();
    });
}

// INITIALISATION DE L'APPLICATION

/**
 * Initialise l'application au chargement de la page
 */
function init() {
    // Charge les dépenses depuis le localStorage
    loadExpenses();
    
    // Affiche les dépenses dans le tableau
    renderExpenseTable();
    
    // Initialise le gestionnaire du formulaire
    initFormHandler();
}

// Lance l'initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', init);