
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
Next, install the project dependencies
```
npm install
```
To run mysql command on the Terminal (Mac), add to .profile or .bash_profile
```
export PATH=$PATH:/usr/local/mysql/bin
```
To access MySQL data from the terminal
```
mysql -uroot -p
```
Next,<br/> 
Configure details in db > dbconfig.js <br/> 
Seed data in db > data.sql<br/> 
To start server, run
```
npm start
```
All API endpoints are listed in routes > index.js
<br/>
To view and manipulate data from the browser, start server and go to: [http://localhost:3000/api]: http://localhost:3000/api
<br/>
For unit tests, run: 
```
npm test
```