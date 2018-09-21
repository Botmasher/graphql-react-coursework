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
- walk through schema already set up in the project
- unlike REST, it's easier to use an interface instead of looking at code directly
  - automatically generated GraphiQL documentation
  - Documentation Explorer panel is great for walking onto a new project
- walk through from the RootQuery down to songs, song and lyric
- existing mutations are also listed for adding song, lyrics, liking lyrics, deleting song
- current goal: add one song and add one lyric to it
  - create mutation to add a song
  - get back the long globally unique id
  - then use `addLyricToSong` to add lyrical content to the song with that id
  - me: NOTE the given setup errs trying to push lyric in `song.js`; rewritten with spread instead of array mutation
```
mutation {
  addSong(title: "Dogs Do Dance") {
    id
  }
}
// then with the returned id
mutation {
  addLyricToSong(songId: "added-song-id", content: "Dihddih doggy is a dog dog diggy") {
    id
  }
}
```
- now write a query to read the new lyrics
  - this is not a mutation so remove the mutation keyword then run a query
```
{
  songs {
    id,
    title,
    lyrics {
      content
    }
  }
}
```
- now go check your mlab database to see the data collection
  - this is a place you can manage records if you make any GraphQL mistakes
  - it's also where you can simply browse through data in your db
- grasp on the relationships in our db
  - we can have many songs
  - each song can have many lyrics associated with it
- now it's time to work on the client side of our app

## Apollo Client Setup
- we'll be wrapping our React app with Apollo provider
- open `index.js` in the Lyrical project's `./client` folder
  - this has the root app component
- the Apollo provider will interact with the store
  - the store communicates directly with the GraphQL server
  - the store is our client-side data for the app
- Apollo store does not care that we are using React
  - we won't need to do much with it other than create it
- Apollo provider takes data from store and injects into React app
  - this is where we will do most of our setup
- import the ApolloClient and ApolloProvider in `index.js`
  - the ApolloClient library is for any framework but we're using it in React
  - note that the `react-apollo` package is the compatability lib
  - ApolloProvider draws heavily on Redux
- create a new ApolloClient: `const client = new ApolloClient({});`
  - caution: the created ApolloClient instance _assumes_ that a `graphql` endpoint is available as set up in the schema
  - double check that the project's `server/schema` does indeed have that endpoint
  - deviating from the assumptions means adding properties to that empty object in `new ApolloClient({})`
- wrap the `Root` component in `ApolloProvider` passing the client attribute
  - this is just a React component that we'll be passing data to as prop
  - the prop we pass it is a reference to the Apollo store
- the way Provider and Client interact will be something we will work to understand
- compared to Relay there's a lot less setup with Apollo

## React Component Design
- review: we're using both Apollo Client and React Apollo libraries
  - keep in mind the differences between them
- try writing a query to fetch a list of songs from the server
- app structure
  - song index page: list the different songs
  - song detail page: give info for a single song
- components
  - a `SongList` component
  - a `SongDetail` component with
    - `LyricList` for all lyrics associated with the song
    - `LyricCreate` component for adding new lyric to song
  - eventually we will want a component for creating a song, too
- so create those components inside a `client/components/` folder
- let's work on a `SongList.js`
  - add the React boilerplate and render a test div
  - import `SongList` in the main `index.js` and render it in the root component
- you should now see your `SongList` showing up in the browser

## GQL Queries in React
- let's now get that list of songs to the user
- checklist to get data into the React component we created
  - [ ] identify data required (which data do we actually need?)
  - [ ] write query in GraphiQL (practice) and in component file
  - [ ] bond query and component
  - [ ] access the data
- checkbox one keeps us from overfetching data
  - this is part of what GraphQL is promising after all
- checkboxes two and three help us create and apply a query
- checkbox four just makes sure we have our data
  - we don't need to do AJAX or any other work
  - GraphQL thanks to Apollo will just let us access data once we have a query
- for our Lyrical app
  - we just need the song titles, nothing about the artists
  - let's write out a query in GraphiQL for those titles
```
{
  songs {
    title
  }
}
```
  - then the query inside our component
  - import `graphql-tag` helper to handle writing queries
```JavaScript
import gql from 'graphql-tag';
...
const query = gql`{
  {
    songs {
      title
    }
  }
}`;
```
- this (called by convention `gql`) will be a major tool for the rest of the course

## Bonding Queries with Components
- so far we have defined a query but nothing is being executed
- now onto steps three and four of the checklist above
- import a helper from React Apollo
  - this bonded our server with the app when we got the provider
  - this is our glue layer, so we'll use it here too
  - use a curried function much like Redux `connect`
```JavaScript
import { graphql } from 'react-apollo';
...
export default graphql(query)(SongList);
```
- this will execute our query once the component is rendered
  - component renders, then
  - query is issued to the backend server, then
  - (server work happens), then
  - query completes, then
  - component rerenders
- where do we access that returned data?
  - it's placed inside the component's `this.props`
  - if we log on first render we can see `this.props.data` that's `undefined`
  - after the query finishes we can see `this.props.data.songs.title`
  - our component shouldn't expect that `data.songs` is always available!
- next we'll move to making sure we can render one song
