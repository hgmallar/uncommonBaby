// *****************************************************************************
// **** api-routes.js - this file offers a set of routes for displaying and
// saving data to the db
// ******************************************************************************
// *** Dependencies

// Requiring our models
var db = require("../models");

// Routes =============================================================
module.exports = function (app) {

  // GET route for getting the endpoints of the slider
  app.get("/count/:col", function (req, res) {
    db.Name
      .max(req.params.col)
      .then(max => res.json(max))
      .catch(err => res.status(422).json(err));
  });

  // GET route for getting the names
  app.post("/names", function (req, res) {
    console.log(req.body);
    db.Name
      .findAll({
        where: {
          Name: {
            $and: req.body.letters
          },
          Gender: req.body.gender
        },
        limit: 10
      })
      .then(names => res.json(names))
      .catch(err => res.status(422).json(err));
  });

  //get all of the burgers in sorted alphabetically by name
  //   db.Burger.findAll({
  //     order: [
  //       ['burger_name', 'ASC'],
  //     ],
  //     include: [db.Eater]
  //   }).then(function (dbBurger) {
  //     res.render("index", { burgers: dbBurger });
  //   });

};