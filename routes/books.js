module.exports = (app, db, dbName) => {
  //Configures Mongodb's database to be used
  // let dbName = 'books';

  // This is for retrieving all the currently available items onto a page
  app.get('/books', (req, res) => {
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

}
