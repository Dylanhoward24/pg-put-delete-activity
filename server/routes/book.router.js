const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  console.log('id is', req.params.id);
  console.log('isRead is', req.body.isRead);

  const sqlQuery = `
    UPDATE "books"
    SET "isRead" = $1
    WHERE "id" = $2
  `;

  const sqlParams = [
    req.body.isRead,    // $1
    req.params.id       // $2
  ];

  pool.query(sqlQuery, sqlParams)
      .then((dbRes) => {
          res.sendStatus(200);
      }).catch((err) => {
        console.log('UPDATE err', err);
        res.sendStatus(500);
      });
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id', (req, res) => {
  console.log('req.params.id', req.params.id);
  
  // const idToDelete = req.params.id;
  let queryText = `
    DELETE FROM "books"
    WHERE "id" = $1;
  `;
  const sqlParams = [
    req.params.id
  ];
  pool.query(queryText, sqlParams)
    .then((dbRes) => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log('DELETE error', err);
    });
});

module.exports = router;
