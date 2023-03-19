const express = require('express');
const router = express.Router();
const execQuery = require('../modules/sqlscript');
// const {books} = require('../books');
// const {users} = require('../users');

// Lista di tutti i libri presenti
router.get('/', (req, res) => {
    execQuery('SELECT isbn, title, add_date, remove_date, story, author FROM books;', (error, results) => {
        if (error) throw error;
        res.status(200).json(results);
    });
    // Vecchio codice con json
    // const booksList = books.map(book => {
    //     const {title, author, isbn} = book;
    //     return {title, author, isbn};
    // })
    // res.status(200).json(booksList);
});

// Lista dei libri dell'utente con letture
router.get('/userbooks', (req, res) => {
    const userID = req.userID; // Utente preso dall'url

    // const user = users.find(user => user.id === userID); // Trovo l'utente giusto

    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;

        const user = results[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        execQuery(`SELECT * FROM user_books WHERE user_id = '${user.id}'`, (err, result) => {
            if (err) throw err;

            const userBooks = result;

            if (!userBooks) {
                return res.status(404).json({ error: "User's books not found" })
            }

            return res.status(200).json(userBooks);
        })
    })
    // Vecchio codice con json
    // if(!user){
    //     return res.status(404).json({error: 'Utente non trovato'})
    // }
    // // Riduco la lista di tutti i libri a 3 elementi
    // const booksList = books.map(book => {
    //     const {title, author, isbn} = book;
    //     return {title, author, isbn};
    // })

    // const userBooks = user.books; // Estraggo dall'utente i libri che possiede
    // const filteredBooks = booksList.filter(book => userBooks.some(userBook => userBook.isbn === book.isbn))
    // const outputBooks = filteredBooks.map(book => {
    //     const userBook = userBooks.find(userBook => userBook.isbn === book.isbn);
    //     return {
    //         ...book,
    //         readTimes: userBook ? userBook.readTimes : null
    //     }
    // })
    // const outputBooks = booksList.filter(book => userBooks.some(userBook => userBook.isbn === book.isbn));
    // res.status(200).json(outputBooks);
})

// Dati specifici di un libro
router.get('/:isbn', (req, res) => {
    const { isbn } = req.params;
    execQuery(`SELECT * FROM books WHERE isbn = '${isbn}'`, (error, results) => {
        if (error) throw error;
        const book = results[0];
        res.status(200).json(book)
    })
    // Vecchio codice con json
    // const book = books.find(book => book.isbn == isbn);
    // res.status(200).json(book);
});

router.post('/', (req, res) => {
    const userID = req.userID;
    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;
        const user = results[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        const newBook = req.body;
        console.log(newBook)
        execQuery(`SELECT isbn FROM books WHERE isbn='${newBook.book_isbn}'`, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                return res.status(404).json({ error: 'Book not in library' })
            } else {
                execQuery(`SELECT * FROM user_books WHERE user_id='${userID}' && book_isbn='${newBook.book_isbn}'`, (newErr, newResult) => {
                    if (newErr) throw newErr;
                    if (newResult.length > 0) {
                        return res.status(200).json({ error: 'Book already in personal library' });
                    } else {
                        execQuery(`INSERT INTO user_books (user_id, book_isbn) VALUES ('${user.id}','${newBook.book_isbn}')`, (otherErr, otherResult) => {
                            if (otherErr) throw otherErr;
                            return res.status(200).json({ success: 'Book added to personal library' });
                        });
                    }
                });
            }
        });
    });
    // Vecchio codice con json
    // const user = users.find(user => user.id === userID); // Trovo l'utente per avere i suoi libri
    // const newBook = req.body;
    // const book = books.find(book => book.isbn === newBook.isbn); // Verifica gestione libro
    // if(book){
    //     const userBooks = user.books.find(userBook => userBook.isbn === book.isbn) // Verifico se il libro era già presente
    //     if(!userBooks){
    //         user.books.push({isbn: newBook.isbn, readTimes: 0}); // Aggiungo il libro alla libreria personale
    //         res.status(200).json({success: 'Book added to personal library', data: user.books});
    //         return;
    //     } else {
    //         res.status(200).json({success: 'Book already in personal library', data: user.books});
    //         return;
    //     }
    // } else {
    //     res.status(404).json({error: 'Book not in library'});
    // }
});

