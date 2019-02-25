module.exports = function(sequelize, DataTypes) {
  var Name = sequelize.define("Name", {
    gender: {
      type: DataTypes.STRING(1)
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    count_alltime: {
      type: DataTypes.INTEGER
    },
    rank_alltime: {
      type: DataTypes.INTEGER
    },
    percentile_alltime: {
      type: DataTypes.INTEGER,
    },
    count_188x: {
      type: DataTypes.INTEGER,
    },
    count_201x: {
      type: DataTypes.INTEGER,
    },
    rank_188x: {
      type: DataTypes.INTEGER,
    },
    rank_201x: {
      type: DataTypes.INTEGER,
    },
    Percentile_188x: {
      type: DataTypes.DOUBLE,
    },
    Percentile_201x: {
      type: DataTypes.DOUBLE,
    }
  });
  return Name;
};
//this is the user's model!
