// *****************************************************************************
// **** api-routes.js - this file offers a set of routes for displaying and
// saving data to the db
// ******************************************************************************
// *** Dependencies

// Requiring our models
var db = require("../models");

var Sequelize = require("sequelize");
const { and, or, like, notLike, between } = Sequelize.Op;

// Routes =============================================================
module.exports = function(app) {
  // POST route for getting the name
  app.post("/name", function(req, res) {
    db.Name.findAll({
      where: {
        Name: req.body.name,
        Gender: req.body.gender
      },
      attributes: {
        include: [
          "Name",
          "Gender",
          "Count_AllTime",
          "Rank_AllTime",
          "Count_188x",
          "Count_189x",
          "Count_190x",
          "Count_191x",
          "Count_192x",
          "Count_193x",
          "Count_194x",
          "Count_195x",
          "Count_196x",
          "Count_197x",
          "Count_198x",
          "Count_199x",
          "Count_200x",
          "Count_201x",
          "Rank_188x",
          "Rank_189x",
          "Rank_190x",
          "Rank_191x",
          "Rank_192x",
          "Rank_193x",
          "Rank_194x",
          "Rank_195x",
          "Rank_196x",
          "Rank_197x",
          "Rank_198x",
          "Rank_199x",
          "Rank_200x",
          "Rank_201x"
        ]
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
      if (req.body.letters[i].$like) {
        letters.push({ [like]: req.body.letters[i].$like });
      }
      else {
        letters.push({ [notLike]: req.body.letters[i].$notlike.replace("!", "") });
      }
    }
    let whereObj = {
      Name: {
        [and]: letters
      },
      Gender: {
        [or]: req.body.gender
      },
      where: {
        [and]: [
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("Name")),
            ">=",
            req.body.min
          ),
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("Name")),
            "<=",
            req.body.max
          )
        ]
      }
    };
    for (let i = 0; i < req.body.numbers.length; i++) {
      let key = Object.keys(req.body.numbers[i])[0];
      let value = Object.values(req.body.numbers[i])[0];
      let secondval = Object.values(value)[0];
      whereObj[key] = { [between]: secondval };
    }
    let sort = req.body.sort;
    if (req.body.sort[0][0] === "RAND") {
      sort = Sequelize.fn("RAND", req.body.sort[0][1]);
    }
    db.Name.findAndCountAll({
      where: whereObj,
      limit: req.body.limit,
      order: sort
      //}).sort(sortQuery)
    })
      .then(result => {
        res.json({ count: result.count, rows: result.rows });
      })
      .catch(err => res.status(422).json(err));
  });
};
