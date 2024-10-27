import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

// connecting to database
const db = new pg.Client({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "collection"
});
db.connect();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

const baseApiUrl = "https://openlibrary.org/"; // api base url of open library api

// function to get all records
async function getBooks() {
    const result = await db.query("SELECT * FROM book ORDER BY date DESC");
    let books = [];
    result.rows.forEach(book => {
        books.push(book);
    });
    return books;
}

//function to get all records according to order selected
async function getBooksByOrder(orderby) {
    let result ;
    if(orderby == "book_name")
        result = await db.query("SELECT * FROM book ORDER BY book_name ASC ");
    else
        result = await db.query(`SELECT * FROM book ORDER BY ${orderby} DESC `);
    let books = [];
    result.rows.forEach(book => {
        books.push(book);
    });
    // console.log(books);
    return books;
}

//to get specific book matching book id
async function getBook(book_id){
    const result = await db.query("SELECT * FROM book WHERE id = $1",[book_id]);
    const book = result.rows[0];
    return book;
    // console.log(result);
}

//to get the cover id for book cover image using openlibray api
async function getCidValue(title) {
    const response = await axios.get(`${baseApiUrl}search.json?title=${encodeURIComponent(title)}`);
    const cidVal = response.data.docs[0]?.cover_i; // e.g., "/works/OL17930368W"
    // console.log(cidVal);
    return cidVal;
}

// homepage
app.get("/",async (req,res)=>{
    const books = await getBooks();
    res.render("index.ejs",{
        books: books
    });
});
//to open book detail form
app.get("/add",(req,res)=>{
    res.render("add.ejs",{
        heading: "Add To Collection",
        text: "Post",
        book: null
    });
});
//to insert book detail to database
app.post("/post",async (req,res)=>{
    const title = req.body.title;
    const rating = req.body.rating;
    const description = req.body.description;
    const cidVal = await getCidValue(title);
    await db.query("INSERT INTO book (book_name, rating, description, key) VALUES ($1,$2,$3,$4)",[title, rating, description,cidVal]);
    
    res.redirect("/");
});
// to open form to edit specific book detail 
app.get("/edit/:id",async (req,res)=>{
    const book_id = req.params.id;
    const book = await getBook(book_id);
    // console.log(book_id);
    // console.log(book);
    res.render("add.ejs",{
        heading: "Edit Book Detail",
        book: book,
        text: "Update"
    });
});
// to send updated book detail to db
app.post("/update/:id",async (req,res)=>{
    const book_id = req.params.id;
    const book = await getBook(book_id);
    const newDetail = {
        book_name : req.body.title || book.book_name,
        rating: req.body.rating || book.rating,
        description: req.body.description || book.description
    };
    await db.query("UPDATE book SET book_name = $1, rating = $2, description = $3 WHERE id = $4",[newDetail.book_name,newDetail.rating, newDetail.description, book_id]);
    res.redirect("/");
});
//to delete specific book from db
app.get("/delete/:id",async (req,res)=>{
    const book_id = req.params.id;
    await db.query("DELETE FROM book WHERE id = $1",[book_id]);
    res.redirect("/");
});
// to order the book collection list
app.post("/orderby",async (req,res)=>{
    const orderby = req.body.order || date;
    console.log(orderby);
    const books = await getBooksByOrder(orderby);
    res.render("index.ejs",{
        books: books,
        order: orderby
    });
});
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});