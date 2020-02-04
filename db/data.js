
const seed = [
    'drop database classes;',
    'create database classes;',
    'use classes;',
    'CREATE TABLE teachers (id int NOT NULL AUTO_INCREMENT, email varchar(50) NOT NULL, PRIMARY KEY (id));',
    'CREATE TABLE students (id int NOT NULL AUTO_INCREMENT, email varchar(50) NOT NULL, suspended boolean NOT NULL, PRIMARY KEY (id));',
    'CREATE TABLE IF NOT EXISTS registrations (id int NOT NULL AUTO_INCREMENT, teacher_id INT NOT NULL, student_id INT NOT NULL, PRIMARY KEY (id) );',
    'INSERT INTO teachers (email) VALUES ("wong@teacher.com");',
    'INSERT INTO teachers (email) VALUES ("alex@teacher.com");',
    'INSERT INTO teachers (email) VALUES ("james@teacher.com");',
    'INSERT INTO students (email, suspended) VALUES ("amy@student.com", false);',
    'INSERT INTO students (email, suspended) VALUES ("luke@student.com", false);',
    'INSERT INTO students (email, suspended) VALUES ("ben@student.com", true);',
    'INSERT INTO students (email, suspended) VALUES ("alexa@student.com", false);',
    'INSERT INTO students (email, suspended) VALUES ("candice@student.com", true);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (1,1);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (1,2);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (1,3);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (2,2);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (2,5);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (3,1);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (3,4);',
    'INSERT INTO registrations (teacher_id, student_id) VALUES (3,5);',
]

module.exports = seed