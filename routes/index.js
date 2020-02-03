const { Router } = require('express');
const controllers = require('../controllers')
const router = Router();

router.get('/teachers', controllers.getTeachers)
router.get('/students', controllers.getStudents)
router.get('/registrations', controllers.getRegistrations)

router.get('/commonstudents', controllers.getCommonStudents)
router.post('/register', controllers.registerStudents)
router.post('/suspend', controllers.suspendStudent)
router.post('/retrievefornotifications', controllers.notifyStudents)

router.get('/', controllers.showHome)

module.exports = router;