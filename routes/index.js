// *****************************************************************************
// **** api-routes.js - this file offers a set of routes for displaying and
// saving data to the db
// ******************************************************************************
// *** Dependencies

// Requiring our models
var db = require("../models");

// Routes =============================================================
module.exports = function (app) {

  // GET route for getting all of the results
  app.get("/", function (req, res) {
     //get all of the burgers in sorted alphabetically by name
  //   db.Burger.findAll({
  //     order: [
  //       ['burger_name', 'ASC'],
  //     ],
  //     include: [db.Eater]
  //   }).then(function (dbBurger) {
  //     res.render("index", { burgers: dbBurger });
  //   });
  });

};