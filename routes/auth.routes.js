require ('dotenv').config()

var express = require("express");
var router = express.Router();

const Parent = require("../models/Parent.model");
const Child = require('../models/Child.model')


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const MidGuard = require('../middleware/midGuard')


router.post("/signup", async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out all fields" });
  }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

      const createdParent =
        await Parent.create({
          password: hashedPass,
          email: req.body.email,
          name: req.body.name,
          city: req.body.city,
          childName: req.body.childName,
          childAge: req.body.childAge,
          relation: req.body.relation

        })
          .then((createdParent) => {
             Child.create({ name:createdParent.childName, age: createdParent.childAge, parent: createdParent._id })
             .then((createdChild) => {
              const payload = { _id: createdParent._id, email: createdParent.email, name: createdParent.name };              console.log(payload)
             const token = jwt.sign(payload, process.env.SECRET, {
               algorithm: "HS256",
               expiresIn: "24hr",
             });
             res.json({ token: token, createdParent: createdParent, message: `Welcome ${createdParent.name}`  });
 
             }) 
             .catch((err) => {
              res.status(201).json({ message: "Parent and child accounts created" });
              console.log(err)
             })
          
 
          })
            // res.status(201).json({ message: "Parent and child accounts created" });
        // }) 
        //     .catch ((err) => {
        //       res.json(err.message);
            });


router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out both fields" });
  }

  Parent.findOne({ email: req.body.email })
    .then((foundParent) => {
      if (!foundParent) {
        return res.status(401).json({ message: "Email or Password is incorrect!!!" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundParent.password
      );

      if (doesMatch) {
        const payload = { _id: foundParent._id, email: foundParent.email, name: foundParent.name, city: foundParent.city, childName: foundParent.childName, childAge: foundParent.childAge, relation: foundParent.relation };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        console.log("doesmatch", payload)
        return res.json({ _id: foundParent._id, token: token, message: `Welcome ${foundParent.name}` });
      } else {
        return res.status(402).json({ message: "Email or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//VERIFY ALREADY CREATED USER

router.get("/verify", MidGuard, (req, res) => {
  // .populate('childName')
  // .populate('gamesPlayed')
  
  Parent.findOne({_id: req.user._id})
  .then((foundParent) => {
console.log(foundParent)
    const payload = { ...foundParent };
    console.log("this is the payload", payload, foundParent)
    delete payload._doc.password;
    res.status(200).json(payload._doc);
    
  })
  .catch((err) => {
    console.log(err)
  })
});


module.exports = router;