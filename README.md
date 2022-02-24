# NC News API 

## This is an informative guide on how to navigate the API

1. Link to the live API: https://oliver-j-nc-news.herokuapp.com/api
  - This allows you to access a list of endpoints, queries, and looks like the below. 

  e.g.
  
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
