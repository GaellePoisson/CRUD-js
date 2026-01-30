let expenses = [];


const STORAGE_PREFIX = 'gestionDepenses_';
const STORAGE_KEY = STORAGE_PREFIX + 'expenses';

// RÉCUPÉRATION DES DONNÉES

/** Récupère les données des dépenses depuis le localStorage*/

function chargerDepenses() {
    if (typeof(Storage) !== "undefined") {
        try {
            const storedExpenses = localStorage.getItem(STORAGE_KEY);
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

/** Sauvegarde les dépenses dans le localStorage */

function sauvegarderDepenses() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
    }
}

/** Ajoute une nouvelle dépense */

function ajouterDepense(description, montant, categorie) {
    const depense = {
        id: Date.now(), 
        description: description,
        amount: parseFloat(montant),
        category: categorie,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    expenses.push(depense);
    sauvegarderDepenses();
    return depense;
}

//  CRÉATION VUE TABULAIRE + MAJ BUDGET

/** Calcule le budget total de toutes les dépenses*/

function calculerTotalBudget() {
    // Applique une fonction sur un accumulateur et chaque élément du tableau
    return expenses.reduce(function(total, depense) {
        return total + depense.amount;
    }, 0); // 0 est la valeur initiale de l'accumulateur
}

/** Met à jour l'affichage du budget total */
function mettreAJourAffichageBudget() {
    const total = calculerTotalBudget();
    const budgetElement = document.getElementById('totalBudget');
    budgetElement.textContent = `${total.toFixed(2)} €`;
}

/** Crée une ligne de tableau pour une dépense */
function creerLigneDepense(depense) {
    const ligne = document.createElement('tr');
    ligne.setAttribute('data-id', depense.id);
    
    ligne.innerHTML = `
        <td>${depense.description}</td>
        <td>${depense.category}</td>
        <td>${depense.amount.toFixed(2)} €</td>
        <td>${depense.date}</td>
        <td>
            <button class="delete-btn" onclick="supprimerDepense(${depense.id})">
                Supprimer
            </button>
        </td>
    `;
    
    return ligne;
}

/** Affiche toutes les dépenses dans le tableau */
function afficherTableauDepenses() {
    const tbody = document.getElementById('expenseTableBody');
    tbody.innerHTML = ''; // Vide le tableau
    
    if (expenses.length === 0) {
        // Affiche un message si aucune dépense
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="5">
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
    
    // Met à jour le budget total
    mettreAJourAffichageBudget();
}

// GESTION DE LA SUPPRESSION

/** Supprime une dépense par son ID */

function supprimerDepense(id) {
    // Confirmation avant suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        // Filtre les dépenses pour retirer celle avec l'ID correspondant
        expenses = expenses.filter(function(depense) {
            return depense.id !== id;
        });
        
        // Sauvegarde les modifications
        sauvegarderDepenses();
        
        // Rafraîchit l'affichage
        afficherTableauDepenses();
    }
}

//GESTION DU FORMULAIRE

/** Initialise le gestionnaire d'événements du formulaire */

function initialiserGestionnaireFormulaire() {
    const formulaire = document.getElementById('expenseForm');
    
    // Ajouter plusieurs gestionnaires pour un même événement
    formulaire.addEventListener('submit', function(event) {
        // preventDefault() empêche le comportement par défaut (rechargement de la page)
        event.preventDefault();
        
        // Récupère les valeurs du formulaire
        const description = document.getElementById('description').value;
        const montant = document.getElementById('amount').value;
        
        // Ajoute la dépense
        ajouterDepense(description, montant);
        
        // Rafraîchit l'affichage
        afficherTableauDepenses();
        
        // Réinitialise le formulaire
        formulaire.reset();
    });
}


/** Initialise l'application au chargement de la page */

function initialiser() {
    // Charge les dépenses depuis le localStorage
    chargerDepenses();
    
    // Affiche les dépenses dans le tableau
    afficherTableauDepenses();
    
    // Initialise le gestionnaire du formulaire
    initialiserGestionnaireFormulaire();
}

document.addEventListener('DOMContentLoaded', initialiser);