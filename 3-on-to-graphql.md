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
- 

## 9. Writing a GraphQL Schema
- 

## 10. Root Queries
- 

## 11. Resolving with Data
- 

## 12. The GraphiQL Toolkit
- 

## 13. A Realistic Data Source
- 

## 14. Async Resolve Functions
- 

## 15. Nodemon Hookup
- 

## 16. Company Definitions
- 
