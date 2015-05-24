var express = require('express'),
  router = express.Router(),
  Productivity = require('../models/productivity').Productivity
;

// READ All
router.get('/', function(req, res) {
  Productivity.find({}, function(err, docs) {
    if(!err) {
      res.status(200).json({ productivities: docs });
    } else {
      res.status(500).json({ message: err });
    }
  });
});

// READ by ID
router.get('/:id', function(req, res) {
  var id = req.params.id; // The id or name of the Productivity object
  function found(err, doc) {
    if(err) {
      res.status(500).json({ message: "Error loading Productivity." + err});
    } else if(!doc) {
      res.status(404).json({ message: "Productivity not found."});
    } else {
      res.status(200).json(doc);
    }
  }
  if(/[a-f0-9]{24}/.test(id)) {
    Productivity.findById(id, found);
  } else {
    Productivity.find({ name: { $regex: new RegExp(id, "i") } }, found);
  }
});
  
// CREATE
router.post('/', function(req, res) {
  var rating = req.body.rating;
  var name = req.body.name;
  var description = req.body.description;
  Productivity.findOne({ name: { $regex: new RegExp(name, "i") } }, function(err, doc) {
    if(!err && !doc) {
      var newProductivity = new Productivity();
      newProductivity.rating = rating;
      newProductivity.name = name;
      newProductivity.description = description;
      newProductivity.save(function(err) {
        if(!err) {
          res.status(201).json({message: "Productivity created with name: " + newProductivity.name });
        } else {
          res.status(500).json({message: "Could not create Productivity. Error: " + err});
        }
      });
    } else if(!err) {
      res.status(403).json({message: "Productivity with that name already exists."});
    } else {
      res.status(500).json({message: err});
    }
  });
});

// UPDATE
router.put('/', function(req, res) {
  var id = req.body.id;
  var rating = req.body.rating;
  var name = req.body.name;
  var description = req.body.description;
  Productivity.findById(id, function(err, doc) {
    if(!err && doc) {
      doc.rating = rating;
      doc.name = name;
      doc.description = description;
      doc.save(function(err) {
        if(!err) {
          res.status(200).json({message: "Productivity updated: " + name});
        } else {
          res.status(500).json({message: "Could not update Productivity: " + err});
        }
      });
    } else if(!err) {
      res.status(404).json({message: "Could not find Productivity: " + id});
    } else {
      res.status(500).json({message: "Could not update Productivity: " + err});
    }
  });
});

// DELETE
router.delete('/:id', function(req, res) {
  var id = req.params.id; // The id or name of the Productivity object
  function found(err, rem) {
    console.log(err);
    console.log(rem);
    if(err) {
      res.status(403).json({ message: "Error loading Productivity." + err});
    } else if(rem.result.n == 0) {
      res.status(404).json({ message: "Productivity not found."});
    } else {
      res.status(200).json("Productivity removed: " + rem.result.n);
    }
  }
  if(/[a-f0-9]{24}/.test(id)) {
    Productivity.findAndRemove(id, found);
  } else {
    Productivity.remove({ name: { $regex: new RegExp(id, "i") } }, found);
  }
});

module.exports = router;

