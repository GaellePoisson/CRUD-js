
let expenses = [];

// FONCTION 1: RÉCUPÉRATION DES DONNÉES


/**
 * Récupère les données des dépenses depuis le localStorage
 * Basé sur les recommandations W3Schools et MDN pour localStorage
 */
function loadExpenses() {
    // Vérification du support de localStorage (W3Schools recommandation)
    if (typeof(Storage) !== "undefined") {
        try {
            const storedExpenses = localStorage.getItem('expenses');
            if (storedExpenses) {
                expenses = JSON.parse(storedExpenses);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            expenses = [];
        }
    } else {
        console.warn('localStorage non supporté par ce navigateur');
        expenses = [];
    }
    return expenses;
}

/**
 * Sauvegarde les dépenses dans le localStorage
 * Utilise JSON.stringify selon les recommandations W3Schools/MDN
 */
function saveExpenses() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
    }
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
 * Utilise Array.reduce() selon la documentation MDN
 */
function calculateTotalBudget() {
    // reduce() applique une fonction sur un accumulateur et chaque élément du tableau
    // pour le réduire à une seule valeur (MDN)
    return expenses.reduce(function(total, expense) {
        return total + expense.amount;
    }, 0); // 0 est la valeur initiale de l'accumulateur
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
                🗑️ Supprimer
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Affiche toutes les dépenses dans le tableau
 * Utilise forEach() pour itérer sur le tableau (MDN)
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
                        <p>📋</p>
                        <p>Aucune dépense enregistrée</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        // forEach() exécute une fonction pour chaque élément du tableau (MDN)
        expenses.forEach(function(expense) {
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
 * Utilise Array.filter() selon la documentation MDN
 */
function deleteExpense(id) {
    // Confirmation avant suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        // Filtre les dépenses pour retirer celle avec l'ID correspondant
        // MDN: filter() crée un nouveau tableau avec les éléments qui passent le test
        expenses = expenses.filter(function(expense) {
            return expense.id !== id;
        });
        
        // Sauvegarde les modifications
        saveExpenses();
        
        // Rafraîchit l'affichage
        renderExpenseTable();
    }
}

// GESTION DU FORMULAIRE


/**
 * Initialise le gestionnaire d'événements du formulaire
 * Utilise addEventListener() - méthode recommandée par MDN
 */
function initFormHandler() {
    const form = document.getElementById('expenseForm');
    
    // addEventListener() est la méthode recommandée par MDN pour enregistrer des événements
    // Elle permet d'ajouter plusieurs gestionnaires pour un même événement
    form.addEventListener('submit', function(event) {
        // preventDefault() empêche le comportement par défaut (rechargement de la page)
        event.preventDefault();
        
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

// DOMContentLoaded : événement déclenché quand le DOM est complètement chargé (MDN)
// C'est le moment idéal pour attacher les gestionnaires d'événements
document.addEventListener('DOMContentLoaded', init);