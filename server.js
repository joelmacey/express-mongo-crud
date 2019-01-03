const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const port = 8088;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient

// Configures Express Server to use Body Parser and EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

//Configures Mongodb's database to be used
const dbName = 'books';
// Initiates the db variable to be configured once the connection is established
let db;

// Configures MongoDB and Starts the Server once it's working
MongoClient.connect('mongodb://localhost:27017/',{ useNewUrlParser: true }, (err, client) => {
  // db = client.db(dbName);
  if (err) return console.log(err);
  app.listen(port, () => {
    //Starts the server if no errors
    console.log(`app listening on port ${port}`);
  });
});
// This is for the front page, renders in index.ejs
app.get('/', (req, res) => {
    res.render('index.ejs');
});

  // This is for retrieving all the currently available items onto a page
  app.get('/catalogue', (req, res) => {
    db.collection(dbName).find().toArray((err, result) => {
      if (err) return console.log(err);
      // Renders all items into catalogue
      res.render('catalogue.ejs', {items: result});
    });
  });

  // This is for creating a new Item
  app.post('/books', (req, res) => {
    db.collection(dbName).insertOne(req.body, (err, result) => {
      if (err) return console.log(err);
      //Refreshes the page on completion - to display newest changes
      res.redirect('/catalogue');
    });
  });

  // Retrieves the edit.ejs page
  app.get('/books/edit/:id', (req, res) => {
    db.collection(dbName).findOne({"_id": new mongodb.ObjectId(req.params.id)}, (err, result) => {
      if (err) return console.log(err);
      res.render('edit.ejs', {items: result});
    });
  });

  // Update the item sent in the body with the updated set
  app.post('/books/edit/:id', (req, res) => {
    db.collection(dbName).updateOne({"_id": new mongodb.ObjectId(req.params.id)},
    // Return to improve this, as this is not good for future changes
    { $set: {title:req.body.title, image: req.body.image, author: req.body.author, description: req.body.description, website: req.body.website}},
     (err, result) => {
      if (err) return console.log(err);
      console.log(req.params.id+' updated');
      res.redirect('/catalogue');
    });
  });

  // Delete the item sent in the body
  app.get('/books/delete/:id', (req, res) => {
    db.collection(dbName).deleteOne({"_id": new mongodb.ObjectId(req.params.id)}, (err, result) => {
      if (err) return console.log(err);
      console.log(req.params.id+' deleted');
      res.redirect('/catalogue');
    });
  });

require('./routes/books')(app, db);

// To Do list
// Create Mocha Tests
// Move Routes out of server.js and into it's own folder - bad practice
// Move Edit into Modal instead of page
// Make confirm deletion modal for stopping accidental deletion
