// The results model, for comunication with the results table

module.exports = function(sequelize, DataType) {
	var Results = sequelize.define('results', {
		quizId: {
			type: DataType.INTEGER,
			allowNull: false
		},
		userId: {
			type: DataType.INTEGER,
			allowNull: false
		},
		points: {
			type: DataType.INTEGER,
			allowNull: false
		},
		date: {
			type: DataType.DATE,
			allowNull: false
		}
	});
	return Results;
}
