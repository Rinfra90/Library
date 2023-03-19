# Library

## Info

App web per la gestione di libri. L'applicazione è stata sviluppata come test tecnico per Hastega seguendo le linee guida del [Test tecnico](https://github.com/Rinfra90/Library/blob/main/Test%20tecnico%202022.pdf). Per maggiori informazioni, visualizza [il testo della prova](#testo-della-prova) riportato a fine documento.
Per praticità di analisi del progetto, il tutto è stato diviso in due macro cartelle: `/Backend` e `/Frontend`.
Il progetto è stato sviluppato interamente in inglese anche se non richiesto, le uniche parti in italiano sono dei refusi o i dati all'interno del database.

## Tecnologie utilizzate

### Frontend

`Angular`

### Backend

`NodeJS`
Sono inoltre stati utilizzati per praticità i moduli `Express` e `Nodemon`.

### Database

`MariaDB`

## Specifiche tecniche

### Database

#### Info

I file del database sono stati inseriti all'interno della cartella `Backend/db`. Per poter utilizzare il database, è necessario installare `MariaDB Server` ed inserire la cartella `library` nella cartella `data` all'interno della cartella di installazione di `MariaDB`.
Il backend comunica con il database alle seguenti credenziali:
```
host: localhost (o 127.0.0.1)
user: root
password: password
database: library
```

#### Struttura

Il database è diviso in 3 tabelle: una degli utenti, una dei libri ed una che identifica i libri posseduti da ogni utente.

##### Users

```
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
)
```

##### Books

```
(
  isbn VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(50) NOT NULL,
  add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remove_date TIMESTAMP NULL,
  story TEXT NOT NULL,
  PRIMARY KEY (isbn)
)
```

##### Users_books

```
(
  user_id INT NOT NULL,
  book_isbn VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_id, book_isbn),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_isbn) REFERENCES books(isbn),
  read_count INT DEFAULT 0
)
```

### Backend

#### Info

Per poter avviare il server di backend, è necessario installare `npm` e `NodeJS`.
La cartella node_modules è stata cancellata. Per reinstallarla, andare nella cartella di progetto da terminale e lanciare il seguente comando `npm install`. Questa procedura è necessaria.
E' inoltre previsto l'uso di `Nodemon` come dev dependency in modo da non dover riavviare sempre il server ad ogni modifica.
Il server girerà sotto la porta `3000`.
Vista la necessità di loggarsi all'applicazione per poter accedere ai contenuti, è stato inserita in ogni richiesta il passaggio dell'utente attualmente loggato per poter ricevere dati.

#### Esecuzione normale

Per avviare il server di backend aprire la cartella del progetto da terminale e lanciare il comando `node app.js`.

#### Esecuzione da Nodemon

Per avviare il server di backend tramite Nodemon è stato creato un apposito script. Per lanciare lo script, aprire la cartella del progetto da terminale e lanciare il comando `node start`. Una volta effettuata una modifica e salvato il file, Nodemon riavvierà in automatico il server.

#### Endpoint

Il backend è in grado di rispondere alle seguenti richieste ai seguenti endpoint:
```
GET - /api/books/:userID - Restituisce la lista di tutti i libri
GET - /api/books/:userID/userbooks - Restituisce la lista dei libri dell'utente
GET - /api/books/:userID/:isbn - Restituisce i dettagli di uno specifico libro
POST - /api/books/:userID - Aggiunge un libro passato nel body alla libreria personale. Struttura necessaria: { book_isbn: string }
PUT - /api/books/:userID/addread/:isbn - Modifica il conteggio di letture di un libro da parte dell'utente incrementandolo
PUT - /api/books/:userID/removeread/:isbn - Modifica il conteggio di letture di un libro da parte dell'utente diminuendolo
DELETE - /api/books/:userID/:isbn - Rimuove un libro dalla libreria personale
POST - /api/user - Restituisce i dati dell'utente. Le strutture che accetta sono { email: string } o { id: string }
```

### Frontend

#### Info

Per poter avviare il server di frontend, è necessario installare `npm` e `NodeJS`.
La cartella node_modules è stata cancellata. Per reinstallarla, andare nella cartella di progetto da terminale e lanciare il seguente comando `npm install`. Questa procedura è necessaria.
Il server girerà sotto la porta `4200`.
Oltre alle richieste del test, il frontend è provvisto di una pagina che visualizza i dati dell'utente attualmente loggato e una pagina che mostra tutti i libri in libreria in modo da poter raggiungere facilmente un libro non posseduto ed aggiungerlo alla propria libreria.
E' anche stato inserito un servizio di visualizzazione messaggi che viene accompagnato per tutta l'app in modo da tenere in vista un log per aiutare a comprendere i passaggi dell'app già dalla sua esecuzione.

#### Esecuzione

Per avviare il server di frontend aprire la cartella del progetto da terminale e lanciare il comando `ng serve`. Una volta avviato, il server sarà raggiungibile tramite browser all'indirizzo `localhost:4200`. E' possibile anche lanciare il comando `ng serve --open` che aprirà il browser all'indirizzo corretto una volta lanciato il server.

## Testo della prova

### Introduzione

Implementare una semplice applicazione web per gestire la propria libreria. Gli utenti
possono aggiungere, modificare e rimuovere libri dalla propria libreria. Inoltre, ogni utente vuole tenere traccia del numero di letture per ogni libro.

### Descrizione entità

Ogni libro è identificato dai seguenti attributi:
● Titolo
● Autore
● Codice ISBN
● Data di aggiunta alla liberia
● Data di eliminazione (se cancellato)
● Trama
● Numero di letture complete
L’utente è invece identificato da
● Nome
● Cognome
● Email

### Specifiche Tecniche

L’applicazione si compone di una parte server(BE) e una parte client (FE).
Il Frontend si compone solamente di tre schermate:
● login (vedi il primo punto della lista seguente);
● la lista dei libri in possesso dell’utente loggato;
● la pagina di dettaglio del libro, in cui è possibile visualizzare tutte le informazioni.
Il Backend espone alcune APIs che consentono al Frontend di accedere ai dati memorizzati
nel database.

### Dal punto di vista tecnico:

● Non è richiesta autenticazione, è sufficiente prevedere solamente una schermata da cui poter
selezionare l’utente che utilizza l’applicazione;
● Versionamento su repository GIT;
● Tecnologie accettate per il Backend:
○ SpringBoot
○ Laravel
○ NodeJs
● Tecnologie accettate per il Frontend:
○ Angular
○ VueJS
○ React
● Database Accettati:
○ MySQL
○ PostgreSQL
○ MariaDB
Per tutto quello che non è esplicitamente richiesto, puoi procedere nel modo che ritieni migliore.
Sono considerati punti extra:
● Utilizzo di Docker
● UIX curata
● Applicazione ampliata oltre le richieste
● Deploy su server (Server fornito da Hastega, richiedere le credenziali SSH)
Puoi svolgere l’esercizio come meglio credi, al colloquio ti verrà richiesto di esporre quanto fatto e il ragionamento che ha portato i risultati ottenuti.