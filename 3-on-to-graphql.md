# On To GraphQL

## 5. What is GraphQL?
- last time made a case for where REST falls short
	1. too many request
	2. highly customized endpoints
	3. overfetching data (entire company when only need name)
- GraphQL solves these issues in a timely way
- last time we focused on current user, then branched out to their friends, then to their friends' companies
- instead swap for a **graph**
	- **nodes**
	- relations between nodes known as **edges**
	- key for understanding how GraphQL works
	- doesn't mean changing db (still use your fav)
- now our data isn't one user's friends, but data edging from a bunch of users
	- organize users by id
	- query starting from e.g. 23 to find all their friends' companies
	- how would you ask this question?
	1. find user with id 23
	2. find all friends of user with id 23
	3. find the company associated with each of those friends
- notice what we did:
	1. select a very particular record
	2. then crawl through associated records
- actual syntax (don't worry about understanding syntax just yet):
```
query {
	user(id: "23") {
		friends {
			company {
				name
			}
		}
	}
}
```


## 6. Working with GraphQL
- that was a broad overview of using queries to ask questions about data in a graph
- since we can freely walk through relations without URLs, it solves some REST problems
- GraphiQL is an app for devs to understand how GraphQL works and executing queries
- let's make a test:
	1. db
	2. Express app
	3. GraphiQL
1. create a project dir
2. `npm install --save express express-graphql graphql lodash`
	- `express-graphql` allows express to know about and work with GraphQL
	- `lodash` has some helpful util funcs
3. in root dir make `server.js`
- started code for exercise in `3-exercises` subfolder for 6

## 7. Registering GraphQL with Express
- now that we put together code to stand up an Express server, we have an HTTP app server
	- Express does HTTP request/response
- add GraphQL complication: is this dealing with GraphQL?
	- if yes, send to GraphQL, get response back to Express, then send back to user
	- if no, respond back to user
- the above makes clear GraphQL is just one discrete component of an app
	- the app can have all other logic and bells and whistles
1. hook up GraphQL in Express
	- include the compatibility layer: `const expressGraphQL = require('express-graphql')`
2. tell the Express app to send queries from endpoint `/graphql` with `app.use()`
	- use `GraphiQL`, which is only a dev tool for testing queries
3. test running the server
	- Error that GraphQL middleware options need a schema
	- so what is this schema?

## 8. GraphQL Schemas
- key word in that error is "middleware"
- `app.use` is how we wire up middleware
	- we hooked up a `graphiql` option
	- but we didn't hook up a schema!
- schema
	- we know that users are associated with a company and position
	- GraphQL doesn't know this
	- so it needs a schema file!
- create a `/schema/` folder and a `schema.js`
- tell it what things have and how they are related
	- we have idea of a user
	- a user has an id and a firstName
	- etc.

## 9. Writing a GraphQL Schema
- this code looks crazy and tough to reproduce
- BUT it's very repetitive
- steps:
	1. import the graphql library (NOT the Express one)
	2. destructure properties
	3. tell our schema about users with a new object `UserType`
		- required to have a `name`
		- required to have a `fields`, extremely important because it tells what properties user has
		- set value of each property in `fields` to an object and fill in a `type` property
		- `type` should be types imported from GraphQL
	4. go back up and import the used types e.g. `GraphQLString`

## 10. Root Queries
- this is where patterns start looking strange
- finding user with id is tough for GraphQL
	- give it a **root query**: an instruction to jump into our data
	- root query is an entry point into our data
- adding to above steps:
	5. declare root query const
	6. give it `name: 'RootQueryType'`
	7. give it some `fields`
		- `type` of the object we're interested in (user)
		- `args` specifying required arguments, like `id`
		- `resolve(parentValue, args)` function
- that resolve is super important because it's where we go into the db and find the actual data
	- so far we've only told the file what the data looks like
	- resolve will reach out and grab data
	- `parentValue` notoriously doesn't get used
	- `args` is an object containing the result of grabbing data with the arguments we requested

## 11. Resolving with Data
- let's start by practicing with hard-coded data
	8. introduce a const with an array of users
	9. require lodash: `const _ = require('lodash');`
	10. in resolve, use lodash to find a user matching that id
- get this ready to test out in client
	11. import `GraphQLSchema`
		- this takes a root query and returns a schema instance
	12. instantiate a new GraphQL Schema at bottom of file, passing in the root query
	13. assign that instance to `module.exports`
	14. import schema over in `server.js`
	15. add schema to the middleware in `app.use`
	16. restart server and navigate to the route to see the GraphiQL interface

## 12. The GraphiQL Toolkit
- this tool is provided by GraphQL Express lib
- left side has area to enter query
- running with the button will show results on the right
- documentation explorer panel populated
	- very useful for understanding application data
	- removes much need to read schema
- schema as 50% of what's happening with GraphQL
- the rest is writing queries
- try getting our user
```
{
	user(id: "23") {
		id,
		firstName,
		age
	}
}
```
- these look like but are not JavaScript
- what it's doing
	- look through users
	- find me a user with `id` of `"23"`
	- once the user is found, return these properties
	- note that values match the expected types defined in the schema
- look at schema side-by-side while running query
	- query is sent to `RootQueryType`
	- the root query found the `user` key (the one we passed) inside of `fields`
	- it looks for id arg
	- it plucks off that object and returns a raw JS object
	- you see that object on the right in the GraphiQL interface
- note we can just get whatever properties we want and avoid overfetching
- what about user that does not exist?
	- just returns an object with `"user": null`
- what if we don't pass the filter?
	- we'll get expected name error (the name of an argument, here id)

## 13. A Realistic Data Source
- 

## 14. Async Resolve Functions
- 

## 15. Nodemon Hookup
- 

## 16. Company Definitions
- 
