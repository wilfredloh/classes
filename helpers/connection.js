const dbConfig = require('../dbConfig'); //↑ exports = {user, password, host, databse}
const mysql = require('mysql');

module.exports = async (params = dbConfig) => new Promise(
(resolve, reject) => {
	const connection = mysql.createConnection(params);
  connection.connect(error => {
	  if (error) {
      reject(error);
      return;
    }
    resolve(connection);
  })
});