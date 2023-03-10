var express = require("express");
var router = express.Router();

const Parent = require("../models/Parent.model");
const Update = require("../models/Update.model");
const Child = require("../models/Child.model");
const Games = require("../models/Games.model");

router.post("/create", (req, res, next) => {
    console.log("!!!!", req.body)
    Update.create({
        child: req.body.child._id,
        gamePlayed: req.body.game._id
    })
    .then((newUpdate) => {
        return Parent.findOneAndUpdate(
            {
                childName: req.body.child.name
            },
            {
                $push: {updates: newUpdate._id}
            },
            {new: true}
            )
    })
    .then((updatedParent) => {
        res.json(updatedParent)
    })
    .catch((err) => {
        console.log(err)
    })

  });
router.get("/allGames", (req, res, next) => {
  Games.find().then((games) => {
    res.json(games);
  });
});
router.post("/gameUpdate/:childName", (req, res, next) => {
  console.log(req.params.childName, req.body.gameId);
  // here we need to grab the childid from the front end so that we can req.params so that when we created update it puts id of child instead of parent
  //   if (!req.params.childName)
  Update.findOne({ child: req.params.childName }).then((foundChild) => {
    if (!foundChild) {
      Update.create({
        child: req.params.childName,
      }).then((createdUpdate) => {
        console.log(createdUpdate, "hi");
        return Games.findById(req.body.gameId).then((foundGame) => {
          console.log(foundGame);
          return Update.findOneAndUpdate(
            { child: req.params.childName },
            {
              gamesPlayed: foundGame._id,
            },
            { new: true }
          ).then((updatedChild) => {
            console.log(updatedChild);
          });
        });
      });
    }
    Games.findById(req.body.gameId).then((foundGame) => {
      console.log(foundGame);
      Update.findOneAndUpdate(
        { child: req.params.childName },
        {
          gamesPlayed: foundGame._id,
        },
        { new: true }
      ).then((updatedChild) => {
        console.log(updatedChild);
        return;
      });
    });
  });
});
router.get("/childupdates", (req, res, next) => {
  Updates.find()
    .populate("childName")
    .populate("gamesPlayed")
    .sort({ date: -1 })
    .then((foundUpdates) => {
      res.json(foundUpdates);
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.get("/delete-update/:updateId/:parentId", (req, res, next) => {
//   Parent.findById(req.params.parentId)
//     .then((foundParent) => {
//       if (foundParent.updates.includes(req.params.updateId)) {
//         Update.findByIdAndDelete(req.params.UpdateId)
//           .then((deletedUpdate) => {
//             res.json(deletedUpdate);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       } else {
//         res.json({ message: "You can't delete this update" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// router.get('/post-detail/:id', (req, res, next) => {
//   Post.findOne({_id: req.params.id})
//     .populate('contributor')
//     .populate('country')
//     .then((foundPost) => {
//         res.json(foundPost)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// });

// router.post('/create-post/:userId', (req, res, next) => {

//     let newPost = {
//         title: req.body.title,
//         story: req.body.story,
//         date: req.body.date,
//         photo: req.body.photo,
//         contributor: req.params.userId,
//         country: req.body.country
//     }

//     Post.create(newPost)
//     .then((createdPost) => {
//         User.findByIdAndUpdate(

//                 req.params.userId
//             ,
//             {
//             $push: {posts: createdPost._id}
//             },
//             {new: true})
//             .then((updatedUser) => {
//                 console.log(updatedUser)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//         return createdPost
//     })
//     .then((post) => {
//          return post.populate('contributor')
//         })
//     .then((populated) => {
//         return populated.populate('country')
//     })
//     .then((populatedPost) => {
//         res.json(populatedPost)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

// })

// router.post('edit-post/:postId/:userId', (req, res, next) => {

//     Post.findByIdAndUpdate(req.params.postId,
//         {
//         title: req.body.title,
//         story: req.body.story,
//         date: req.body.date,
//         },
//         {new: true}
//         )
//         .then((updatedPost) => {
//             res.json(updatedPost)
//         })
//         .catch((err) => {
//             console.log(err)
//         })

// })

module.exports = router;