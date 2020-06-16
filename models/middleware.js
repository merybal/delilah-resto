class Middleware {
    constructor (sequelize, users, products, orders) {
        this.sequelize = sequelize;
        this.users = users;
        this.products = products;
        this.orders = orders;
    }

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
            res.status(400).json({error: 'Please fill in all the fields'});
        };
    };

    //Checks if user ID exists
    userDoesntExist = async (req, res, next) => {
        const { idUser } = req.params;
        const exist = await this.users.readId(idUser);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idUser} doesn't exist`})
        } else {
            next();
        };
    };

    //Checks if there are fields missing in product POST
    productInputDataMissing = (req, res, next) => {
        const { name, image_url, price, stock } = req.body;
        if (
            name != null && 
            image_url != null && 
            price != null &&
            stock != null
            ) {
                next();
        } else {
            res.status(400).json({error: 'Please fill in all the fields'});
        }; 
    };

    //Checks if product ID exists
    productDoesntExist = async (req, res, next) => {
        const { idProduct } = req.params;
        const exist = await this.products.readId(idProduct);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idProduct} doesn't exist`})
        } else {
            next();
        };
    };

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
            res.status(400).json({error: 'Please fill in all the fields'});
        };
    };

    orderDoesntExist = async (req, res, next) => {
        const { idOrder } = req.params;
        const exist = await this.orders.readId(idOrder);
        if (exist.length == 0) {
            res.status(404).json({error: `ID ${idOrder} doesn't exist`});
        } else {
            next();
        }
    }
}

module.exports = { Middleware }