CREATE DATABASE delilah_resto;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS products_orders;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS payment_methods;

CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR (255) NOT NULL,
    full_name VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    phone_number INT NOT NULL,
    adress VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO users (id_user, username, full_name, email, phone_number, adress, password, admin, enabled)
    VALUES (1, "pepegrillo", "Pepe Grillo", "pepegrillo@losgrillos.com", 1554546666, "Calle Falsa 123", "ChangeThisPassword", true, true);
--

CREATE TABLE products (
    id_product INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL,
    image_url VARCHAR (255) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO products (id_product, name, image_url, price, stock, enabled)
    VALUES (1, "Hamburguesa King", "https://cocina-casera.com/wp-content/uploads/2016/11/hamburguesa-queso-receta.jpg", 350, 10, true);
--

CREATE TABLE status (
    id_status INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR (255) NOT NULL
);

INSERT INTO status VALUES (1,'NUEVO'),(2,'CONFIRMADO'),(3,'PREPARANDO'),(4,'ENVIANDO'),(5,'CANCELADO'),(6,'ENTREGADO');
--

CREATE TABLE payment_methods (
    id_payment_method INT PRIMARY KEY AUTO_INCREMENT,
    payment_method VARCHAR (255) NOT NULL
);

INSERT INTO payment_methods VALUES (1,'EFECTIVO'),(2,'DEBITO'),(3,'CREDITO');
--

CREATE TABLE orders (
    id_order INT PRIMARY KEY AUTO_INCREMENT,
    id_status INT NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_price INT NOT NULL,
    id_payment_method INT NOT NULL,
    id_user INT NOT NULL,
    CONSTRAINT fk_orders_status
    FOREIGN KEY (id_status)
    REFERENCES status(id_status) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_orders__payment_methods
    FOREIGN KEY (id_payment_method)
    REFERENCES payment_methods(id_payment_method) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_orders_users
    FOREIGN KEY (id_user)
    REFERENCES users(id_user) ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO orders (id_order, id_status, id_payment_method, id_user)
    VALUES (1, 1, 2, 1);
--

CREATE TABLE products_orders (
    id_products_orders INT PRIMARY KEY AUTO_INCREMENT,
    id_product INT NOT NULL,
    id_order INT NOT NULL,
    CONSTRAINT fk_products_orders__products
    FOREIGN KEY (id_product)
    REFERENCES products(id_product) ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_products_orders__orders
    FOREIGN KEY (id_order)
    REFERENCES orders(id_order) ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO products_orders (id_products_orders, id_product, id_order)
    VALUES (1, 1, 1);