router.put('/addread/:isbn', (req, res) => {
    const { isbn } = req.params;
    const userID = req.userID;
    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;
        const user = results[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        execQuery(`SELECT isbn FROM books WHERE isbn='${isbn}'`, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                return res.status(404).json({ error: 'Book not in library' })
            }
            execQuery(`SELECT * FROM user_books WHERE user_id='${userID}' && book_isbn='${isbn}'`, (newErr, newResult) => {
                if (newErr) throw newErr;
                if (newResult.length == 0) {
                    return res.status(200).json({ error: 'Book not in personal library' });
                } else {
                    execQuery(`UPDATE user_books SET read_count = read_count + 1 WHERE user_id='${user.id}' && book_isbn='${isbn}'`, (otherErr, otherResult) => {
                        if (otherErr) throw otherErr;
                        return res.status(200).json({ success: "Book's read count updated" })
                    });
                }
            });
        });
    });
    // Vecchio codice con json
    // const user = users.find(user => user.id === userID);
    // const bookIndex = user.books.findIndex(book => book.isbn === isbn);
    // if(bookIndex === -1){
    //     res.status(404).json({error: 'Book not in personal library'});
    // } else {
    //     user.books[bookIndex].readTimes = Number(user.books[bookIndex].readTimes)+1;
    //     res.status(200).json({success: 'Book read times modified', data: user.books});
    // }    
});

router.put('/removeread/:isbn', (req, res) => {
    const { isbn } = req.params;
    const userID = req.userID;
    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;
        const user = results[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        execQuery(`SELECT isbn FROM books WHERE isbn='${isbn}'`, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                return res.status(404).json({ error: 'Book not in library' })
            }
            execQuery(`SELECT * FROM user_books WHERE user_id='${userID}' && book_isbn='${isbn}'`, (newErr, newResult) => {
                if (newErr) throw newErr;
                if (newResult.length == 0) {
                    return res.status(200).json({ error: 'Book not in personal library' });
                } else {
                    if (newResult[0].read_count == 0) {
                        return res.status(200).json({ success: "Book's read count already 0" });
                    } else {
                        execQuery(`UPDATE user_books SET read_count = read_count - 1 WHERE user_id='${user.id}' && book_isbn='${isbn}'`, (otherErr, otherResult) => {
                            if (otherErr) throw otherErr;
                            return res.status(200).json({ success: "Book's read count updated" });
                        });
                    }
                }
            });
        });
    });
    // Vecchio codice con json
    // const {isbn} = req.params;
    // const userID = req.userID;
    // const user = users.find(user => user.id === userID);
    // const bookIndex = user.books.findIndex(book => book.isbn === isbn);
    // if(bookIndex === -1){
    //     res.status(404).json({error: 'Book not in personal library'});
    // } else if(user.books[bookIndex].readTimes == 0){
    //     console.log(user.books[bookIndex].readTimes)
    //     res.status(200).json({success: 'Book read times already at 0', data: user.books})
    //     return;
    // } else {
    //     user.books[bookIndex].readTimes = Number(user.books[bookIndex].readTimes)-1;
    //     res.status(200).json({success: 'Book read times modified', data: user.books});
    // }    
})

router.delete('/:isbn', (req, res) => {
    const { isbn } = req.params;
    const userID = req.userID;
    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;
        const user = results[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        execQuery(`SELECT * FROM user_books WHERE user_id='${userID}' && book_isbn='${isbn}'`, (err, result) => {
            if (err) throw newErr;
            if (result.length == 0) {
                return res.status(200).json({ error: 'Book not in personal library' });
            }
            execQuery(`DELETE FROM user_books WHERE user_id='${user.id}' && book_isbn='${isbn}'`, (newErr, newResult) => {
                if (newErr) throw newErr;
                return res.status(200).json({ success: 'Book removed' });
            })
        })
    })
    // Vecchio codice con json
    // const user = users.find(user => user.id === userID);
    // const bookIndex = user.books.findIndex(book => book.isbn === isbn); // Trovo l'indice del libro nell'array
    // if(bookIndex === -1){
    //     res.status(404).json({error: 'Book not in personal library'});
    // } else {
    //     user.books.splice(bookIndex,1); // Rimuovo il libro
    //     res.status(200).json({success: 'Book removed', data: user.books});
    // }
})

module.exports = router