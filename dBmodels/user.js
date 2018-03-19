// The user model, used on the user table in the database

module.exports = function(sequelize, DataType) {
	var User = sequelize.define('user', {
		username: {
			type: DataType.STRING,
			notEmpty: true
		},
		password: {
			type: DataType.STRING,
			allowNull: false
		}
	});
	return User;
}