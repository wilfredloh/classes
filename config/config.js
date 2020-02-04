const statusCodes = {
    ok: {
        num: 200,
        message: 'Success'
    },
    noContent: {
        num: 204,
        message: 'Action completed'
    },
    invalidInput: {
        num: 422,
        message1: 'Select all required fields',
        message2: 'Invalid input',
    },
    serverError: {
        num: 500,
        message: 'Query to database failed'
    }
}

Object.freeze(statusCodes)

module.exports = statusCodes