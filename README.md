
## About
This repo contains a set of API endpoints for teachers to perform administrative tasks for their classes.
#### API Endpoint: [Link](http://google.com)
#### Postman Collection: [Link](https://www.getpostman.com/collections/7e13a3d4ae0e3be52d75)

## Technologies
- Node.js
- MySQL
- Jest
- Heroku

ERD Diagram: [Link](ERD.pdf)

## Pre-requisites 
- Node.js
```
brew install node
```
- MySQL: [Link](https://dev.mysql.com/downloads/mysql/) (using legacy password encryption)

## Instructions to install project
1. install the project dependencies
```
npm install
```
2. To run mysql command on the Terminal (Mac), add to .profile or .bash_profile
```
export PATH=$PATH:/usr/local/mysql/bin
```
3. To access MySQL data from the terminal
```
mysql -uroot -p
```
4. Configure details in db > dbconfig.js 
5. eed data in db > data.sql
6. To start server, run
```
npm start
```
All API endpoints are listed in routes > index.js
<br/>
<br/>
(Optional) To view and manipulate data from the browser, start server and go to: <http://localhost:3000/api>
<br/>
<br/>
For unit tests, run: 
```
npm test
```