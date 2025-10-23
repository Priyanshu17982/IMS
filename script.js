document.addEventListener("DOMContentLoaded", fetchItems);

// Fetch and display all items
function fetchItems() {
    fetch('/items')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#inventoryTable tbody");
            tbody.innerHTML = "";
            data.forEach(item => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td><input type="text" value="${item.item_name}" id="name-${item.id}" class="form-control"></td>
                    <td><input type="number" value="${item.quantity}" id="qty-${item.id}" class="form-control"></td>
                    <td><input type="number" value="${item.price}" id="price-${item.id}" class="form-control"></td>
                    <td>
                        <button class="btn btn-success btn-sm me-1" onclick="updateItem(${item.id})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

// Add a new item
function addItem() {
    const item_name = document.getElementById("item_name").value.trim();
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    if (!item_name || !quantity || !price) {
        alert("Please fill all fields!");
        return;
    }

    fetch('/add_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name, quantity, price })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("item_name").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        fetchItems();
    });
}

// Update an item
function updateItem(id) {
    const item_name = document.getElementById(`name-${id}`).value;
    const quantity = document.getElementById(`qty-${id}`).value;
    const price = document.getElementById(`price-${id}`).value;

    fetch(`/update_item/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name, quantity, price })
    })
    .then(() => fetchItems());
}

// Delete an item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`/delete_item/${id}`, { method: 'DELETE' })
        .then(() => fetchItems());
}
