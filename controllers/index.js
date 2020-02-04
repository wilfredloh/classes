const models = require('../models')
const { ok, serverError, invalidInput, noContent } = require('../config/config')
const { logErrorMessageController, validateEmail } = require('../helpers/validation')
const { runInvalidInputResponse, databaseQueryError  } = require('../helpers/response')

const getTeachers = async (req, res) => {
  try {
    const results = await models.getTeachers()
    res.status(ok.num).json({ status: ok.num, teachers: results })
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}
  
const getStudents = async (req, res) => {
  try {
    const results = await models.getStudents()
    res.status(ok.num).json({ status:ok.num, students: results })
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}

const getRegistrations = async (req, res) => {
  try {
    const results = await models.getRegistrations()
    res.status(ok.num).json({ status:ok.num, registrations: results })
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}

const getCommonStudents = async (req, res) => {
  try {
    let teachersQuery = req.query.teacher
    if (!teachersQuery) {
      logErrorMessageController('getCommonStudents', 'invalid input')
      res.status(invalidInput.num).json({ status: invalidInput.num, response: invalidInput.message1})
      return
    }
    if ( !validateEmail(teachersQuery) ) {
      res.status(invalidInput.num).json({ status: invalidInput.num, response: invalidInput.message2})
      return
    }
    let qLength = Array.isArray(teachersQuery) ? teachersQuery.length : 1
    let teachers = await models.getValidTeacherEmails(teachersQuery).catch(e => console.log('error in teachers', teachers))
    let tLength = teachers.length
    
    if ( tLength === qLength ) {
      if ( tLength > 1 ) {
        teachers = teachers.map(teacher => teacher.email)
      } else {
        teachers = teachers[0].email
      } 
    } else {
      res.status(invalidInput.num).json({ status: invalidInput.num, response: invalidInput.message2})
      return
    }
    const results = await models.getCommonStudents(teachers).catch(e => console.log('error in results', results))
    if ( results.length === 0 ) { res.json({ status:ok.num, commonStudents: 'No common students' }); return}
    res.status(ok.num).json({ status:ok.num, commonStudents: results })
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}

const registerStudents = async (req, res) => {
  try {
    const teacher = req.body.teacher
    const student = req.body.student
    if (!teacher || !student) { res.status(invalidInput.num).json({ status: invalidInput.num, response: invalidInput.message1}); return } 
    let registrations = Array.isArray(student) ? student.map(s => [teacher, s] ) : [[teacher,student]]
    await models.registerStudents(registrations)
    res.status(noContent.num).json({ status:noContent.num, response: 'Student(s) added to teacher!' });
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}

const suspendStudent = async (req, res) => {
  try {
    const studentID = req.body.student
    if (!studentID) { runInvalidInputResponse(res); return }
    await models.suspendStudent(studentID)
    res.status(noContent.num).json({ status:noContent.num, response: 'Student suspended!' })
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
}

const notifyStudents = async (req, res) => {
  try {
    const request = { teacher: req.body.teacher, notification: req.body.notification }
    if (!req.body.teacher) { runInvalidInputResponse(res); return }
    const teacherIDResult = await models.getTeacherIDFromEmail(req.body.teacher)
    if (!teacherIDResult) { res.json({ status:serverError.num, error: null, response: 'Teacher ID query error!' }); return } 
    const teacherID = teacherIDResult[0].id
    if (!teacherID) { res.json({ status:serverError.num, error: null, response: 'Teacher does not exist!' }); return }
    const students = request.notification.split(' ').map(x => { if (x[0] === '@') return x.substring(1) })
    const suspended = false
    const notifiedStudents = await models.notifyStudents(teacherID, students, suspended)
    res.status(ok.num).json({ status:ok.num, error: null, students: notifiedStudents.length ? notifiedStudents : `All students suspended!` });
    return
  } catch (error) {
    databaseQueryError(res)
    return
  }
} 

const showHome = async (req, res) => {
    const data = [
      {
        title: 'Teachers',
        link: '/api/teachers',
        desc: 'GET'
      },
      {
        title: 'Students',
        link: '/api/students',
        desc: 'GET'
      },
      {
        title: 'Registrations',
        link: '/api/registrations',
        desc: 'GET'
      },
      {
        title: 'Common students',
        link: '/api/commonstudents',
        desc: 'GET'
      },
      {
        title: 'Register',
        link: '/api/register',
        desc: 'POST'
      },
      {
        title: 'Suspend',
        link: '/api/suspend',
        desc: 'POST'
      },
      {
        title: 'Notifications',
        link: '/api/retrievefornotifications',
        desc: 'POST'
      },
    ]
    res.render('api', {data})
}

const showTestPage = async (req, res) => {
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
    databaseQueryError(res)
    return
  }
}

const refresh = async (req, res) => {
  try {
    await models.refreshDatabase()
    res.send('Database refreshed!')
  } catch (error) {
    databaseQueryError(res)
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
  showTestPage,
  refresh,
}

