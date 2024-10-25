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

app.use(express.static("public"));
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

async function getBook() {
    const result = await db.query("SELECT * FROM book");
    let books = [];
    result.rows.forEach(book => {
        books.push(book);
    });
    return books;
}

app.get("/",async (req,res)=>{
    const books = await getBook();
    res.render("index.ejs",{
        books: books
    });
})
app.get("/add",(req,res)=>{
    res.render("add.ejs")
})
// app.post("/post",(req,res)=>{
//     res.render("index.ejs")
// })
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});