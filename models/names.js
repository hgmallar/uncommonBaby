module.exports = function(sequelize, DataTypes) {
  var Name = sequelize.define("Name", {
    Gender: {
      type: DataTypes.STRING(1)
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
    Percentile_AllTime: {
      type: DataTypes.INTEGER,
    },
    Count_188x: {
      type: DataTypes.INTEGER,
    },
    Count_201x: {
      type: DataTypes.INTEGER,
    },
    Rank_188x: {
      type: DataTypes.INTEGER,
    },
    Rank_201x: {
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
