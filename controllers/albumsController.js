const router = require('express').Router();
const Album = require('../models/album').Album;
const Song = require('../models/album').Song;

//INDEX
// ALL USERS INDEX
router.get('/', (req, res) => {
  Album.find({}, (error, albums) => {
    res.render('albums/index.ejs', { albums });
  });
});

// NEW USER FORM
router.get('/new', (req, res) => {
  res.render('albums/new.ejs');
});

// ADD EMPTY FORM TO USER SHOW PAGE TO ADD TWEET TO A USER
router.get('/:userId', (req, res) => {
    // find user in db by id and add new tweet
    Album.findById(req.params.userId, (error, album) => {
      res.render('albums/show.ejs', { album });
    });
    console.log("Executing form get line 23");
  });


//Following two method is working to update user, but only first name of the user 
// is pulling from the database
  // EDIT
  router.get("/:id/edit", (req, res)=>{
    Album.findById(req.params.id, (error, albumFromDB) =>{
      res.render("./albums/edit.ejs", {
        album: albumFromDB
      })
    })
    
  })



// CREATE A NEW USER
router.post('/', (req, res) => {
  Album.create(req.body, (error, user) => {
    res.redirect(`/albums/${user.id}`);
  });
});


// CREATE TWEET EMBEDDED IN USER
router.post('/:userId/songs', (req, res) => {
  console.log(req.body.songName);
  // store new tweet in memory with data from request body
  const newSong = new Song({ songName: req.body.songName });
  // find user in db by id and add new tweet
  Album.findById(req.params.userId, (error, album) => {
    album.songs.push(newSong);
    album.save((err, album) => {
      res.redirect(`/albums/${album.id}`);
    });
  });
});

router.delete("/:id", (req, res)=>{
  Album.findByIdAndRemove(req.params.id, (error) =>{
    res.redirect("/albums");
  });

})


router.get('/:userId/songs/:tweetId/edit', (req, res) => {
  // set the value of the user and tweet ids
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  // find user in db by id
  Album.findById(userId, (err, foundAlbum) => {
    // find tweet embedded in user
    const foundSong = foundAlbum.songs.id(tweetId);
    // update tweet text and completed with data from request body
    res.render('songs/edit.ejs', { foundAlbum, foundSong });
  });
});
// UPDATE TWEET EMBEDDED IN A USER DOCUMENT
router.put('/:userId/songs/:tweetId', (req, res) => {
  console.log('PUT ROUTE');
  // set the value of the user and tweet ids
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  // find user in db by id
  Album.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    const foundTweet = foundUser.songs.id(tweetId);
    // update tweet text and completed with data from request body
    foundTweet.songName = req.body.songName;
    foundUser.save((err, savedUser) => {
      res.redirect(`/albums/${foundUser.id}`);
    });
  });
});

router.delete('/:userId/songs/:tweetId', (req, res) => {
  console.log('DELETE SONGS');
  // set the value of the user and tweet ids
  const userId = req.params.userId;
  const tweetId = req.params.tweetId;
  // find user in db by id
  Album.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    foundUser.songs.id(tweetId).remove();
    // update tweet text and completed with data from request body
    foundUser.save((err, savedUser) => {
      res.redirect(`/albums/${foundUser.id}`);
    });
  });
});
module.exports = router;