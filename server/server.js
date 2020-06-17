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
const middleware = new modelMiddleware.Middleware(sequelize, users, products, orders, config, jwt);
//http://localhost/phpmyadmin/

server.use(bodyParser.json());

//Path /users

//POST: creates new user.
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
server.get('/users', middleware.validateToken, middleware.userIsAdmin, async (req, res) => {
    const userList = await users.read();
    res.status(200).json(userList);
});

//Path /users/login
//POST: logs in user.
server.post('/users/login', middleware.userIsEnabled, async (req, res) => {
    const { username, password } = req.body;
    let user = await users.login(username, password);
    if (user.length != 0) {
        const payload = {
            id_user: user[0].id_user,
            username: user[0].username,
            full_name: user[0].full_name,
            email: user[0].email,
            admin: user[0].admin,
            enabled: user[0].enabled
        };
        const token = jwt.sign(payload, config.secret);
        res.status(200).json({ token });
    } else {
        res.status(400).json({ error: 'Incorrect username or password'});
    };
});


//Path /users/:idUser

//GET: returns user with specified ID. Admin access only, unless the user is requesting their own data.
server.get('/users/:idUser', middleware.userDoesntExist, middleware.validateToken, async (req, res) => {
    const { idUser } = req.params;
    const { id_user, admin } = req.user;
    if (idUser != id_user) {
        if (admin != true) {
            res.status(403).json({ error: 'Forbidden: user is not admin'});
        }
        const user = await users.readId(idUser);
        res.status(200).json(user);
    } else {
        const user = await users.readId(idUser);
        res.status(200).json(user);
    };
});

//PATCH: gives user with specified ID admin access. Admin access only.
server.patch('/users/:idUser', middleware.userDoesntExist, middleware.validateToken, middleware.userIsAdmin, async (req, res) => {
    const { idUser } = req.params;
    await users.updateAdminPrivileges(idUser);
    const newAdmin = await users.readId(idUser);
    res.status(200).json(newAdmin);
});


//Path /products

//POST: Creates a new product. Admin access only.
server.post('/products', middleware.validateToken, middleware.userIsAdmin, middleware.productInputDataMissing, async (req, res) => {
    const { name, image_url, price } = req.body;
    try {
        const productId = await products.create(name, image_url, price);
        let product = await products.readId(productId[0]);
        product = product[0];
        res.status(201).json({
            id_product: product.id_product,
            name: product.name,
            image_url: product.image_url,
            price: product.price
        })
    } catch {
        res.status(409).send('Product name already in use');
    };
});

//GET: returns full list of products.
server.get('/products', middleware.validateToken, async (req, res) => {
    const { admin } = req.user;
    if (admin == true) {
        const productList = await products.read();
        res.status(200).json(productList);
    } else {
        const enabledProductList = await products.userRead();
        res.status(200).json(enabledProductList);
    };
});

//Path /products/:idProduct

//GET: returns product with specified ID.
server.get('/products/:idProduct', middleware.productDoesntExist, middleware.validateToken, middleware.productIsEnabled, async (req, res) => {
    const { idProduct } = req.params;
    const product = await products.readId(idProduct);
    res.status(200).json(product);
});

//PUT: modifies product with specified ID. Admin access only.
server.put('/products/:idProduct', middleware.productDoesntExist, middleware.validateToken, middleware.userIsAdmin, middleware.productInputDataMissing, async (req, res) => {
    try {
        const { idProduct } = req.params;
        const { name, image_url, price } = req.body;
        await products.update(idProduct, name, image_url, price);
        const updatedProduct = await products.readId(idProduct);
        res.status(200).json(updatedProduct);
    } catch {
        res.status(409).send('Product name already in use');
    };
});

//DELETE: disables product with specified ID (does not delete).
server.delete('/products/:idProduct', middleware.productDoesntExist, middleware.validateToken, middleware.userIsAdmin, async (req, res) => {
    const { idProduct } = req.params;
    await products.delete(idProduct);
    const disabledProduct = await products.readId(idProduct);
    res.status(200).json(disabledProduct);
});


