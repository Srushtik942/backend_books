const {initializeDatabase} = require("./db/db.connect");
const express = require("express");
const fs = require("fs");
const Book = require("./model/book.model");
initializeDatabase();
const app = express();
app.use(express.json());

// add a book
async function addBook (newBook) {
    try{
        const book = new Book(newBook);
        const saveBook = await book.save();
        console.log(saveBook);
        return saveBook;

    }catch(error){
        throw error;
    }
}

app.post("/books",async(req,res)=>{
    try{
        const bookData = await addBook(req.body);
        console.log(bookData);
        res.status(200).json({message:"Book added successfully!",book:bookData});

    }catch(error){
        res.status(500).json({error:"Unable to add book data!"});
    }
})


// get all books


async function getAllBooks (){
    try{
        const bookData = await Book.find();
        console.log(bookData);
        return bookData;

    }catch(error){
        throw error;
    }
}


app.get("/books",async(req,res)=>{
    try{
        const books = await getAllBooks();

        if(books.length > 0){
            res.status(200).json({message:"Successfully fetched book data!",book: books});
        }else{
            res.status(404).json({error:"Books not found"})
        }


    }catch(error){
        res.status(500).json({error:"Failed to fetch data!"});
    }
})

// fetch data by title

async function getBookByTitle(bookTitle){
    try{
        const booksByTitle = await Book.findOne({title: bookTitle});
        console.log(booksByTitle);
        return booksByTitle;

    }catch(error){
        throw error;
    }
}

app.get("/book/:title",async(req,res)=>{
    try{
        const bookByTitle = await getBookByTitle(req.params.title);
        if(bookByTitle){
            res.status(200).json({message:"Successfully fetched data",book:bookByTitle});
        }else{
            res.status(404).json({error:"Failed to fetch the data!"});
        }


    }catch(error){
        res.status(500).json({error:"Failed to fetch the data by title"});
    }
})

// fetch all books by author

async function fetchBookByAuthor(authorName){
    try{
        const bookByAuthor = await Book.find({author:authorName});
        console.log(bookByAuthor);
        return bookByAuthor

    }catch(error){
        throw error;
    }
}

app.get("/books/:author",async(req,res)=>{
    try{
        const authorData = await fetchBookByAuthor(req.params.author);

        if(authorData){
            res.status(200).json({message:"Succeasfully fetched data!",book:authorData});
        }else{
            res.status(404).json({error:"No book found by this author"});
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch data by author"});
    }
})


//  Create an API to get all the books which are of "Business" genre.

async function getBookByGenre(genreName) {
    try{
         await Book.find({ genre: genreName });
        console.log(newBookData);
        return newBookData
    }catch(error){
        throw error;
    }

}

app.get("/book/genre/:genreName",async(req,res)=>{
    try{
        const bookData = await getBookByGenre(req.params.genreName);
        console.log(bookData);
        if(bookData.length > 0){
        res.status(200).json({message:"Fetching Book Data",books:bookData});
        }else{
            res.status(404).json({error:"No book found for this genre"})
        }

    }catch(error){
        res.status(500).json({error:"Failed to fetch book genre data"});
    }
})


// 7. Create an API to get all the books which was released in the year 2012.

async function getBookByYear(releaseYear){
    try{
        const newBookData = await Book.find({publishedYear:Number(releaseYear)});
        console.log(newBookData);
        return newBookData;

    }catch(error){
        throw error;
    }

}

app.get("/book/year/:releaseYear",async(req,res)=>{
    try{
        const bookData = await getBookByYear(req.params.releaseYear);
        console.log(bookData)

        if(bookData.length > 0){
            res.status(200).json({message:"book Data:",books:bookData});
        }else{
            res.status(404).json({error:"No Books found"})
        }

    }catch(error){
        res.status(500).json({error:"Failed to fetch book data"});
    }
})


// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book rating: { "rating": 4.5 }

async function updateBookData(bookId, dataToUpdate) {
    try{
        const bookData = await Book.findByIdAndUpdate(bookId, dataToUpdate,{new:true});
        console.log(bookData);
        return bookData;

    }catch(error){
        throw error;
    }

}


app.post("/books/:bookId",async(req,res)=>{
    try{
        const newBookData = await updateBookData(req.params.bookId, req.body);
        if(newBookData){
            res.status(200).json({message:"Book updated successfully!",book:newBookData});
        }else{
            res.status(404).json({error:"Book not found!"})
        }

    }catch(error){
        res.status(500).json({error:"Failed to fetch book data"});
    }
})

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }
async function updateBookByTitle(title, dataToUpdate) {
    try {
        const bookData = await Book.findOneAndUpdate(
            { title: title },
            dataToUpdate,
            { new: true }
        );
        console.log(bookData);
        return bookData;
    } catch (error) {
        throw error;
    }
}

app.post("/books/:title", async (req, res) => {
    try {
        const newBookData = await updateBookByTitle(req.params.title, req.body);

        if (!newBookData) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({ message: "Data updated successfully!", book: newBookData });
    } catch (error) {
        res.status(500).json({ error: "Failed to update book data" });
    }
});
// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.

async function deleteBook(bookId) {
    try{
        const newBookData = await Book.findByIdAndDelete(bookId);
        return newBookData

    }catch(error){
        throw error;
    }

}

app.delete("/books/:bookId",async(req,res)=>{
    try{
        const bookData = await deleteBook(req.params.bookId);
        res.status(200).json({message:"Book deleted successfully!"});

    }catch(error){
        res.status(500).json({error:"Failed to delete data"});
    }
})



const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}.`);
})