const request = require('supertest')
const app = require('../index')

const connection = require('../helpers/connection');
const query = require('../helpers/query');
const seed = require('../db/data.js')

afterAll(async done => {
    const conn = await connection()
    seed.forEach( async x => {
        await query(conn, x)
    })
    done();
 });


describe('Basic Endpoints', () => {
    it('should fetch all teachers', async () => {
        const res = await request(app).get('/api/teachers')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('teachers')
    });

    it('should fetch all students', async () => {
        const res = await request(app).get('/api/students')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('students')
    });

    it('should fetch all registrations', async () => {
        const res = await request(app).get('/api/registrations')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('registrations')
    });
})

describe('Common Student endpoint', () => {

    it('should fetch all common students of Alex', async () => {
        const teacher = 'alex@teacher.com'
        const res = await request(app).get(`/api/commonstudents?teacher=${teacher}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('commonStudents')
        const luke = res.body.commonStudents[0]
        const candice = res.body.commonStudents[1]
        expect(luke.email).toEqual('luke@student.com')
        expect(candice.email).toEqual('candice@student.com')
    });
    
    it('should fetch all common students under Alex AND James', async () => {
        const teachers = ['alex@teacher.com', 'james@teacher.com']
        let apiString = '/api/commonstudents?'
        apiString += teachers.map(x => `teacher=${x}&`)
        apiString = apiString.replace(/,/g, "")
        const res = await request(app).get(apiString)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('commonStudents')
        const candice = res.body.commonStudents[0]
        expect(candice.email).toEqual('candice@student.com')
    });
    
    it('should fetch all common students under Wong, Alex AND JAMES', async () => {
        const teachers = ['wong@teacher.com', 'alex@teacher.com', 'james@teacher.com']
        let apiString = '/api/commonstudents?'
        apiString += teachers.map(x => `teacher=${x}&`)
        apiString = apiString.replace(/,/g, "")
        const res = await request(app).get(apiString)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('commonStudents')
        expect(res.body.commonStudents).toEqual('No common students')
    });
})

describe('Suspend Student endpoint', () => {

    it('should suspend one student', async () => {
        const res = await request(app)
          .post('/api/suspend')
          .send({
            student: 2,
          });
        expect(res.statusCode).toEqual(204);
      });
})

describe('Notify Students endpoint', () => {

    it('should show students under teacher Wong & students are not suspended', async () => {
        const res = await request(app)
          .post('/api/retrievefornotifications')
          .send({
            teacher: 'wong@teacher.com',
            notification: ''
          });
        expect(res.statusCode).toEqual(200);
        const amy = res.body.students[0]
        expect(amy.email).toEqual('amy@student.com')
      });
    
    it('should show students under teacher Wong & notified students & students are not suspended', async () => {
        const res = await request(app)
            .post('/api/retrievefornotifications')
            .send({
            teacher: 'wong@teacher.com',
            notification: 'test @alexa@student.com @ben@student.com'
            });
        expect(res.statusCode).toEqual(200);
        const amy = res.body.students[0]
        const alexa = res.body.students[1]
        expect(amy.email).toEqual('amy@student.com')
        expect(alexa.email).toEqual('alexa@student.com')
    });
    
    it('should show all selected students are suspended', async () => {
        const res = await request(app)
            .post('/api/retrievefornotifications')
            .send({
            teacher: 'alex@teacher.com',
            notification: 'test'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.students).toEqual('All students suspended!')
    });
})

describe('Register Student endpoint', () => {

    it('should add student 5 to teacher 1', async () => {
        const res = await request(app)
          .post('/api/register')
          .send({
            teacher: 1,
            student: 5,
          });
        expect(res.statusCode).toEqual(204);
      });
    
      it('should add student 3 & 4 to teacher 2', async () => {
        const res = await request(app)
          .post('/api/register')
          .send({
            teacher: 2,
            student: [3,4],
          });
        expect(res.statusCode).toEqual(204);
      });
})