document.addEventListener("DOMContentLoaded", () => {
    const categories = ["personal", "home", "car", "other"];
    categories.forEach(category => {
        loadItems(category);
        document.getElementById(`${category}-form`).addEventListener("submit", (e) => {
            e.preventDefault();
            addItem(category);
        });
    });
    updateGrandTotal();
});

function addItem(category) {
    const itemInput = document.getElementById(`${category}-item`);
    const priceInput = document.getElementById(`${category}-price`);

    const itemName = itemInput.value.trim();
    const itemPrice = parseFloat(priceInput.value);

    if (itemName && !isNaN(itemPrice)) {
        const item = {
            name: itemName,
            price: itemPrice,
            checked: false
        };

        const items = getItems(category);
        items.push(item);
        saveItems(category, items);

        itemInput.value = "";
        priceInput.value = "";

        renderItems(category, items);
        updateTotal(category, items);
        updateGrandTotal();
    }
}

function renderItems(category, items) {
    const listElement = document.getElementById(`${category}-list`);
    listElement.innerHTML = "";

    items.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.toggle("completed", item.checked);

        listItem.innerHTML = `
            <input type="checkbox" ${item.checked ? "checked" : ""} onclick="toggleItem('${category}', ${index})">
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button onclick="deleteItem('${category}', ${index})">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

function updateTotal(category, items) {
    const total = items.reduce((sum, item) => item.checked ? sum : sum + item.price, 0);
    document.getElementById(`${category}-total`).textContent = total.toFixed(2);
}

function updateGrandTotal() {
    const categories = ["personal", "home", "car", "other"];
    let grandTotal = 0;

    categories.forEach(category => {
        const items = getItems(category);
        const categoryTotal = items.reduce((sum, item) => item.checked ? sum : sum + item.price, 0);
        grandTotal += categoryTotal;
    });

    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
}

function toggleItem(category, index) {
    const items = getItems(category);
    const item = items[index];

    // Toggle the checked status
    item.checked = !item.checked;

    // Save the updated items list
    saveItems(category, items);

    // Update the total for the specific category
    updateTotal(category, items);

    // Re-render the list to reflect the changes
    renderItems(category, items);

    // Update the grand total
    updateGrandTotal();
}

function deleteItem(category, index) {
    const items = getItems(category);
    items.splice(index, 1);
    saveItems(category, items);
    renderItems(category, items);
    updateTotal(category, items);
    updateGrandTotal();
}

function getItems(category) {
    return JSON.parse(localStorage.getItem(`${category}-items`)) || [];
}

function saveItems(category, items) {
    localStorage.setItem(`${category}-items`, JSON.stringify(items));
}

function loadItems(category) {
    const items = getItems(category);
    renderItems(category, items);
    updateTotal(category, items);
    updateGrandTotal();
}
