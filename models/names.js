module.exports = function(sequelize, DataTypes) {
  var Name = sequelize.define("Name", {
    Gender: {
      type: DataTypes.STRING(1),
    },
    Name: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    Count_AllTime: {
      type: DataTypes.INTEGER
    },
    Rank_AllTime: {
      type: DataTypes.INTEGER
    },
    Count_188x: {
      type: DataTypes.INTEGER,
    },
    Count_189x: {
      type: DataTypes.INTEGER,
    },
    Count_190x: {
      type: DataTypes.INTEGER,
    },
    Count_191x: {
      type: DataTypes.INTEGER,
    },
    Count_192x: {
      type: DataTypes.INTEGER,
    },
    Count_193x: {
      type: DataTypes.INTEGER,
    },
    Count_194x: {
      type: DataTypes.INTEGER,
    },
    Count_195x: {
      type: DataTypes.INTEGER,
    },
    Count_196x: {
      type: DataTypes.INTEGER,
    },
    Count_197x: {
      type: DataTypes.INTEGER,
    },
    Count_198x: {
      type: DataTypes.INTEGER,
    },
    Count_199x: {
      type: DataTypes.INTEGER,
    },
    Count_200x: {
      type: DataTypes.INTEGER,
    },
    Count_201x: {
      type: DataTypes.INTEGER,
    },
    Rank_188x: {
      type: DataTypes.INTEGER,
    },
    Rank_189x: {
      type: DataTypes.INTEGER,
    },
    Rank_190x: {
      type: DataTypes.INTEGER,
    },
    Rank_191x: {
      type: DataTypes.INTEGER,
    },
    Rank_192x: {
      type: DataTypes.INTEGER,
    },
    Rank_193x: {
      type: DataTypes.INTEGER,
    },
    Rank_194x: {
      type: DataTypes.INTEGER,
    },
    Rank_195x: {
      type: DataTypes.INTEGER,
    },
    Rank_196x: {
      type: DataTypes.INTEGER,
    },
    Rank_197x: {
      type: DataTypes.INTEGER,
    },
    Rank_198x: {
      type: DataTypes.INTEGER,
    },
    Rank_199x: {
      type: DataTypes.INTEGER,
    },
    Rank_200x: {
      type: DataTypes.INTEGER,
    },
    Rank_201x: {
      type: DataTypes.INTEGER,
    }
  }, {timestamps: false});
  return Name;
};
