import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import pg from "pg";
import jQuery from "jquery";
import pkg from "jquery";

const { error } = pkg;
const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "zolt",
    password: "25221901@Pos",
    port: 5432,
  });
  db.connect((error) => {
    console.log("PG database is connected successfully!")
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret: "MagaJathiAaniMuthyam-001",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));


app.get("/", (req, res) => {
    if (!req.session.cart) {
        req.session.cart =[];
    }
    res.render("consent.ejs", {cart: req.session.cart});
});

app.post("/", (req, res) => {
    if (!req.session.cart) {
        req.session.cart =[];
    }
    res.render("home.ejs", {cart: req.session.cart});
});

app.get("/home.ejs", (req, res) => {
    if (!req.session.cart) {
        req.session.cart =[];
    }
    res.render("home.ejs", {cart: req.session.cart});
});

// route for load product data

app.get("/products.ejs", async (req, res) => {
    if (!req.session.cart) {
        req.session.cart =[];
    }

    const selectProducts = "SELECT * FROM products";    
    await db.query(selectProducts, (error, result) => {
        const productsRow = result.rows;
        res.render("products.ejs", {products: productsRow, cart: req.session.cart});
    })
});
    


// route for /add-cart

app.post("/add-cart", (req, res) => {
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;

    let count = 0;

    for (let i=0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].product_id === product_id) {
            req.session.cart[i].quantity += 1;
            count++
        }
    }
    if (count === 0) {
        const cart_data = {
            product_id: product_id,
            product_name: product_name,
            product_price: parseFloat(product_price),
            quantity: 1
        };
        req.session.cart.push(cart_data);
    }
    res.redirect("/products.ejs");
});

app.get("/about.ejs", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact.ejs", (req, res) => {
    res.render("contact.ejs");
});

app.get("/blog.ejs", (req, res) => {
    res.render("blog.ejs");
});

app.get("/login.ejs", (req, res) => {
    res.render("login.ejs");
});

app.get("/register.ejs", (req, res) => {
    res.render("register.ejs");
});

app.get("/database.ejs", (req, res) => {
    res.render("database.ejs");
});

app.get("/convert-img.ejs", (req, res) => {
    res.render("convert-img.ejs");
});


// data postgres

app.post("/data-input", (req, res) => {
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    const product_image = req.body.product_image;

   db.query("INSERT INTO products (product_name, product_price, product_image) VALUES ($1, $2, $3)",
    [product_name, product_price.toLocaleString("en", { minimumFractionDigits: 2 }), product_image]);   
        
    res.redirect("/database.ejs");
});

app.post("/data-edit", (req, res) => {
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    const product_image = req.body.product_image;

    db.query("UPDATE products SET product_name = ($2), product_price = ($3), product_image = ($4) WHERE id = ($1)",
    [product_id, product_name, product_price, product_image]);  
        
    res.redirect("/database.ejs");
});


app.listen(port, () => {
    console.log(`server running port ${port}!`);
});