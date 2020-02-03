
const development = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'wloh',
    password: process.env.DB_PASS || 'banana123',
    database: process.env.DB_DATABASE || 'classes',
}

const test = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'wloh',
    password: process.env.DB_PASS || 'banana123',
    database: process.env.DB_DATABASE || 'test',
}

module.exports = development