const express = require('express')
const cors = require('cors')
const app = express()

const bookRouter = require('./Routes/books')
const userRouter = require('./Routes/user')

app.use(express.json())
app.use(cors({ origin: 'http://localhost:4200' })) // Necessario per autorizzare richieste da un altra porta

// app.param è utilizzato per passare il parametro user al Router
app.param('userID', (req, res, next, userID, userMail) => {
    req.userID = userID;
    next();
})

// Definisco le route
app.use('/api/books/:userID', bookRouter);
app.use('/api/user/', userRouter);

app.listen(3000)