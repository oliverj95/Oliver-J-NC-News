# NC News API 

## This is an informative guide on how to navigate the API

1. Link to the live API: https://oliver-j-nc-news.herokuapp.com/api
  - This allows you to access a list of endpoints and queries.
  
## To clone this repo
  Please fork or clone the direct link to your machine

- open with an IDE of your choice
- Install dependencies for the project (express, jest) using: npm -i
- You will need to create two .env files (one for testing and one for development)
- inside the .env.test file enter the following config for the database: PGDATABASE=nc_news_test
- inside the .env.development file enter the following config for the database: PGDATABASE=nc_news
- Once the .env files are set up. Use node ./db/seeds/seed to run the seed to the database
- to check the database has been seeded run psql -f view_news.sql > database.txt
- run tests using npm t

## Requirements
  - node v15.0.0
  - Postgres v13.0.0




NC News is a [node-postgres](https://node-postgres.com/) back-end API for a Reddit style discussion website. It draws from its database of users, topics, articles, and comments.

> A live version can be accessed here: https://oliver-j-nc-news.herokuapp.com/api


---
## Set-up guide
### 1. Install dependencies
```
$ npm i
$ npm i -D jest
$ npm i -D jest-sorted
```
At a minimum, [Node.js 17.0.1](https://nodejs.org/en/download/) and [Postgres 8.7.1](https://www.postgresql.org/download/) are required. Postgres will be installed with the command above.

### 2. Set environment variables
Create two `.env` files, `.env.development` and `.env.test`, which should read respectively:
```
PGDATABASE=nc_news
```
```
PGDATABASE=nc_news_test
```
> Note: Ubuntu users may get password authentication errors. In this case, [set your local PSQL password](https://www.eukhost.com/blog/webhosting/postgres-gives-an-error-of-password-authentication-failed-for-user/) and add `PGPASSWORD=your_password_here` into both `.env` files. Don't use your computer password!

### 3. Set-up and seed the databases
```
$ npm run seed
```
The databases can now be accessed via `psql`.

---
## Testing
To run the provided test suite:
```
$ npm t
```
To run the dev environment:
```
$ npm run dev
```

---
## Available endpoints

### `GET /api/`
- Retrieves a JSON object of available endpoints in the API

### `GET /api/topics`
- Retrieves a list of topics

### `GET /api/articles`
- Retrieves a list of articles

### `GET /api/articles/:article_id`
- Retrieves an individual article, along with the number of comments associated with it

### `PATCH /api/articles/:article_id`
- Increments the article's `votes` property by the `inc_votes` property in the request body
- Example request body: 
```
{ inc_votes: 1 }
```
### `GET /api/articles/:article_id/comments`
- Retrieves a list of comments associated with the given `article_id`

### `POST /api/articles/:article_id/comments`
- Adds a comment to the database, associated with the given `article_id`
- Example request body:
```
{ username: "jessjelly", body: "I love this site!" };
```
### `DELETE /api/comments/:comment_id`
- Deletes the specified comment from the database

### `GET /api/users`
- Retrieves a list of users currently registered to the site.`


