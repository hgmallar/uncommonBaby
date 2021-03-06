// *****************************************************************************
// **** api-routes.js - this file offers a set of routes for displaying and
// saving data to the db
// ******************************************************************************
// *** Dependencies

// Requiring our models
var db = require("../models");

const { Sequelize } = require("sequelize");

const { Op } = require("sequelize");

var nodemailer = require("nodemailer");

var transport = {
  host: "smtp.gmail.com", // hostname
  port: 587, // port for secure SMTP
  secure: false,
  auth: {
    user: process.env.REACT_APP_THE_EMAIL,
    pass: process.env.REACT_APP_THE_PASSWORD,
  },
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

// Routes =============================================================
module.exports = function (app) {
  // POST route for getting the name
  app.post("/name", function (req, res) {
    db.Name.findAll({
      where: {
        Name: req.body.name,
        Gender: req.body.gender,
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
          "Rank_201x",
        ],
      },
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => res.status(422).json(err));
  });

  app.get("/api/name", function (req, res) {
    db.Name.findAll({
      where: {
        Name: "Hilary",
        Gender: "F",
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
          "Rank_201x",
        ],
      },
    })
      .then((result) => {
        return res.json(result);
      })
      .catch((err) => res.status(422).json(err));
  });

  // GET route for getting a name
  app.get("/api/name/:name/:gender", function (req, res) {
    db.Name.findAll({
      where: {
        Name: req.params.name,
        Gender: req.params.gender,
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
          "Rank_201x",
        ],
      },
    })
      .then((result) => {
        return res.json(result);
      })
      .catch((err) => res.status(422).json(err));
  });

  // GET route for getting the names
  app.get(
    "/api/names/:min/:max/:gender/:sort/:lettersArr/:numbersArr/:offset/:limit",
    function (req, res) {
      let genderArr = [];
      if (req.params.gender === "MF") {
        genderArr = ["M", "F"];
      } else {
        genderArr = [req.params.gender];
      }
      sort = [req.params.sort.split(",")];
      if (sort[0][0] === "RAND") {
        sort = Sequelize.fn("RAND", sort[0][1]);
      }
      let letters = [];
      let letterArr = req.params.lettersArr.split(",");
      for (let i = 0; i < letterArr.length; i++) {
        if (letterArr[i].includes("!")) {
          let newString = letterArr[i].replace("!", "");
          letters.push({
            [Op.notLike]: newString,
          });
        } else {
          letters.push({ [Op.like]: letterArr[i] });
        }
      }
      let whereObj = {
        Name: {
          [Op.and]: letters,
        },
        Gender: {
          [Op.or]: genderArr,
        },
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("char_length", Sequelize.col("Name")),
              ">=",
              req.params.min
            ),
            Sequelize.where(
              Sequelize.fn("char_length", Sequelize.col("Name")),
              "<=",
              req.params.max
            ),
          ],
        },
      };
      let numberArr = req.params.numbersArr.split(",");
      for (let i = 0; i < numberArr.length; i += 2) {
        let key = numberArr[i];
        let value = numberArr[i + 1].split("_");
        for (let j = 0; j < value.length; j++) {
          value[j] = parseInt(value[j]);
        }
        whereObj[key] = { [Op.between]: value };
      }
      db.Name.findAndCountAll({
        where: whereObj,
        attributes: ["id", "Name", "Gender"],
        offset: parseInt(req.params.offset),
        limit: parseInt(req.params.limit),
        order: sort,
      })
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => res.status(422).json(err));
    }
  );

  // POST route for getting the names
  app.post("/names", function (req, res) {
    let letters = [];
    for (let i = 0; i < req.body.letters.length; i++) {
      if (req.body.letters[i].$like) {
        letters.push({ [Op.like]: req.body.letters[i].$like });
      } else {
        letters.push({
          [Op.notLike]: req.body.letters[i].$notlike.replace("!", ""),
        });
      }
    }
    let whereObj = {
      Name: {
        [Op.and]: letters,
      },
      Gender: {
        [Op.or]: req.body.gender,
      },
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("Name")),
            ">=",
            req.body.min
          ),
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("Name")),
            "<=",
            req.body.max
          ),
        ],
      },
    };
    for (let i = 0; i < req.body.numbers.length; i++) {
      let key = Object.keys(req.body.numbers[i])[0];
      let value = Object.values(req.body.numbers[i])[0];
      let secondval = Object.values(value)[0];
      whereObj[key] = { [Op.between]: secondval };
    }
    let sort = req.body.sort;
    if (req.body.sort[0][0] === "RAND") {
      sort = Sequelize.fn("RAND", req.body.sort[0][1]);
    }
    db.Name.findAndCountAll({
      where: whereObj,
      attributes: ["id", "Name", "Gender"],
      limit: req.body.limit,
      order: sort,
      //}).sort(sortQuery)
    })
      .then((result) => {
        res.json({ count: result.count, rows: result.rows });
      })
      .catch((err) => res.status(422).json(err));
  });

  // POST route for contacting
  app.post("/api/send", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var reason = req.body.reason;
    var message = req.body.comments;
    var content = `name: ${name} \nemail: ${email} \nreason: ${reason} \nmessage: ${message} `;

    var mail = {
      from: email,
      to: process.env.REACT_APP_THE_EMAIL, //Change to email address that you want to receive messages on
      subject: "New Message from Contact Form",
      text: content,
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          msg: "fail",
        });
      } else {
        res.json({
          msg: "success",
        });
      }
    });
  });
};
