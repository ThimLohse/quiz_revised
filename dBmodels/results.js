// The results model, for comunication with the results table

module.exports = function(sequelize, DataType) {
	var Results = sequelize.define('results', {
		userId: {
			type: DataType.STRING,
			allowNull: false
		},
		points: {
			type: DataType.INTEGER,
			allowNull: false
		}
	});
	return Results;
}
