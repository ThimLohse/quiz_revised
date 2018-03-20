// The question model, for comunication with the question table

module.exports = function(sequelize, DataType) {
	var Questions  = sequelize.define('questions', {
		quizId: {
			type: DataType.INTEGER,
			allowNull: false
		},
		question: {
			type: DataType.STRING,
			allowNull: false
		},
		alt1: {
			type: DataType.STRING,
			allowNull: false
		},
		alt2: {
			type: DataType.STRING,
			allowNull: false
		},
		alt3: {
			type: DataType.STRING,
			allowNull: false
		},
		corect: {
			type: DataType.STRING,
			allowNull: false
		}
	});
	return Questions;
}