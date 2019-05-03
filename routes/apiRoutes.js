// *****************************************************************************
// **** api-routes.js - this file offers a set of routes for displaying and
// saving data to the db
// ******************************************************************************
// *** Dependencies

// Requiring our models
var db = require("../models");

var Sequelize = require("sequelize");
const { and, or, like, between } = Sequelize.Op;

// Routes =============================================================
module.exports = function(app) {
  // GET route for getting the endpoints of the slider
  app.get("/count/:col", function(req, res) {
    db.Name.max(req.params.col)
      .then(max => res.json(max))
      .catch(err => res.status(422).json(err));
  });

  // GET route for getting the endpoints of the slider
  app.get("/count/:col/:gender", function(req, res) {
    db.Name.max(req.params.col, { where: { Gender: req.params.gender } })
      .then(max => res.json(max))
      .catch(err => res.status(422).json(err));
  });

  // GET route for getting the names
  app.post("/names", function(req, res) {
    let letters = [];
    for (let i = 0; i < req.body.letters.length; i++) {
      letters.push({ [like]: req.body.letters[i].$like });
    }
    let whereObj = {
      Name: {
        [and]: letters
      },
      Gender: {
        [or]: req.body.gender
      }
    };
    let numbers = [];
    for (let i = 0; i < req.body.numbers.length; i++) {
      let key = Object.keys(req.body.numbers[i])[0];
      let value = Object.values(req.body.numbers[i])[0];
      let secondval = Object.values(value)[0];
      whereObj[key] = { [between]: secondval };
    }
    db.Name.findAndCountAll({
      where: whereObj,
      limit: req.body.limit,
      order: req.body.sort
      //}).sort(sortQuery)
    })
      .then(result => {
        res.json({ count: result.count, rows: result.rows });
      })
      .catch(err => res.status(422).json(err));
  });
};
