
module.exports = function(sequelize, Datatype){
	var Quiz = sequelize.define('quiz', {
		quizId: {
			type: Datatype.INTEGER,
			allowNull: false
		},
		name: {
			type: Datatype.STRING,
			allowNull: false
		},
		genre: {
			type: Datatype.STRING,
			allowNull: false
		},
		level: {
			type: Datatype.INTEGER,
			allowNull: false
		}
	});
	return Quiz;
}
