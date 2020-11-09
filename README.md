# Delilah Restó
Restful API developed for a restaurant, to facilitate the management of users, orders and products. 

## Dependencies
- Node.js
- Nodemon
- Express
- Body Parser
- Sequelize
- JSON Web Token (JWT)
- MySQL2
- Postman
- Swagger

## OPEN API Specifications
[OPEN API documentation](https://github.com/merybal/delila-resto/blob/master/documentation.yaml)

Specifications can be copied on the Swagger Editor here (https://editor.swagger.io/) for a friendlier interface.

## Getting started

### Step 1: Clone repository
Clone the project repository from your terminal:
```
$ git clone https://github.com/merybal/delila-resto.git
```
or directly from GitHub.

### Step 2: Install dependencies
Download and install Node.js on your computer.

Access from your terminal the directory where you stored the repository on your computer and type:
```
$ npm i dependency-name
```
for each one of the dependencies.

### Step 3: Set JWT password
<<<<<<< HEAD
Open /configurations/configurations.js and replace string  ```‘insertYourLey’```  with your preferred password, and save.
=======
Open /configurations/configurations.js and replace string  ```‘insertYourKey’```  with your preferred password, and save.
>>>>>>> 595059f1f24dbc0131e1da93febde353f5f67a06

### Step 4: Setting up the data base
Download and install XAMPP on your computer.

Open XAMPP control panel and check that it is running through the ```3306``` port.

Start Apache and MySQL.
From your browser, access the URL ```http://localhost/phpmyadmin/``` .

Create your data base using the file /data-base/queries.sql, either by importing the file or copying the queries to the SQL panel.

IMPORTANT: The initial queries insert an example into each table, including the first user, that has admin privileges. Any user created from then on will not have admin privileges, you’ll have to provide them manually as instructed on the documentation.  

### Step 5: Run server
On your terminal, access /server and type
```
$ node server.js
```
to run your server.

### Step 6: Use the API!
Server is up and running!

<<<<<<< HEAD
You can test the endpoints using POSTMAN, importing this collection: ```https://www.getpostman.com/collections/89471870a1520d5755ce``` .
=======
You can test the endpoints using POSTMAN, importing this collection: ```https://www.getpostman.com/collections/89471870a1520d5755ce``` .
>>>>>>> 595059f1f24dbc0131e1da93febde353f5f67a06
