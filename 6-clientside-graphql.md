# Clientside GraphQL

## The Next App
- the first section was about backend
- now let's concentrate on frontend
  - this app will use a cloned server
  - the backend code will follow all the conventions we already went through
- the final app will do full spectrum from frontend to backend
- first pull down section 2 starter project code
  - https://github.com/StephenGrider/Lyrical-GraphQL.git
- then run `npm install` inside that directory

## Starter Pack Walkthrough
- check out the project structure
  - splits client from backend server
  - backend is still GraphQL
  - schema folder lacks much code
  - schema is four files in the schema directory to separate out functionality
- application description
  - songwriting application
  - list out a bunch of songs
  - each song has song detail page
  - song detail page shows collection of lyrics
  - it's collaborative, so users can type next song line
  - on submit users upvote individual lines
- not shown: back button or add buttons, which we can figure out later
- architecture of backend
  - still Express
  - still GraphQL serving to browser
  - Webpack server already wired together for shipping React to browser
  - storage is a real MongoDB database (instead of that fake JSON server)
    - we'll set this up hosted on MongoLab
    - free sandbox option
    - you can setup MongoDB on your local machine but it's more involved
  - there's a place on `server.js` to stick our `MONGO_URI` once we sign up

## MongoLab Setup
- visit mlab.com and create an account
1. create a new db
2. choose a cloud provider
  - we'll do AWS
3. choose sandbox
4. choose closest server
5. name your db
  - we'll call it `lyricaldb`
- now you can select your db and get the uri
  - notice you need a user and password
  - assign users to the db
  - click add a database user
  - make sure new user permissions are not read only
- go back to `server.js`
  - paste uri into mblab instance
  - start server using `npm run dev`
  - visit `localhost:4000` and visit `graphql` endpoint

## Working Through the Schema
-

## Apollo Client Setup
-

## React Component Design
-

## GQL Queries in React
-

## Bonding Queries with Components
-
