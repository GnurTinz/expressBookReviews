const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & Task 10: Get the book list available in the shop using async-await with Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using async-await with Promises
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
    const bookDetails = await getBookByISBN;
    return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});
  
// Task 3 & Task 12: Get book details based on author using async-await with Promises
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let matchingBooks = [];
      let keys = Object.keys(books);
      keys.forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(books[isbn]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ status: 404, message: "Books by this author not found" });
      }
    });
    const matchingBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 4 & Task 13: Get all books based on title using async-await with Promises
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      let matchingBooks = [];
      let keys = Object.keys(books);
      keys.forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push(books[isbn]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ status: 404, message: "Books with this title not found" });
      }
    });
    const matchingBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* ==========================================================================
   Methods using Axios and Promises / Async-Await for Node.js clients
   ========================================================================== */

// Method 1 (Task 10): Get all books using Axios with Async/Await
const getAllBooksAxios = async (baseURL = "http://localhost:5000") => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Method 2 (Task 11): Get book details by ISBN using Axios with Promises
const getBookByISBNAxios = (isbn, baseURL = "http://localhost:5000") => {
  return axios.get(`${baseURL}/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

// Method 3 (Task 12): Get book details by Author using Axios with Async/Await
const getBooksByAuthorAxios = async (author, baseURL = "http://localhost:5000") => {
  try {
    const response = await axios.get(`${baseURL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Method 4 (Task 13): Get book details by Title using Axios with Promises
const getBooksByTitleAxios = (title, baseURL = "http://localhost:5000") => {
  return axios.get(`${baseURL}/title/${encodeURIComponent(title)}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
