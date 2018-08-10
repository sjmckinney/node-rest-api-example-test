* ## Users end point

+ve

* Create 1..n users
* Create new line
* Retrieve 1..n users
* Delete 1..n users

-ve

* Cannot create duplicate user
* Cannot create user with invalid email
* Cannot create user without email password values
* Cannot see password in get users
* Cannot use product or order end point without JWT
* Cannot use product or order end point with invalid JWT

## General cases

-ve

* will handle non-existent end points
* Will handle non-unicode strings in names

## Products end point

+ve

* Can create 1..n products
* Can get all products
* Can get product by id
* Can delete product by id
* Can update product by id
* Can update name and price together and independently

-ve

* Will handle invalid data in post bodies
* Will handle invalid data in patch bodies

## Orders end point

+ve

* Can create 1..n orders
* Can get 1..n orders
* Can get order by order id
* Can delete order by order id

-ve

* Cannot create order for non existend product
* Cannot use invalid data in Post bodies

## Authentication

## Options

