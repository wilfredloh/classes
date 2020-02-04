const models = require('../models')
const codes = require('../config/config')

const getTeachers = async (req, res) => {
  try {
    const results = await models.getTeachers()
    res.status(codes.ok).json({ status: codes.ok, teachers: results });
  } catch (error) {
    res.status(codes.serverError).json({ status: codes.serverError, message: 'Could not get data' })
  }
}
  
const getStudents = async (req, res) => {
  try {
    const results = await models.getStudents()
    res.status(codes.ok).json({ status:codes.ok, error: null, students: results });
  } catch (error) {
    res.status(codes.serverError).json({ status: codes.serverError, message: error.message, response: 'Query error!' })
  }
}

const getRegistrations = async (req, res) => {
  try {
    const results = await models.getRegistrations()
    res.status(codes.ok).json({ status:codes.ok, error: null, registrations: results });
  } catch (error) {
    res.status(codes.serverError).json({ status: codes.serverError, message: error.message, response: 'Query error!' })
  }
}

const getCommonStudents = async (req, res) => {
  try {
    let teachers = req.query.teacher
    if (!teachers) res.json({ status: codes.serverError, error: true, response: 'Select all fields!'})
    const results = await models.getCommonStudents(teachers)
    res.json({ status:codes.ok, error: null, commonStudents: results });
  } catch (error) {
    res.status(codes.serverError).json({ status: codes.serverError, message: error.message, response: 'Query error!' })
  }
}

const registerStudents = async (req, res) => {
  try {
    const teacher = req.body.teacher
    const student = req.body.student
    if (!teacher || !student) res.json({ status: 400, error: true, response: 'Select all fields!'})
    let registrations = Array.isArray(student) ? student.map(s => [teacher, s] ) : [[teacher,student]]
    const results = await models.registerStudents(registrations)
    res.status(codes.noContent).json({ status:codes.noContent, error: null, response: 'student(s) added to teacher!' });
  } catch (error) {
    res.status(codes.serverError).json({ status:codes.serverError, message: error.message, response: 'Cannot register students!' })
  }
}

const suspendStudent = async (req, res) => {
  try {
    const studentID = req.body.student
    if (!studentID) res.json({ status: codes.serverError, error: true, response: 'Select a student!'})
    const results = await models.suspendStudent(studentID)
    res.status(codes.noContent).json({ status:codes.noContent, error: null, response: 'student suspended!' });
  } catch (error) {
    res.status(codes.serverError).json({ status:codes.serverError, message: error.message, response: 'Cannot suspend students!' })
  }
}

const notifyStudents = async (req, res) => {
  try {
    const request = { teacher: req.body.teacher, notification: req.body.notification }
    if (!req.body.teacher) res.json({ status: codes.serverError, error: error.message, response: 'Select a teacher!'})
    const teacherIDResult = await models.getTeacherIDFromEmail(req.body.teacher)
    if (!teacherIDResult) res.json({ status:codes.serverError, error: null, response: 'Teacher ID query error!' })
    const teacherID = teacherIDResult[0].id
    if (!teacherID) res.json({ status:codes.serverError, error: null, response: 'Teacher does not exist!' })
    const students = request.notification.split(' ').map(x => { if (x[0] === '@') return x.substring(1) })
    const suspended = false
    const notifiedStudents = await models.notifyStudents(teacherID, students, suspended)
    res.status(codes.ok).json({ status:codes.ok, error: null, students: notifiedStudents.length ? notifiedStudents : `All students suspended!` });
  } catch (error) {
    res.status(codes.serverError).json({ status:codes.serverError, message: error.message, response: 'Cannot notify students!' })
  }
} 

const showHome = async (req, res) => {
  try {
    const log = { teachers: '', students: '', registrations: '' }
    const teachers = await models.getTeachers()
    const students = await models.getStudents()
    const registrations = await models.getRegistrations()
    log.teachers = teachers || 'teachers error'
    log.students = students || 'students error'
    log.registrations = registrations || 'registrations error'
    res.render('index', {log})
  } catch (error) {
    res.status(codes.serverError).json({ status:codes.serverError, message: error.message, response: 'Query error!' })
  }
}

const refresh = async (req, res) => {
  try {
    const result = await models.refreshDatabase()
    res.send('Database refreshed!')
  } catch (error) {
    res.status(codes.serverError).json({ status:codes.serverError, message: error.message, response: 'Query error!' })
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
  refresh,
}
