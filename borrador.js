//http://localhost/phpmyadmin/

const order = {
    "id_order": 18,
    "status": "Nuevo",
    "time_stamp": "2020-05-26 21:02:15",
    "products": [
      {
        "id_product": 10,
        "name": "Hamburguesa King",
        "price": 390,
        "image_url": "https://cocina-casera.com/wp-content/uploads/2016/11/hamburguesa-queso-receta.jpg",
        "quantity": 2
      }
    ],
    "total_price": 390,
    "payment_method": 1,
    "id_user": 16
};

`SELECT
orders.id_order,
orders.id_status,
orders.time_stamp,
products.id_product,
products.name,
products.price,
products.image_url,
products_orders.product_quantity,
orders.total_price,
orders.id_payment_method,
orders.id_user
FROM products_orders 
JOIN orders USING (id_order)
JOIN products USING (id_product)
JOIN payment_methods USING (id_payment_method)
JOIN status USING (id_status)
WHERE products_orders.id_order = 27`



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
    WHERE orders.id_order = 27`
/*
Trae todos los datos completos conectandolo desde la tabla
canciones, en los id album y id banda
SELECT *, bandas.nombre, albumes.nombre_album FROM canciones
    JOIN albumes ON albumes.id = canciones.album
    JOIN bandas ON bandas.id = canciones.banda

SELECT canciones.nombre,
bandas.nombre AS banda,
albumes.nombre_album AS album
FROM canciones
    JOIN bandas ON canciones.banda = bandas.id
    JOIN albumes ON canciones.album = albumes.id*/


/*Arma una nueva fila en PRODUCTS_ORDERS, por cada producto, con la cantidad
xCrea una nueva fila en la tabla ORDERS, con todos los datos
Trae la informacion de la orden con todos los productos, precios y precio total
Resta el producto elegido del stock. */


[
  {
      "id_order": 1,
      "id_status": 1,
      "time_stamp": "2020-06-01T14:33:22.000Z",
      "total_price": 350,
      "id_payment_method": 2,
      "id_user": 1
  },
  {
      "id_order": 3,
      "id_status": 1,
      "time_stamp": "2020-06-11T15:46:49.000Z",
      "total_price": 390,
      "id_payment_method": 1,
      "id_user": 1
  },


  [
    {
      id_user: 1,
      username: 'pepegrillo',
      full_name: 'Pepe Grillo',
      email: 'pepegrillo@losgrillos.com',
      phone_number: 1554546666,
      adress: 'Calle Falsa 123',
      password: 'ChangeThisPassword',
      admin: 1,
      enabled: 1
    }
  ]
  


/*
SELECT * FROM users 
WHERE username = "pepegrillo" 
OR email = "pepegrillo" 
AND password = 'ChangeThisPassword'



SELECT * FROM users 
WHERE username = "pepegrillo"
AND password = 'Change'
OR email = "pepegrillo" 
AND password = 'Change'
*/

[
  {
      "id_user": 1,
      "username": "pepegrillo",
      "full_name": "Pepe Grillo",
      "email": "pepegrillo@losgrillos.com",
      "phone_number": 1554546666,
      "adress": "Calle Falsa 123",
      "password": "ChangeThisPassword",
      "admin": 1,
      "enabled": 1
  }
]