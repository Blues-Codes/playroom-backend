var express = require('express');
var router = express.Router();

const MidGuard = require('../middleware/midGuard')
const Parent = require('../models/Parent.model')
const Child = require('../models/Child.model')
const Updates = require('../models/Update.model')

// /* GET users profile. */
// router.get('/profile', MidGuard, (req, res, next) => {
//     Parent.findById (req.params.parentId)
//     .then((foundParent) => {
//       res.json(foundParent);
//     })
//     .catch((err) => {
//       console.log(err)
//     })

// });
router.get('/profile', MidGuard, (req, res, next) => {
  Parent.findById(req.user._id)
  .populate({path: 'updates', 
  populate: [
      {path: 'child'},
      {path: 'gamePlayed'}
  ]
})

  .then((foundParent) => {
      res.json(foundParent)
  })
  .catch((err) => {
      console.log(err)
  })
});

//EDITING PARENT PROFILE
router.post('/:parentId/profile', MidGuard, (req, res, next) => {
  console.log(req.parent)
  Parent.findByIdAndUpdate(req.params.parentId, {
    name:req.body.name,
    city: req.body.city,
    email: req.body.email,
    password: req.body.password
  },{new:true})
    .then((updatedParent) =>{
      res.json(updatedParent)
    })
    .catch((err) =>{
      console.log(err)
    })
});

//ADDING CHILD TO PARENT PROFILE
router.post('/parent/:parentId/child', MidGuard, (req, res, next) => {
  let newChild = {
    childName: req.body.childName,
    childAge: req.body.childAge,
    relation: req.body.relation
  }
  Child.create(newChild)
    .then((createdChild) => {
      return Parent.findByIdAndUpdate(
        {
          _id: req.params.parentId
        }, 
        {
          $push: {child: createdChild._id}
        },
        {new: true})
    })
    .then((updatedParent) => {
      return updatedParent.populate('child')
    })
    .then((updatedParentWithChild) => {
      return res.json(updatedParentWithChild)
    })
    .catch((err) => {
      console.log(err)
    })
});

router.get("/delete-profile/:id", (req, res, next) => {
  Parent.findOneAndDelete({ _id: req.params.id })
    .then((deletedParent) => {
      if (deletedParent) {
        res.json({ message: "Profile deleted successfully" });
      } else {
        res.json({ message: "Profile not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Error deleting profile" });
    });
});

// });

  
// });

// // Adding Child 
// router.post('/profile-edit/:userId', (req, res, next) => {
//   User.findByIdAndUpdate(req.params.userId, {}


  
//   Country.findOne({alpha2Code: req.body.alpha2Code})
//       .then((foundCountry) => {
//           if (foundCountry) {

//               User.findByIdAndUpdate(req.params.userId, {
//                   $addToSet: {countries_visited: foundCountry._id}
//               },
//               {new: true})
//               .then((updatedUser) => {
//                   return updatedUser.populate('countries_visited')
//                   })
//               .then((populated) => {
//                   return populated.populate('posts')
//               })
//               .then((second) => {
//                   res.json(second)
//               })
//               .catch((err) => {
//                   console.log(err)
//               })

//           } else {

//               let newCountry = {
//                   name: req.body.name,
//                   capital: req.body.capital,
//                   alpha2Code: req.body.alpha2Code,
//                   flag: req.body.flag,
//                   region: req.body.region,
//                   languages: req.body.languages,
//                   currency: req.body.currency
//               }


//               Country.create(newCountry)
//                   .then((createdCountry) => {
//                       return User.findByIdAndUpdate(
//                           {
//                               _id: req.params.userId
//                           }, 
//                           {
//                           $push: {countries_visited: createdCountry._id}
//                           },
//                           {new: true})
//                   })
//                   .then((updatedUser) => {
//                        return updatedUser.populate('countries_visited')
//                       })
//                   .then((populated) => {
//                       return populated.populate('posts')
//                   })
//                   .then((second) => {
//                       res.json(second)
//                   })
//                   .catch((err) => {
//                       console.log(err)
//                   })
//           }
//       })

// });


module.exports = router;
