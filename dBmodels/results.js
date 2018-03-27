// The results model, for comunication with the results table

module.exports = function(sequelize, DataType) {
	var Results = sequelize.define('results', {
		quizId: {
			type: DataType.STRING,
			allowNull: false
		},
		userId: {
			type: DataType.STRING,
			allowNull: false
		},
		points: {
			type: DataType.DOUBLE,
			allowNull: false
		}
	});
	return Results;
}
