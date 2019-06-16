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

  // POST route for getting the name
  app.post("/name", function(req, res) {
    db.Name.findAll({
      where: {
        Name: req.body.name,
        Gender: req.body.gender
      },
      attributes: {
        include: ["Name", "Gender", "Count_AllTime", "Percentile_AllTime", "Rank_AllTime", "Count_188x", "Count_189x", "Count_190x", "Count_191x", "Count_192x", "Count_193x", "Count_194x", "Count_195x", "Count_196x", "Count_197x", "Count_198x", "Count_199x", "Count_200x", "Count_201x", "Percentile_188x", "Percentile_189x", "Percentile_190x", "Percentile_191x", "Percentile_192x", "Percentile_193x", "Percentile_194x", "Percentile_195x", "Percentile_196x", "Percentile_197x", "Percentile_198x", "Percentile_199x", "Percentile_200x", "Percentile_201x", "Rank_188x", "Rank_189x", "Rank_190x", "Rank_191x", "Rank_192x", "Rank_193x", "Rank_194x", "Rank_195x", "Rank_196x", "Rank_197x", "Rank_198x", "Rank_199x", "Rank_200x", "Rank_201x"]
      }
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => res.status(422).json(err));
  });

  // POST route for getting the names
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
