class Middleware {
    constructor (sequelize, users, products, orders, config, jwt) {
        this.sequelize = sequelize;
        this.users = users;
        this.products = products;
        this.orders = orders;
        this.config = config;
        this.jwt = jwt;
    };

    //Checks if there are fields missing in user POST
    userInputDataMissing = (req, res, next) => {
        const { username, full_name, email, phone_number, adress, password } = req.body;
        if (
            username != null && 
            full_name != null && 
            email != null &&
            phone_number != null &&
            adress != null &&
            password != null
            ) {
                next();
        } else {
            res.status(400).json({error: 'Bad request'});
        };
    };

    //Cheks if there are fields missing in user login
    logInDataMissing = (req, res, next) => {
        const { username, password } = req.body;
        if (username != null && password != null) {
            next();
        } else {
            res.status(400).json({error: 'Bad request'});
        }
    };

    //Checks if user ID exists
    userDoesntExist = async (req, res, next) => {
        const { idUser } = req.params;
        const exist = await this.users.readId(idUser);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idUser} not found`})
        } else {
            next();
        };
    };
    
    //Checks if user is admin
    userIsAdmin = (req, res, next) => {
        const { admin } = req.user;
        if (admin == false) {
            res.status(403).json({ error: 'Forbidden: user is not admin'});
            return;
        };
        next();
    };

    //Validates JSON web token
    validateToken = (req, res, next) => {
        const header = req.headers.authorization;
        if (!header) {
            res.status(401).json({ error: 'Please log in to continue'});
            return;
        };
        const token = header.split(" ").pop();
        const decoded = this.jwt.verify(token, this.config.secret);
        if (decoded) {
            req.user = decoded;
            next();
        };
    };

    //Checks if there are fields missing in product POST
    productInputDataMissing = (req, res, next) => {
        const { name, image_url, price, enabled } = req.body;
        if (
            name != null && 
            image_url != null && 
            price != null &&
            enabled != null
            ) {
                next();
        } else {
            res.status(400).json({error: 'Bad request'});
        }; 
    };

    //Checks if product ID exists
    productDoesntExist = async (req, res, next) => {
        const { idProduct } = req.params;
        const exist = await this.products.readId(idProduct);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idProduct} not found`});
        } else {
            next();
        };
    };

    //Checks if product is enabled
    productIsEnabled = async (req, res, next) => {
        const { idProduct } = req.params;
        const { admin } = req.user;
        const product = await this.products.readId(idProduct);
        if (product[0].enabled == false) {
            if (admin == false) {
                res.status(409).json({ error: 'Product is disabled'});
            } else {
                next();
            };
        } else {
            next();
        };
    };

    //Checks if there are fields missing in order POST
    orderInputDataMissing = (req, res, next) => {
        const { products, total_price, id_payment_method, id_user } = req.body;
        if (
            products != null &&
            total_price != null &&
            id_payment_method != null &&
            id_user != null 
        ) {
            next();
        } else {
            res.status(400).json({error: 'Bad request'});
        };
    };

    //Checks if order id exists
    orderDoesntExist = async (req, res, next) => {
        const { idOrder } = req.params;
        const exist = await this.orders.readId(idOrder);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idOrder} not found`});
        } else {
            next();
        }
    };

    //Checks if there is status input data missing on order PATCH
    statusInputDataMissing = (req, res, next) => {
        const { id_status } = req.body;
        if (id_status != null) {
            next();
        } else {
            res.status(400).json({error: 'Bad request'});
        }
    }
}

module.exports = { Middleware }