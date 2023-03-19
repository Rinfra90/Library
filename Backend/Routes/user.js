const express = require('express')
const router = express.Router()
const execQuery = require('../modules/sqlscript');

router.post('/', (req, res) => {
    const user = req.body;
    // Allow to return data from id or from email
    let querySearch = '';
    let userData;
    if (user.email) {
        userData = user.email;
        querySearch = 'email';
    } else if (user.id) {
        userData = user.id;
        querySearch = 'id';
    } else {
        return res.status(400).json({ error: 'Wrong data' })
    }

    execQuery(`SELECT * FROM users WHERE ${querySearch}='${userData}'`, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results[0])
        } else {
            return res.status(200).json({ error: 'User not found' });
        }
    })
})

module.exports = router