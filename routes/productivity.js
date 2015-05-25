var express = require('express'),
  router = express.Router(),
  Productivity = require('../models/productivity').Productivity
;

function find(search, callback) {
  if(/[a-f0-9]{24}/.test(search)) {
    Productivity.findById(search, callback);
  } else {
    Productivity.findOne({ name: { $regex: new RegExp(search, "i") } }, callback);
  }
}

// READ All
router.get('/', function(req, res) {
  Productivity.find({}, function(err, docs) {
    if(err) {
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ productivities: docs });
    }
  });
});

// READ by ID
router.get('/:id', function(req, res) {
  find(req.params.id, function(err, doc) {
    if(err) {
      res.status(500).json({ message: "Error loading Productivity." + err});
    } else if(!doc) {
      res.status(404).json({ message: "Productivity not found."});
    } else {
      res.status(200).json(doc);
    }
  });
});
  
// CREATE
router.post('/', function(req, res) {
  var rating = req.body.rating;
  var name = req.body.name;
  var description = req.body.description;
  find(name, function(err, doc) {
    if(err) {
      res.status(500).json({message: err});
    } else if(doc) {
      res.status(403).json({message: "Productivity with that name already exists."});
    } else {
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
    }
  });
});

// UPDATE
router.put('/', function(req, res) {
  var id = req.body.id;
  var rating = req.body.rating;
  var name = req.body.name;
  var description = req.body.description;
  find(id, function(err, doc) {
    if(err) {
      res.status(500).json({message: "Could not update Productivity: " + err});
    } else if(!doc) {
      res.status(404).json({message: "Could not find Productivity: " + id});
    } else {
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
    }
  });
});

// DELETE
router.delete('/:id', function(req, res) {
  function found(err, rem) {
    if(err) {
      res.status(403).json({ message: "Error loading Productivity." + err});
    } else if(rem.result.n == 0) {
      res.status(404).json({ message: "Productivity not found."});
    } else {
      res.status(200).json("Productivity removed: " + rem.result.n);
    }
  }
  var id = req.params.id; // The id or name of the Productivity object
  if(/[a-f0-9]{24}/.test(id)) {
    Productivity.findAndRemove(id, found);
  } else {
    Productivity.remove({ name: { $regex: new RegExp(id, "i") } }, found);
  }
});

module.exports = router;

