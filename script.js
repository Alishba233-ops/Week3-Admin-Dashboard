const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const menuTable = document.getElementById("menuTable");
const menuForm = document.getElementById("menuForm");


// LOAD MENU
async function loadMenu() {

    const response = await fetch("/api/menu");
    const items = await response.json();

    menuTable.innerHTML = "";

    items.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>Rs. ${item.price}</td>
            <td>${item.status}</td>

            <td>
                <button class="edit-btn" data-id="${item.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${item.id}">
                    Delete
                </button>
            </td>
        `;

        menuTable.appendChild(row);
    });
}


// SEARCH + FILTER
function filterMenu() {

    const searchValue =
        searchInput.value.toLowerCase();

    const categoryValue =
        categoryFilter.value;

    const rows =
        menuTable.querySelectorAll("tr");

    rows.forEach(row => {

        const itemName =
            row.cells[1].textContent.toLowerCase();

        const category =
            row.cells[2].textContent;

        const matchesSearch =
            itemName.includes(searchValue);

        const matchesCategory =
            categoryValue === "all" ||
            category === categoryValue;

        row.style.display =
            matchesSearch && matchesCategory
                ? ""
                : "none";
    });
}

searchInput.addEventListener("input", filterMenu);
categoryFilter.addEventListener("change", filterMenu);


// ADD ITEM
menuForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("itemName").value.trim();

    const category =
        document.getElementById("itemCategory").value;

    const price =
        document.getElementById("itemPrice").value;

    if (!name || !category || !price) {
        alert("Please fill all fields.");
        return;
    }

    const response = await fetch("/api/menu", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            category,
            price
        })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.message);
        return;
    }

    alert("Menu item added successfully!");

    menuForm.reset();

    loadMenu();
});


// EDIT + DELETE
menuTable.addEventListener("click", async function(event) {

    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        const id = event.target.dataset.id;

        const row = event.target.closest("tr");

        const oldName = row.cells[1].textContent;

        const oldPrice =
            row.cells[3].textContent.replace("Rs. ", "");

        const newName =
            prompt("Enter new item name:", oldName);

        if (!newName) {
            return;
        }

        const newPrice =
            prompt("Enter new price:", oldPrice);

        if (!newPrice) {
            return;
        }

        const response = await fetch(`/api/menu/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: newName,
                price: newPrice
            })
        });

        const result = await response.json();

        alert(result.message);

        loadMenu();
    }


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const id = event.target.dataset.id;

        const confirmDelete =
            confirm("Are you sure you want to delete this item?");

        if (!confirmDelete) {
            return;
        }

        const response =
            await fetch(`/api/menu/${id}`, {
                method: "DELETE"
            });

        const result =
            await response.json();

        alert(result.message);

        loadMenu();
    }

});


// INITIAL LOAD
loadMenu();