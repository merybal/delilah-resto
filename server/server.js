const express = require('express');
const server = express();
const port = 3000;
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah_resto');
const jwt = require('jsonwebtoken');
const config = require('../configurations/configuratios.js');
const modelUsers = require('../models/users.js');
const users = new modelUsers.Users(sequelize);
const modelProducts = require('../models/products.js');
const products = new modelProducts.Products(sequelize);
const modelOrders = require('../models/orders.js');
const orders = new modelOrders.Orders(sequelize);
const modelMiddleware = require('../models/middleware.js');
//const { response } = require('express');
const middleware = new modelMiddleware.Middleware(sequelize, users, products, orders);
//http://localhost/phpmyadmin/

server.use(bodyParser.json());

//Path /users

//POST: creates new user
server.post('/users', middleware.userInputDataMissing, async (req, res) => {
    const { username, full_name, email, phone_number, adress, password } = req.body;
    try {
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
    } catch (error) {
        res.status(409).send('Username or email already in use');
    };
});

//GET: returns full user list. Admin access only.
//Falta autorizacion y autenticacion
server.get('/users', async (req, res) => {
    const userList = await users.read();
    res.status(200).json(userList);
});

//Path /users/login
server.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    if (username == 'pepegrillo' && password == 'contrasenia') {
        const payload = {
            check: true
        };
        //const token = jwt.sign(payload, app.get())
    }
});

//Path /users/:idUser

//GET: returns user with specified ID. Admin access only.
//Falta autorizacion y autenticacion
server.get('/users/:idUser', middleware.userDoesntExist, async (req, res) => {
    const { idUser } = req.params;
    const user = await users.readId(idUser);
    res.status(200).json(user);
});

server.patch('/users/:idUser', middleware.userDoesntExist, async (req, res) => {
    const { idUser } = req.params;
    await users.updateAdminPrivileges(idUser);
    const newAdmin = await users.readId(idUser);
    res.status(200).json(newAdmin);
});


//Path /products

//POST: Creates a new product. Admin access only.
//Falta autorizacion y autenticacion
server.post('/products', middleware.productInputDataMissing, async (req, res) => {
    const { name, image_url, price, stock } = req.body;
    try {
        const productId = await products.create(name, image_url, price, stock);
        let product = await products.readId(productId[0]);
        product = product[0];
        res.status(201).json({
            id_product: product.id_product,
            name: product.name,
            image_url: product.image_url,
            price: product.price,
            stock: product.stock
        })
    } catch {
        res.status(409).send('Product name already in use');
    };
});

//GET: returns full list of products.
server.get('/products', async (req, res) => {
    const productList = await products.read();
    res.status(200).json(productList);
});

//Path /products/:idProduct

//GET: returns product with specified ID.
//Falta autorizacion y autenticacion
server.get('/products/:idProduct', middleware.productDoesntExist, async (req, res) => {
    const { idProduct } = req.params;
    const product = await products.readId(idProduct);
    res.status(200).json(product);
});

//PUT: modifies product with specified ID.
server.put('/products/:idProduct', middleware.productDoesntExist, middleware.productInputDataMissing, async (req, res) => {
    try {
        const { idProduct } = req.params;
        const { name, image_url, price, stock } = req.body;
        await products.update(idProduct, name, image_url, price, stock);
        const updatedProduct = await products.readId(idProduct);
        res.status(200).json(updatedProduct);
    } catch {
        res.status(409).send('Product name already in use');
    };
});

//DELETE: disables product with specified ID (does not delete)
server.delete('/products/:idProduct', middleware.productDoesntExist, async (req, res) => {
    const { idProduct } = req.params;
    await products.delete(idProduct);
    const disabledProduct = await products.readId(idProduct);
    res.status(200).json(disabledProduct);
});


//Path /orders
//POST: places a new order
server.post('/orders', middleware.orderInputDataMissing, async (req, res) => {
    const { products, total_price, id_payment_method, id_user } = req.body;
    const newOrder = await orders.create(total_price, id_payment_method, id_user);
    await orders.addProductsToOrder(newOrder[0], products);
    const createdOrder = await orders.readId(newOrder[0]);
    const orderProducts = await orders.readOrderProducts(newOrder[0]);
    res.status(201).json({
        id_order: createdOrder[0].id_order,
        id_status: createdOrder[0].status,
        time_stamp: createdOrder[0].time_stamp,
        products: orderProducts,
        total_price: createdOrder[0].total_price,
        payment_method: createdOrder[0].payment_method,
        id_user: createdOrder[0].id_user
    });
});

//GET: returns full order list
server.get('/orders', async (req,res) => {
    const orderIds = await orders.readAllIds();
    console.log(orderIds)
    let orderList = [];
    for (let i = 0; i < orderIds.length; i++) {
        let orderData = await orders.readId(orderIds[i].id_order);
        orderData = orderData[0];
        const orderProducts = await orders.readOrderProducts(orderIds[i].id_order)
        let userData = await users.readId(orderData.id_user);
        userData = userData[0];
        console.log(userData);
        const fullOrder = {
            id_order: orderData.id_order,
            id_status: orderData.id_status,
            time_stamp: orderData.time_stamp,
            products: orderProducts,
            total_price: orderData.total_price,
            payment_method: orderData.payment_method,
            id_user: orderData.id_user,
            full_name: userData.full_name,
            adress: userData.adress
        }
        orderList.push(fullOrder);
    };
    res.status(200).json(orderList);
});

//Path /orders/:idOrder
//GET: Returns order with specified ID
//Tiene que chequear que el usuario sea el que hizo la orden para poder verla. 
//agregar middleware
server.get('/orders/:idOrder', middleware.orderDoesntExist, async (req, res) => {
    const { idOrder } = req.params;
    const order = await orders.readId(idOrder);
    res.status(200).json(order);
});

server.listen(port, () => {
    console.log('Servidor Iniciado');
}); 