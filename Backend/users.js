const users = [
    {
        id: '1',
        name: "Francesco",
        surname: "Rinaldi",
        email: "francescorinaldi1990@yahoo.com",
        books: [
            {
                isbn: "979-1280035158",
                readTimes: 1
            },
            {
                isbn: '978-8845299193',
                readTimes: 1
            },
            {
                isbn: '978-8830102712',
                readTimes: 1
            },
            {
                isbn: '978-8830102729',
                readTimes: 1
            }
        ]
    },
    {
        id: '2',
        name: "Mario",
        surname: "Rossi",
        email: "mariorossi@outlook.it",
        books: [
            {
                isbn: "979-1280035158",
                readTimes: 1
            }
        ]
    },
    {
        id: '3',
        name: "Luigi",
        surname: "Bianchi",
        email: "luigibianchi@libero.net",
        books: [
            {
                isbn: "979-1280035158",
                readTimes: 1
            },
            {
                isbn: '978-8845299193',
                readTimes: 0
            }
        ]
    },
    {
        id: '4',
        name: "Giorgio",
        surname: "Giorgi",
        email: "gg@mymail.it",
        books: [
            {
                isbn: '978-8845299193',
                readTimes: 3
            },
            {
                isbn: '978-8830102712',
                readTimes: 3
            },
            {
                isbn: '978-8830102729',
                readTimes: 2
            }
        ]
    }
]

module.exports = {users};