"use strict";
module.exports = (sequelize, DataTypes) => {
  var Contribution = sequelize.define("Contribution", {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    contributorId: {
      type: DataTypes.INTEGER
    }
  });

  Contribution.associate = function(models) {
    // Contribution belongTo user
    Contribution.belongsTo(models.User);
  };
  return Contribution;
};
