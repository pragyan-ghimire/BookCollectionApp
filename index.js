import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

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

const baseApiUrl = "https://openlibrary.org/";

async function getBooks() {
    const result = await db.query("SELECT * FROM book");
    let books = [];
    result.rows.forEach(book => {
        books.push(book);
    });
    return books;
}

async function getBook(book_id){
    const result = await db.query("SELECT * FROM book WHERE id = $1",[book_id]);
    const book = result.rows[0];
    return book;
    // console.log(result);
}

async function getCidValue(title) {
    const response = await axios.get(`${baseApiUrl}search.json?title=${encodeURIComponent(title)}`);
    const cidVal = response.data.docs[0]?.cover_i; // e.g., "/works/OL17930368W"
    console.log(cidVal);
    return cidVal;
}

app.get("/",async (req,res)=>{
    const books = await getBooks();
    res.render("index.ejs",{
        books: books
    });
});
app.get("/add",(req,res)=>{
    res.render("add.ejs",{
        heading: "Add To Collection",
        text: "Post",
        book: null
    });
});
app.post("/post",async (req,res)=>{
    const title = req.body.title;
    const rating = req.body.rating;
    const description = req.body.description;
    const cidVal = await getCidValue(title);
    await db.query("INSERT INTO book (book_name, rating, description, key) VALUES ($1,$2,$3,$4)",[title, rating, description,cidVal]);
    
    res.redirect("/");
});
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
app.get("/delete/:id",async (req,res)=>{
    const book_id = req.params.id;
    await db.query("DELETE FROM book WHERE id = $1",[book_id]);
    res.redirect("/");
})
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});