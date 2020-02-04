const connection = require('../helpers/connection');
const query = require('../helpers/query');
const seed = require('../db/data.js')

const getTeachers = async () => {
    try{
        const conn = await connection()
        const results = await query(conn, 'SELECT * FROM teachers')
        return results
    } catch (error) {
        console.log('Error in Models, getTeachers()', error.message)
        return error
    }
}

const getStudents = async () => {
    try{
        const conn = await connection()
        const results = await query(conn, 'SELECT * FROM students')
        return results
    } catch (error) {
        console.log('Error in Models, getStudents()', error.message)
        return error
    }
}

const getRegistrations = async () => {
    try{
        const conn = await connection()
        const results = await query(conn, 'SELECT * FROM registrations')
        return results
    } catch (error) {
        console.log('Error in Models, getRegistrations()', error.message)
        return error
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
      const results = await query(conn, q, [teachers])
      return results
    } catch (error) {
        console.log('Error in Models, getCommonStudents()', error.message)
        return error
    }
  }

const registerStudents = async (registrations) => {
    try {
        const conn = await connection()
        let sql = `INSERT INTO registrations (teacher_id, student_id) VALUES ?`
        const results = await query(conn, sql, [registrations])
        return results
    } catch (error) {
        console.log('Error in Models, registerStudents()', error.message)
        return error
    }
}

const suspendStudent = async (studentID) => {
    try {
      // refactor to say already suspended
      const conn = await connection()
      const results = await query(conn, `UPDATE students SET suspended=true WHERE id = ?;`, [studentID])
      console.log(results)
      return results
    } catch (error) {
        console.log('Error in Models, suspendStudent()', error.message)
        return error
    }
  }

const getTeacherIDFromEmail = async(email) => {
    const conn = await connection()
    const teacherIDResult = await query(conn, `SELECT id FROM teachers WHERE email = (?)`,[email])
    return teacherIDResult
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
        return error
    }
} 

const refreshDatabase = async () => {
    try {
        const conn = await connection()
        seed.forEach( async x => {
            await query(conn, x)
        })
        return
      } catch (error) {
          return error
      }
}


module.exports = {
    getTeachers,
    getStudents,
    getTeacherIDFromEmail,
    getRegistrations,
    getCommonStudents,
    registerStudents,
    suspendStudent,
    notifyStudents,
    refreshDatabase,
}