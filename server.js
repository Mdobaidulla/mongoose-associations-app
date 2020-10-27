const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const PORT = 3000;

const mongoURI = 'mongodb://localhost:27017/mongoRelationships';

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('the connection with mongod is established');
  }
);

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
// ABOVE our app.get()
app.use('/users', require('./controllers/usersController'));
app.use('/albums', require('./controllers/albumsController'));

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});