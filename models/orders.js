class Orders {
    constructor (sequelize) {
        this.sequelize = sequelize;
    };

    //Creates new order
    create(total_price, id_payment_method, id_user) {
        const newOrder = this.sequelize.query(
            `INSERT INTO orders (id_status, total_price, id_payment_method, id_user)
             VALUES (:id_status, :total_price, :id_payment_method, :id_user)`,
                { replacements: {
                    id_status: 1,
                    total_price,
                    id_payment_method,
                    id_user
                    }
                }
        );// Returns array [3, 1] index 0 is id_order
        return newOrder;
    };

    //Adds products created to order
    addProductsToOrder(id_order, products) {
        products.forEach(function(product) {
            this.sequelize.query(
                `INSERT INTO products_orders (id_order, id_product, product_quantity)
                VALUES (:id_order, :id_product, :product_quantity)`,
                    { replacements: {
                        id_order,
                        id_product: product.id_product,
                        product_quantity: product.product_quantity
                        }
                    }
            );
        }.bind(this));
    };

    //Returns full order list
    readAllIds() {
        const orderList = this.sequelize.query(
            `SELECT id_order FROM orders`,
                { type: this.sequelize.QueryTypes.SELECT }
        );
        return orderList;
    };

    read(ids) {
        ids.forEach(function(id) {
            this.readId(id[i].id_order)
        })
    };

    //Returns order with specified ID
    readId(id_order) {
        const order = this.sequelize.query(
            `SELECT
                orders.id_order,
                status.status,
                orders.time_stamp,
                orders.total_price,
                payment_methods.payment_method,
                orders.id_user
            FROM orders
            JOIN status USING (id_status)
            JOIN payment_methods USING (id_payment_method)
            WHERE orders.id_order = :id_order`,
                { replacements: {
                    id_order
                    },
                type: this.sequelize.QueryTypes.SELECT
                }
        );
        return order;
    };

    //Returns products from specific order ID
    readOrderProducts(id_order) {
        const products = this.sequelize.query(
        `SELECT
            products.id_product,
            products.name,
            products.price,
            products.image_url,
            products_orders.product_quantity
            FROM products_orders
            JOIN products USING (id_product)
            WHERE products_orders.id_order = :id_order`,
            { replacements: {
                id_order
                },
            type: this.sequelize.QueryTypes.SELECT
            }
        );
        return products;
    };
    
};

module.exports = { Orders };