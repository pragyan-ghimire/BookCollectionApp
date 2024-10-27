 CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    book_name TEXT NOT NULL,
    rating INT,
    date DATE DEFAULT CURRENT_DATE,
	description TEXT
);