//Path /orders
//POST: places a new order.
server.post('/orders', middleware.orderInputDataMissing, middleware.validateToken, async (req, res) => {
    const { products, total_price, id_payment_method } = req.body;
    const { id_user } = req.user;
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

//GET: returns order list. Admin gets full list, while user gets only their own orders.
server.get('/orders', middleware.validateToken, async (req, res) => {
    const { id_user, admin } = req.user;
    if (admin == true) {
        const orderIds = await orders.readAllIds();
        let orderList = [];
        for (let i = 0; i < orderIds.length; i++) {
            let orderDetails = await orders.readId(orderIds[i].id_order);
            orderDetails = orderDetails[0];
            const orderProducts = await orders.readOrderProducts(orderIds[i].id_order)
            let userData = await users.readId(orderDetails.id_user);
            userData = userData[0];
            const fullOrder = {
                id_order: orderDetails.id_order,
                id_status: orderDetails.id_status,
                time_stamp: orderDetails.time_stamp,
                products: orderProducts,
                total_price: orderDetails.total_price,
                payment_method: orderDetails.payment_method,
                id_user: orderDetails.id_user,
                full_name: userData.full_name,
                adress: userData.adress
            }
            orderList.push(fullOrder);
        };
        res.status(200).json(orderList);
    } else {
        const userOrders = await orders.userRead(id_user);
        console.log(userOrders);
        let userOrderList = [];
        for (let i = 0; i < userOrders.length; i++) {
            const orderProducts = await orders.readOrderProducts(userOrders[i].id_order);
            const fullOrder = {
                id_order: userOrders[i].id_order,
                id_status: userOrders[i].id_status,
                time_stamp: userOrders[i].time_stamp,
                products: orderProducts,
                total_price: userOrders[i].total_price,
                payment_method: userOrders[i].payment_method,
            };
            userOrderList.push(fullOrder);
        };
        res.status(200).json(userOrderList);
    };
});

//Path /orders/:idOrder
//GET: returns order with specified ID. Admin access only, unless the user is requesting their own data.
server.get('/orders/:idOrder', middleware.orderDoesntExist, middleware.validateToken, async (req, res) => {
    const { idOrder } = req.params;
    const { id_user, admin } = req.user;
    let orderDetails = await orders.readId(idOrder);
    orderDetails = orderDetails[0];
    if (id_user != orderDetails.id_user) {
        if (admin != true) {
            res.status(403).json({ error: 'Forbidden: user is not admin'});
        }
        const orderProducts = await orders.readOrderProducts(idOrder);
        const userData = await users.readId(orderDetails.id_user);
        const fullOrder = {
            id_order: orderDetails.id_order,
            id_status: orderDetails.id_status,
            time_stamp: orderDetails.time_stamp,
            products: orderProducts,
            total_price: orderDetails.total_price,
            payment_method: orderDetails.payment_method,
            id_user: orderDetails.id_user,
            full_name: userData[0].full_name,
            adress: userData[0].adress
        };
        res.status(200).json(fullOrder);
    } else {
        const orderProducts = await orders.readOrderProducts(idOrder);
        const userData = await users.readId(orderDetails.id_user);
        const fullOrder = {
            id_order: orderDetails.id_order,
            id_status: orderDetails.id_status,
            time_stamp: orderDetails.time_stamp,
            products: orderProducts,
            total_price: orderDetails.total_price,
            payment_method: orderDetails.payment_method,
            id_user: orderDetails.id_user,
            full_name: userData[0].full_name,
            adress: userData[0].adress
        };
        res.status(200).json(fullOrder);
    };
});

//PATCH: updates order status. Admin access only.
server.patch('/orders/:idOrder', middleware.orderDoesntExist, middleware.validateToken, middleware.userIsAdmin, async (req, res) => {
    const { idOrder } = req.params;
    const { id_status } = req.body;
    await orders.updateStatus(idOrder, id_status);
    const updatedOrder = await orders.readId(idOrder);
    res.status(200).json(updatedOrder);
});

server.listen(port, () => {
    console.log('Servidor Iniciado');
}); 