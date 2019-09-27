## Things that are going to be done

This file lists the changes that need to be made in each stage. It is ordered in reverse chronological order, meaning that the last changes made will always be on top of the file, so that readers will not have to scroll all the way down with each task added.

## Task 05 - Mongoose and Controllers

In this task will update our controllers to start communicating with our database. `Lowdb` is no longer needed, so we will get rid of it's structure. We will dive into Mongoose API and introduce methods that establish communication with our database. Using Mongoose we will read data from the database, insert new records and manipulate already stored data. We will also introduce `Robo 3T`, a MongoDB GUI that will help us follow what is happening in our database whenever we update something.

**TODO**:

1. Please update your record's controller using Mongoose.
2. Make sure all API endpoints for `records` work as they should.
3. Repeat the process for your `users` and `orders` controllers.

## Task 04 - Mongoose and Seeding

In this task we will introduce Mongoose. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
We will learn how to setup Mongoose and how to connect it with our app. We will create our user models and schemas and define exactly how a record/user/order object will look.
The next step will be to create a feed function that will feed our database with some fake data so we will be able to test all our endpoints straight away after initialising our server.

**TODO**:

1. Please set up mongoose in your server.
2. Create a data schema and a model for our records, users and orders.
3. Write a seed script using faker that will run everytime we start our project. If the database is empty, it will feed it some records, orders and users.

## Task 03 - Routing and error handling

As we saw in the first task, there are requests like `GET` and `POST` that define what is the functionality of each endpoint. We will now introduce `PUT` and `DELETE`.

- `PUT` will update an already existing resource
- `DELETE` will delete an already existing resource

After we introduce the above requests for our record store we need to do some error handling. What happens when something goes wrong during a request? We need to let the user know what went wrong in a consistent way. We can achieve that by writing middleware functions that will take care of error responses.

**Story**: Our client, the record store, would like to be able to update and delete records from their store. Except the records data model, our client would like to have two more data models. One for the users and one for the orders.

**TODO**:

1. Please create three more endpoints (routes) for the record data model

   - `records/:id` -> a `GET` that will return a record based on the `id`
   - `records/:id` -> a `PUT` that will update a record based on the `id`
   - `records/:id` -> a `DELETE` that will delete a record based on the `id`

2. Please create endpoints for the `users` and `orders` models. A user should contain a first name, a last name, an email, a password. An order should contain a record id and a quantity property. We will later on enrich all models with more properties.

   Users Model

   - `users` -> `GET` all users
   - `users/:id` -> `GET` a user
   - `users` -> `POST` a user
   - `users/:id` -> `PUT` a user
   - `users/:id` -> `DELETE` a user

   Orders Model

   - `orders` -> `GET` all orders
   - `orders/:id` -> `GET` an order
   - `orders` -> `POST` an order
   - `orders/:id` -> `PUT` an order
   - `orders/:id` -> `DELETE` an order

3. Once we make sure all the above work as they should and that our database is being updated correctly, please write a middleware function that will handle errors during the requests. Remember that by default a package called `http-errors` is already imported in our app.

## Task 02 - Middleware and CORS

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named `next`. There are a number of already made middleware functions we can use and we can also build our own custome middleware functions. You can already see that by default your express app is already using `morgan` and `express.json()` as it's middleware.

Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to permit a web application running at one origin access selected resources from a different origin. A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, or port) from its own.

**TODO**:

1. Please create your own middleware function that will take care of enabling CORS for each request. Create a middleware directory. Add your middleware function in that directory and then use it within your app.

## Task 01 - Mock database and Controllers

Most applications made for the web have to do with some sort of data manipulation. In order to be able to manipulate our data we have to do two things first:

    - We need to define the endpoints of our app that our users will use to send
      different kinds of requests (GET, POST, DELETE, etc).
    - We have to define how do we want our data to look like and of course store them somewhere.

**Story**: Our client is a record shop owner who wants to have a list of products in the main page of their shop. They know that they want to display the title, the artist, the year, the cover image and the price for each record they have available. However, the client still doesn't have a full list of all their products. He would also like to be able to add new records to his collection.

**TODO**:

1. Please create two endpoints (routes) for the shop owner

   - `records` -> a `GET` that will return all records of the store
   - `records` -> a `POST` that will add a new record to the record collection

   For now you can just return a string from the above endpoints, just to make sure everything works.

2. Using `lowdb` set up a mock database for our records. It can be empty or it can contain already some fake data. Update the routes above so that they work just like they should.

   - `records` -> should return all the records that are in our lowdb database
   - `records` -> should add a new record to our lowdb database
