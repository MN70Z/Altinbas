document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("accountForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const buttonLabel = document.getElementById("formButton").textContent;
      if (buttonLabel === "Create Account") {
        createAccount();
      } else if (buttonLabel === "Save Changes") {
        saveChanges();
      }
    });
  loadAccounts();
});

function createAccount() {
  const accountData = {
    accountNumber: document.getElementById("accountNumber").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    balance: parseFloat(document.getElementById("balance").value),
  };

  fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((account) => {
      addAccountToList(account);
      resetForm();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to create account: " + error.message);
    });
}

function loadAccounts() {
  fetch("/api/accounts")
    .then((response) => response.json())
    .then((accounts) => {
      accounts.forEach((account) => {
        addAccountToList(account);
      });
    })
    .catch((error) => console.error("Error loading accounts:", error));
}

function addAccountToList(account) {
  const tbody = document
    .getElementById("accountsTable")
    .getElementsByTagName("tbody")[0];
  const row = tbody.insertRow();
  row.insertCell().textContent = account._id;
  row.insertCell().textContent = account.accountNumber;
  row.insertCell().textContent = account.name;
  row.insertCell().textContent = account.address;
  row.insertCell().textContent = account.phoneNumber;
  row.insertCell().textContent = account.balance;

  const actionsCell = row.insertCell();
  actionsCell.innerHTML =
    '<button onclick="deleteAccount(this)">Delete</button><button onclick="editAccount(this)">Edit</button>';
}

function editAccount(button) {
  const row = button.parentNode.parentNode;
  document.getElementById("accountId").value = row.cells[0].textContent; 
  document.getElementById("accountNumber").value = row.cells[1].textContent;
  document.getElementById("name").value = row.cells[2].textContent;
  document.getElementById("address").value = row.cells[3].textContent;
  document.getElementById("phoneNumber").value = row.cells[4].textContent;
  document.getElementById("balance").value = row.cells[5].textContent;

  document.getElementById("formButton").textContent = "Save Changes";
  document.getElementById("accountId").disabled = false;
}

function saveChanges() {
  const accountId = document.getElementById("accountId").value;
  const accountData = {
    accountNumber: document.getElementById("accountNumber").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    balance: parseFloat(document.getElementById("balance").value),
  };

  fetch(`/api/accounts/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  })
    .then((response) => response.json())
    .then((updatedAccount) => {
      console.log("Updated successfully");
      resetForm();
      location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function deleteAccount(button) {
  const row = button.parentNode.parentNode;
  const accountNumber = row.cells[0].textContent;

  fetch(`/api/accounts/${accountNumber}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Deleted successfully");
      row.remove();
    })
    .catch((error) => console.error("Error:", error));
}

function resetForm() {
  document.getElementById("accountForm").reset();
  document.getElementById("formButton").textContent = "Create Account";
}
