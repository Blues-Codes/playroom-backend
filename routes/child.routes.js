var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const MidGuard = require('../middleware/midGuard')
const Parent = require('../models/Parent.model')
const Child = require('../models/Child.model')
const Updates = require('../models/Update.model')


router.get("/verify", MidGuard, (req, res) => {
    Parent.findOne({_id: req.user._id})
    // .populate('childName')
    // .populate('gamesPlayed')
  
    .then((foundParent) => {
  
      const payload = { ...foundParent };
      console.log("this is the payload", payload, foundParent)
      delete payload._doc.password;
      res.status(200).json(payload._doc);
      
    })
    .catch((err) => {
      console.log(err)
    })
  });

  router.post("/childLogin", (req, res, next) => {
    console.log(req.body.text)
    // if (!req.body.text ) {
    //     console.log('Hi there')
    //     return res.status(401).json({ message: "Have your parents signup!" });
     
    // }
  
    Child.findOne({ name: req.body.text.toLowerCase()})
      .then((foundChild) => {
        console.log(foundChild)
        return  Parent.findById({ _id:foundChild.parent}) 
        .then((foundParent) =>{
            console.log(foundParent)
            if (String(foundChild.parent) === String(foundParent._id)){
                console.log(true)
                const payload = { _id: foundChild._id,  name: foundChild.name, };
                console.log(payload)
                const token = jwt.sign(payload, process.env.SECRET, {
                  algorithm: "HS256",
                  expiresIn: "24hr",

                });
                console.log(token)
                res.json({ _id: foundChild._id, token: token, message: `Welcome ${foundChild.name}` });
            }

        })
        // if (!foundParent) {
        //   return res.status(401).json({ message: "Have your parents signup!" });
        // }
        // console.log('hi there')
  
        // const doesMatch = bcrypt.compareSync(
        //   req.body.password,
        //   foundParent.password
        // );
  
        // if (doesMatch) {
        //   const payload = { _id: foundParent._id, email: foundParent.email, name: foundParent.name, city: foundParent.city, childName: foundParent.childName, childAge: foundParent.childAge, relation: foundParent.relation };
  
        //   const token = jwt.sign(payload, process.env.SECRET, {
        //     algorithm: "HS256",
        //     expiresIn: "24hr",
        //   });
        //   console.log("doesmatch", payload)
        //   return res.json({ _id: foundParent._id, token: token, message: `Welcome ${foundParent.childName}` });
        // } else {
        //   return res.status(402).json({ message: "Email or Password is incorrect" });
        // }
      })
      .catch((err) => {
       console.log(err);
      });
  });
  

module.exports = router;