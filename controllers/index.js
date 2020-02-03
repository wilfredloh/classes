const dbConfig = require('../dbConfig'); //↑ exports = {user, password, host, databse}
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const getTeachers = async (req, res) => {
  try {
    const conn = await connection(dbConfig)
    const results = await query(conn, 'SELECT * FROM teachers')
    res.status(200).json({ status: 200, error: null, teachers: results });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, response: 'Query error!' })
  }
}
  
const getStudents = async (req, res) => {
  try {
    const conn = await connection(dbConfig)
    const results = await query(conn, 'SELECT * FROM students')
    res.status(200).json({ status:200, error: null, students: results });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, response: 'Query error!' })
  }
}

const getRegistrations = async (req, res) => {
  try {
    const conn = await connection(dbConfig)
    const results = await query(conn, 'SELECT * FROM registrations')
    res.status(200).json({ status:200, error: null, registrations: results });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, response: 'Query error!' })
  }
}

const getCommonStudents = async (req, res) => {
  try {
    let teachers = req.query.teacher
    if (!teachers) res.json({ status: 500, error: true, response: 'Select all fields!'})
    let sql = 'SELECT students.email FROM students INNER JOIN registrations ON registrations.student_id = students.id INNER JOIN teachers ON registrations.teacher_id = teachers.id WHERE teachers.email ='
    if (Array.isArray(teachers)) {
      q = `${sql} "${teachers[0]}"`
      q += teachers.slice(1).map(x => {
        return `AND students.email IN (${sql} "${x}")`
      })
      q = q.replace(/,/g, "")
    } else q = `${sql} "${teachers}"`
    const conn = await connection(dbConfig) 
    const results = await query(conn, q, [teachers])
    res.status(200).json({ status:200, error: null, commonStudents: results });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 500, message: error.message, response: 'Query error!' })
  }
}

const registerStudents = async (req, res) => {
  try {
    const teacher = req.body.teacher
    const student = req.body.student
    if (!teacher || !student) res.json({ status: 500, error: true, response: 'Select all fields!'})
    let registrations = Array.isArray(student) ? student.map(s => [teacher, s] ) : [[teacher,student]]
    const conn = await connection(dbConfig)
    let sql = `INSERT INTO registrations (teacher_id, student_id) VALUES ?`
    const results = await query(conn, sql, [registrations])
    res.json({ status:204, error: null, response: 'student(s) added to teacher!' });
  } catch (error) {
    res.status(500).json({ status:500, message: error.message, response: 'Cannot register students!' })
  }
}

const suspendStudent = async (req, res) => {
  try {
    const studentID = req.body.student
    if (!studentID) res.json({ status: 500, error: true, response: 'Select a student!'})
    // refactor to say already suspended
    const conn = await connection(dbConfig).catch(e => {}) 
    const results = await query(conn, 
      `UPDATE students SET suspended=true WHERE id = ?;`, [studentID])
    res.json({ status:204, error: null, response: 'student suspended!' });
  } catch (error) {
    res.status(500).json({ status:500, message: error.message, response: 'Cannot suspend students!' })
  }
}

const notifyStudents = async (req, res) => {

  try {
    const request = { teacher: req.body.teacher, notification: req.body.notification }
    if (!req.body.teacher) res.json({ status: 500, error: error.message, response: 'Select a teacher!'})
    const conn = await connection(dbConfig)
    const students = request.notification.split(' ').map(x => { if (x[0] === '@') return x.substring(1) })
    const suspended = false
  
    // get teacher id from email
    const teacherIDResult = await query(conn, `SELECT id FROM teachers WHERE email = (?)`,[request.teacher]).catch(console.log);
    if (!teacherIDResult) res.json({ status:500, error: null, response: 'Cannot get teacher!' })
    const teacherID = teacherIDResult[0].id
    if (!teacherID) res.json({ status:500, error: null, response: 'Cannot get teacher ID!' })
  
    // get all students from current teacher & not suspended
    const results = await query(conn, 
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
    res.status(200).json({ status:200, error: null, students: results.length ? results : `All students suspended!` });
  } catch (error) {
    res.status(500).json({ status:500, message: error.message, response: 'Cannot notify students!' })
  }
} 

const showHome = async (req, res) => {
  try {
    const log = { teachers: '', students: '', registrations: '' }
    const conn = await connection(dbConfig)
    const teachers = await query(conn, 'SELECT * FROM teachers')
    const students = await query(conn, 'SELECT * FROM students')
    const registrations = await query(conn, 'SELECT * FROM registrations')
    log.teachers = teachers || 'teachers error'
    log.students = students || 'students error'
    log.registrations = registrations || 'registrations error'
    res.render('index', {log})
  } catch (error) {
    res.status(500).json({ status:500, message: error.message, response: 'Query error!' })
  }
}

module.exports = {
  getTeachers,
  getStudents,
  getRegistrations,
  getCommonStudents,
  registerStudents,
  suspendStudent,
  notifyStudents,
  showHome,
}
