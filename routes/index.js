var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// database model
var Form = require("../models/model.js");

router.get('/checkStatus', function(req, res) {
  var jsonData = {
    "name": "Node Express API Boilerplate",
    "API Status": "OK"
  }
  res.json(jsonData);
});

router.get("/", function(req,res) {
  res.render("index.html");
})

// corresponds with <form action="/api/create"> in index.html
router.post('/api/create', function(req, res) {
    console.log(req.body);
    var date = req.body.date;
    var copy = req.body.copy;
    var paste = req.body.paste;
    var successfulCopyPaste = req.body.successfulCopyPaste;

    // hold all this data in an object
    // this object should be structured the same way as your database model
    var formObj = {
      date: date,
      copy: copy,
      paste: paste,
      successfulCopyPaste: successfulCopyPaste
    };

    // create a new form model instance, passing in the object
    var form = new Form(formObj);
    // now, save that form instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    form.save(function(err,data) {
      // if err saving, respond back with error
      if (err) {
        var error = {
          status: "Error!",
          message: "Error saving form!"};
        return res.json(error);
      }
      console.log("Saved new formEntry to MongoDB!");
      console.log(data);
      return res.redirect('/');
    })
});

// get the data from database and render to index.html page via main.js
router.get('/api/get', function(req, res) {
  // see http://mongoosejs.com/docs/api.html#model_Model.find
  Form.find(function(err, data){
    // if err or no formEntry found, respond with error
    if (err || data == null) {
      var error = {
        status: "Error!",
        message: "Could not find the formEntry!"
      };
      return res.json(error);
    }
    // otherwise, respond with the data
    var dataJSON = {
      status: "OK",
      formEntry: data
    }
    res.json(dataJSON);
  })
})

// delete route
router.get('/api/delete/:id', function(req, res) {
  var requestedId = req.params.id;
  // see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Form.findByIdAndRemove(requestedId,function(err, data) {
    if (err || data == null) {
      var error = {
        status: "Error!",
        message: "Could not find the formEntry to delete!"
      };
      return res.json(error);
    }
    // otherwise, respond back with success
    var dataJSON = {
      status: "OK",
      message: "Successfully deleted: " + requestedId
    }
    console.log(dataJSON);
    return res.redirect('/');
  })
})

module.exports = router;
