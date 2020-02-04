const { serverError, invalidInput } = require('../config/config')

const runInvalidInputResponse = (res) => {
    res.status(invalidInput.num).json({ status: invalidInput.num, response: invalidInput.message1})
  }
  
const databaseQueryError = (res) => {
    res.status(serverError.num).json({ status: serverError.num, message: serverError.message })
}

module.exports = {
    runInvalidInputResponse,
    databaseQueryError,
}
