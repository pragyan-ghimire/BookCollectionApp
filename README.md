
## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)
## About The Project
![1](https://github.com/user-attachments/assets/1459eb65-072c-467a-a4a7-28dc5883d063)

Book Collection App is a CRUD project that allows user to have their own personalized collection of books they have read so far.
It is user-friendly and interactive. Just get started!  
### Built With
These are the frameworks/libraries used to create this project. 

* [![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3.3-563d7c)](https://getbootstrap.com)
* [![Expressjs](https://img.shields.io/badge/Express-v4.19.02-eeeeee)](https://expressjs.com)
* [![Node.js](https://img.shields.io/badge/Node.js-v22.9.0-417e38)](https://nodejs.org/en)
* [![body-parser](https://img.shields.io/badge/body--parser-v1.20.2-blue)](https://www.npmjs.com/package/body-parser)
* [![OpenLibraryAPI](https://img.shields.io/badge/OpenLibraryAPI-orange)](https://openlibrary.org/developers/api)
* [![PostgresSQL](https://img.shields.io/badge/PostgresSQL-blue)](https://www.postgresql.org/)



### Features

- Add book details
- Edit book details
- Delete book details
- View book details with order




## Getting Started
This section will guide you through setting up and running the Book Collection App on your local machine.
### Prerequisites
Ensure you have the following installed on your local development machine:
* Node.js (v18 or above) – [Download here](https://nodejs.org/en/download/package-manager)
* npm (Node package manager) – Comes with Node.js
* Code editor or IDE. Recommended - [Visual Studio Code](https://code.visualstudio.com/download)
* Postgres SQL - [Postgres SQL](https://www.postgresql.org/)
* Install nodemon globally:
```bash
  npm install -g nodemon
```

### Query 

Create a database with name "collection" in pgAdmin. Then, run the following command to create table "book".
```bash
    CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    book_name TEXT NOT NULL,
    rating INT,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT
);
```
### Installation

Clone the project

```bash
  git clone https://github.com/pragyan-ghimire/BookCollectionApp.git
```

Go to the project directory

```bash
  cd /path/BookCollectionApp
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon index.js
```


## Usage

Once the server is running, you can use the Book Collection App as follows:

### 1. Access the Main Page

- Open your browser and go to `http://localhost:3000`.
- On this page, you can:
1. View books that have been added to your collection.
2. Add a new book by clicking the "Add" button.
3. Edit or delete an existing book.
4. Choose the order in which to display the books.

![1](https://github.com/user-attachments/assets/1459eb65-072c-467a-a4a7-28dc5883d063)
![image](https://github.com/user-attachments/assets/1680e5c8-d614-4178-b81e-4fb403b96453)



### 2. Add to Collection

- Click on Add button on main page.
![image](https://github.com/user-attachments/assets/ca73d0a2-9f64-46e1-90d6-abb2587c4c98)


### 3. Edit Existing Book Detail

- Click on the Edit button of existing book.
![image](https://github.com/user-attachments/assets/7e718bd8-9b63-449f-8c87-acbbb6bfe106)


## FAQ

#### Is it responsive?

No, it is not responsive as the aim of this project was to learn data persistency

#### How book cover image is loaded?

The book cover image is loaded with the help of OpenLibrary API.
For more detail, read [here](https://openlibrary.org/developers/api).



