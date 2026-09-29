const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// ==============================
// STATUS API
// ==============================

app.get("/api/status", (req, res) => {
res.json({
message: "Restaurant Admin Dashboard is running!"
});
});

// ==============================
// MENU DATA
// ==============================

let menuItems = [
{
id: 1,
name: "Chicken Pizza",
category: "Pizza",
price: 1200,
status: "Available"
},
{
id: 2,
name: "Zinger Burger",
category: "Burger",
price: 750,
status: "Available"
},
{
id: 3,
name: "Chocolate Cake",
category: "Dessert",
price: 600,
status: "Available"
}
];

// ==============================
// GET MENU
// ==============================

app.get("/api/menu", (req, res) => {

```
res.json(menuItems);
```

});

// ==============================
// ADD MENU ITEM
// ==============================

app.post("/api/menu", (req, res) => {

```
const { name, category, price } = req.body;

if (!name || !category || !price) {

    return res.status(400).json({
        message: "All fields are required."
    });

}

const newItem = {

    id: menuItems.length + 1,

    name: name,

    category: category,

    price: Number(price),

    status: "Available"

};

menuItems.push(newItem);

res.status(201).json({

    message: "Menu item added successfully!",

    item: newItem

});
```

});

// ==============================
// EDIT MENU ITEM
// ==============================

app.put("/api/menu/:id", (req, res) => {

```
const id = Number(req.params.id);

const { name, price } = req.body;

const item = menuItems.find(
    item => item.id === id
);

if (!item) {

    return res.status(404).json({

        message: "Menu item not found."

    });

}

if (name) {

    item.name = name;

}

if (price) {

    item.price = Number(price);

}

res.json({

    message: "Menu item updated successfully!",

    item: item

});
```

});

// ==============================
// DELETE MENU ITEM
// ==============================

app.delete("/api/menu/:id", (req, res) => {

```
const id = Number(req.params.id);

const itemIndex =
    menuItems.findIndex(
        item => item.id === id
    );

if (itemIndex === -1) {

    return res.status(404).json({

        message: "Menu item not found."

    });

}

menuItems.splice(itemIndex, 1);

res.json({

    message: "Menu item deleted successfully!"

});
```

});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
