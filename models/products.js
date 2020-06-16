class Products {
    constructor(sequelize) {
        this.sequelize = sequelize;
    };

    //Creates new user
    create(name, image_url, price, stock) {
        const newProduct = this.sequelize.query(
            `INSERT INTO products (name, image_url, price, stock)
            VALUES (:name, :image_url, :price, :stock)`,
                { replacements: {
                    name, 
                    image_url,
                    price,
                    stock
                    }
                }
        );
        return newProduct;
    }

    //Returns full product list
    read() {
        const productList = this.sequelize.query(
            `SELECT * FROM products`,
                { type: this.sequelize.QueryTypes.SELECT }
        );
        return productList;
    };

    //Returns product with specified ID
    readId(id_product) {
        const product = this.sequelize.query(
            `SELECT * FROM products WHERE id_product = :id_product`,
                { replacements: {
                    id_product: [id_product]
                    },
                type: this.sequelize.QueryTypes.SELECT
                }
        );
        return product;
    };

    //Modifies product with specified ID.
    update(id_product, name, image_url, price, stock) {
        const updatedProduct = this.sequelize.query(
            `UPDATE products 
            SET name = :name, image_url = :image_url, price = :price, stock = :stock
            WHERE id_product = :id_product`,
                { replacements: {
                    id_product,
                    name,
                    image_url,
                    price, 
                    stock
                    }
                }
        )
        return updatedProduct;
    };


    //Disables product with specified ID (does not delete)
    delete(id_product) {
        const disabledProduct = this.sequelize.query(
            `UPDATE products
             SET enabled = :enabled
             WHERE id_product = :id_product`,
                { replacements: {
                    id_product,
                    enabled: 0
                    }
                }
        );
        return disabledProduct;
    };
};

module.exports = { Products };
