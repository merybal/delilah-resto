const express = require('express');
const server = express();
const port = 3000;
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah_resto');
const modelUsers = require('../models/users.js');
const users = new modelUsers.Users(sequelize);
const modelMiddleware = require('../models/middleware.js');
const middleware = new modelMiddleware.Middleware(sequelize);
//http://localhost/phpmyadmin/

server.use(bodyParser.json());


//Endpoint: /users
//POST: crea usuario nuevo.
server.post('/users', async (req, res) => {
    const { username, full_name, email, phone_number, adress, password } = req.body;
    const userId = await users.create(username, full_name, email, phone_number, adress, password);
    let user = await users.readId(userId[0]);
    user = user[0];
    res.status(201).json({
        id_user: user.id_user,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        adress: user.adress
    });
});

//Endpoint: /users/:idUser
//GET: ver datos de usuario con idUser especifico.
server.get('/users/:idUser', async (req, res) => {
    const { idUser } = req.params;
    const user = await users.readId(idUser);
    res.status(200).json(user);
});

server.listen(port, () => {
    console.log('Servidor Iniciado');
}); 