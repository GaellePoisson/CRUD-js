let expenses = [];

function chargerDepenses() {
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

function sauvegarderDepenses() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error(error);
    }
}

function ajouterDepense(description, montant) {
    const depense = {
        id: Date.now(),
        description: description,
        amount: parseFloat(montant),
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    expenses.push(depense);
    sauvegarderDepenses();
    return depense;
}

function calculerTotalBudget() {
    return expenses.reduce(function(total, depense) {
        return total + depense.amount;
    }, 0);
}

function mettreAJourAffichageBudget() {
    const total = calculerTotalBudget();
    const budgetElement = document.getElementById('totalBudget');
    budgetElement.textContent = `${total.toFixed(2)} €`;
}

function creerLigneDepense(depense) {
    const ligne = document.createElement('tr');
    ligne.setAttribute('data-id', depense.id);
    
    ligne.innerHTML = `
        <td>${depense.description}</td>
        <td>${depense.amount.toFixed(2)} €</td>
        <td>${depense.date}</td>
        <td>
            <button class="btn-delete" onclick="supprimerDepense(${depense.id})">
                Supprimer
            </button>
        </td>
    `;
    
    return ligne;
}

function afficherTableauDepenses() {
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
        expenses.forEach(function(depense) {
            const ligne = creerLigneDepense(depense);
            tbody.appendChild(ligne);
        });
    }
    
    mettreAJourAffichageBudget();
}

function supprimerDepense(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        expenses = expenses.filter(function(depense) {
            return depense.id !== id;
        });
        
        sauvegarderDepenses();
        afficherTableauDepenses();
    }
}

function initialiserGestionnaireFormulaire() {
    const formulaire = document.getElementById('expenseForm');
    
    formulaire.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const description = document.getElementById('description').value;
        const montant = document.getElementById('amount').value;
        
        ajouterDepense(description, montant);
        afficherTableauDepenses();
        formulaire.reset();
    });
}

function initialiser() {
    chargerDepenses();
    afficherTableauDepenses();
    initialiserGestionnaireFormulaire();
}

document.addEventListener('DOMContentLoaded', initialiser);
