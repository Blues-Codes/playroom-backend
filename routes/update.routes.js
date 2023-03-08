var express = require('express');
var router = express.Router();

const Parent = require('../models/Parent.model');
const Updates = require('../models/Update.model');
const Child = require('../models/Child.model');

router.get('/childupdates', (req, res, next) => {
  Updates.find()
    .populate('childName')
    .populate('gamesPlayed')
    .sort({date: -1})
    .then((foundUpdates) => {
        res.json(foundUpdates)
    })
    .catch((err) => {
        console.log(err)
    })
});

router.get('/delete-update/:updateId/:parentId', (req, res, next) => {
    Parent.findById(req.params.parentId)
        .then((foundParent) => {
            if (foundParent.updates.includes(req.params.updateId)) {
                Update.findByIdAndDelete(req.params.UpdateId)
                    .then((deletedUpdate) => {
                        res.json(deletedUpdate)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                res.json({message: "You can't delete this update"})
            }
        })
        .catch((err) => {
            console.log(err)
        })
})



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
