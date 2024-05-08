document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accountForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const buttonLabel = document.getElementById('formButton').textContent;
        if (buttonLabel === 'Create Account') {
            createAccount();
        } else if (buttonLabel === 'Save Changes') {
            saveChanges();
        }
    });
    loadAccounts();
});

function createAccount() {
    const accountData = {
        accountNumber: document.getElementById('accountNumber').value,
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        balance: parseFloat(document.getElementById('balance').value)
    };

    fetch('/api/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
    })
    .then(response => response.json())
    .then(account => {
        addAccountToList(account);
        resetForm();
    })
    .catch(error => console.error('Error:', error));
}

function loadAccounts() {
    fetch('/api/accounts')
    .then(response => response.json())
    .then(accounts => {
        accounts.forEach(account => {
            addAccountToList(account);
        });
    })
    .catch(error => console.error('Error loading accounts:', error));
}

function addAccountToList(account) {
    const tbody = document.getElementById('accountsTable').getElementsByTagName('tbody')[0];
    const row = tbody.insertRow();
    Object.values(account).forEach((value, index) => {
        const cell = row.insertCell(index);
        cell.textContent = value instanceof Object ? value.name : value; // Handle nested objects if any
    });
    const deleteCell = row.insertCell();
    deleteCell.innerHTML = '<button onclick="deleteAccount(this)">Delete</button><button onclick="editAccount(this)">Edit</button>';}

function editAccount(button) {
    const row = button.parentNode.parentNode;
    document.getElementById('accountNumber').value = row.cells[0].textContent;
    document.getElementById('name').value = row.cells[1].textContent;
    document.getElementById('address').value = row.cells[2].textContent;
    document.getElementById('phoneNumber').value = row.cells[3].textContent;
    document.getElementById('balance').value = row.cells[4].textContent;

    document.getElementById('formButton').textContent = 'Save Changes'; 
}

function saveChanges() {
    const accountData = {
        accountNumber: document.getElementById('accountNumber').value,
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        balance: parseFloat(document.getElementById('balance').value)
    };

    fetch(`/api/accounts/${accountData.accountNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
    })
    .then(response => response.json())
    .then(updatedAccount => {
        console.log('Updated successfully');
        resetForm();
        location.reload(); 
    })
    .catch(error => console.error('Error:', error));
}

function deleteAccount(button) {
    const row = button.parentNode.parentNode;
    const accountNumber = row.cells[0].textContent;

    fetch(`/api/accounts/${accountNumber}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log('Deleted successfully');
        row.remove(); 
    })
    .catch(error => console.error('Error:', error));
}

function resetForm() {
    document.getElementById('accountForm').reset();
    document.getElementById('formButton').textContent = 'Create Account';
}
