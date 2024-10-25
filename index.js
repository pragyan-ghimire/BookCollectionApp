import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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


// let books = [
//     {
//         id: 1,
//         book_name: "The Power Of Subconcious Mind",
//         rating: 9,
//         date: "2023-10-09",
//         description: "The Power Of Your Subconscious Mind is a spiritual self-help classic, which teaches you how to use visualization and other suggestion techniques to adapt your unconscious behavior in positive ways." 
//     },
//     {
//         id:2,
//         book_name: "Atomic Habits",
//         rating: 9,
//         date:"2024-10-20",
//         description:"\"Atomic Habits\" by James Clear emphasizes the power of small, incremental changes and the importance of building good habits and breaking bad ones through a systematic approach, focusing on identity, environment, and systems rather than goals."
//     }
// ]

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
    await db.query("INSERT INTO book (book_name, rating, description) VALUES ($1,$2,$3)",[title, rating, description]);
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
})
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});