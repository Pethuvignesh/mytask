const baseURL = 'http://172.20.235.64:80/items';
const itemsPerPage = 5; // Number of items per page
let currentPage = 1; // Current page

const itemsTable = document.getElementById('items-table');
const itemForm = document.getElementById('item-form');

// Fetch items from backend
async function fetchItems() {
    try {
        const response = await fetch(baseURL);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Display items in a table on the frontend
function displayItems(items) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    const tableBody = document.getElementById('items-table-body');
    tableBody.innerHTML = '';
    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>$${item.price}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteItem('${item._id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Add new item
itemForm.addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);

    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price })
        });
        const newItem = await response.json();
        fetchItems(); // Refresh items list
        itemForm.reset(); // Reset form fields
    } catch (error) {
        console.error('Error adding item:', error);
    }
});

// Delete item
async function deleteItem(id) {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    try {
        await fetch(`${baseURL}/${id}`, {
            method: 'DELETE'
        });
        fetchItems(); // Refresh items list
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Pagination
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchItems();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentPage++;
    fetchItems();
});

// Initial fetch items
fetchItems();
