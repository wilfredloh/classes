const connection = require('../helpers/connection');
const query = require('../helpers/query');
const seed = require('../db/data')
const { logErrorMessageModel } = require('../helpers/validation')

const getTeachers = async () => {
    try{
        const conn = await connection()
        return await query(conn, 'SELECT * FROM teachers')
    } catch (error) {
        logErrorMessageModel('getTeachers', error)
        throw error
    }
}

const getStudents = async () => {
    try{
        const conn = await connection()
        return await query(conn, 'SELECT * FROM students')
    } catch (error) {
        logErrorMessageModel('getStudents', error)
        throw error
    }
}

const getRegistrations = async () => {
    try{
        const conn = await connection()
        return await query(conn, 'SELECT * FROM registrations')
    } catch (error) {
        logErrorMessageModel('getRegistrations', error)
        throw error
    }
}

const getCommonStudents = async (teachers) => {
    try {
      let sql = 'SELECT students.email FROM students INNER JOIN registrations ON registrations.student_id = students.id INNER JOIN teachers ON registrations.teacher_id = teachers.id WHERE teachers.email ='
      if (Array.isArray(teachers)) {
        q = `${sql} "${teachers[0]}"`
        q += teachers.slice(1).map(x => {
          return `AND students.email IN (${sql} "${x}")`
        })
        q = q.replace(/,/g, "")
      } else q = `${sql} "${teachers}"`
      const conn = await connection() 
      return await query(conn, q, [teachers])
    } catch (error) {
        logErrorMessageModel('getCommonStudents', error)
        throw error
    }
}

const registerStudents = async (registrations) => {
    try {
        const conn = await connection()
        let sql = `INSERT INTO registrations (teacher_id, student_id) VALUES ?`
        return await query(conn, sql, [registrations])
    } catch (error) {
        logErrorMessageModel('registerStudents', error)
        throw error
    }
}

const suspendStudent = async (studentID) => {
    try {
      const conn = await connection()
      return await query(conn, `UPDATE students SET suspended=true WHERE id = ?;`, [studentID])
    } catch (error) {
        logErrorMessageModel('suspendStudent', error)
        throw error
    }
}

const getTeacherIDFromEmail = async(email) => {
    try {
        const conn = await connection()
        return await query(conn, `SELECT id FROM teachers WHERE email = (?)`,[email])
    } catch (error) {
        logErrorMessageModel('getTeacherIDFromEmail', error)
        throw error
    }
}

const getValidTeacherEmails = async(teachers) => {
    try {
        const conn = await connection()
        let sql = `SELECT email FROM teachers WHERE email in (?)`
        return await query(conn, sql,[teachers])
    } catch (error) {
        logErrorMessageModel('getValidTeacherEmails', error)
        throw error
    }
}

const notifyStudents = async (teacherID, students, suspended) => {
    try {
        const conn = await connection()
        return await query(conn, 
        `SELECT students.email FROM teachers 
        INNER JOIN registrations 
        ON teachers.id = registrations.teacher_id 
        INNER JOIN students 
        ON students.id = registrations.student_id 
        WHERE teachers.id = ? 
        AND students.suspended = ? 
        UNION 
        SELECT email FROM students 
        WHERE suspended = false AND email IN (?);`
        ,[teacherID, suspended, students])
    } catch (error) {
        logErrorMessageModel('notifyStudents', error)
        throw error
    }
} 

const refreshDatabase = async () => {
    try {
        const conn = await connection()
        seed.forEach( async sqlQuery => {
            await query(conn, sqlQuery)
        })
        return
      } catch (error) {
        logErrorMessageModel('refreshDatabase', error)
        throw error
      }
}

module.exports = {
    getTeachers,
    getStudents,
    getTeacherIDFromEmail,
    getValidTeacherEmails,
    getRegistrations,
    getCommonStudents,
    registerStudents,
    suspendStudent,
    notifyStudents,
    refreshDatabase,
}

