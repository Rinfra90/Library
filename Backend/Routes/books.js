const express = require('express');
const router = express.Router();
const execQuery = require('../modules/sqlscript');

// List of all books { isbn, title, author, add_date, remove_date, story }
// Send full struct of every book to avoid type error in frontend
router.get('/', (req, res) => {
    execQuery('SELECT * FROM books;', (error, results) => {
        if (error) throw error;
        res.status(200).json(results);
    });
});

// List of user books { user_id, book_isbn, read_count }
router.get('/userbooks', (req, res) => {
    const userID = req.userID; // Utente preso dall'url

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
})

// Data of a specific book { isbn, title, author, add_date, remove_date, story }
router.get('/:isbn', (req, res) => {
    const { isbn } = req.params;

    execQuery(`SELECT * FROM books WHERE isbn = '${isbn}'`, (error, results) => {
        if (error) throw error;
        const book = results[0];
        res.status(200).json(book)
    })
});

// Add book to personal library { book_isb }
router.post('/', (req, res) => {
    const userID = req.userID;

    execQuery(`SELECT * FROM users WHERE id = '${userID}'`, (error, results) => {
        if (error) throw error;

        const user = results[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const newBook = req.body;

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
});

// Update read count adding 1
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
});

// Update read count removing 1
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
                } else if (newResult[0].read_count == 0) {
                    return res.status(200).json({ success: "Book's read count already 0" });
                } else {
                    execQuery(`UPDATE user_books SET read_count = read_count - 1 WHERE user_id='${user.id}' && book_isbn='${isbn}'`, (otherErr, otherResult) => {
                        if (otherErr) throw otherErr;

                        return res.status(200).json({ success: "Book's read count updated" });
                    });
                }
            });
        });
    });
})

// Delete book from personal library
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
})

module.exports = router