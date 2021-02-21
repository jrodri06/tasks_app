# Tasks App

You can find a runnning production version of this app in: https://react-tasks-ubiquity.herokuapp.com/

## Run on localhost

To run this app in your localhost simply clone the app, run two different terminals:

### 1. Terminal for server folder

Follow these commands:
  - cd server && npm install
  - npm run dev
  
### 2. Terminal for client folder

Follow these commands:
  - cd client && npm install
  - npm start
  
### Database connection

You need to establish a connection to a database if you would like to run this locally and get it's full functionality. I made use of MongoDB database, if you do the same all you need to do is add your database connect link to a variable called "DB_CONNECT" to a .env file in the server folder.
Your link will probably look something like this: mongodb+srv://<user_name>:<your_password>@cluster0.jtebz.mongodb.net/<database_name>?retryWrites=true&w=majority
