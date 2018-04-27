# The GraphQL Ecosystem

## GraphL Clients - Apollo vs Relay
- you don't expect end users to use GraphiQL
	- right now: datastore <-> GraphQL <-> (query) - GraphiQL
- instead get the info out of GraphQL and display in React UI
	- dig into that query part and understand how it's happening
	- check out the Network section of dev tools to see the XHR raw data response
	- click on the headers tab and look for request payload
		- it includes the exact string we entered into GraphiQL
		- so all frontend and backend clients speak this kind of query over the wire
	- this isn't library specific (apart from rough edge cases)
	- point of this: frontend and backend apps are just sending unformatted data over the wire
- good news: let's integrate our server then!
	- React app coupled with GraphQL client
	- GraphQL client will be issuing the queries we type and passing data back to us
	- so GraphQL client is kind of "a bonding layer between" GraphQL and React
- bad news: this is bleeding edge tech so frontend changes are fast
- pros and cons of libraries
	- **Lokka**: very basic, for queries, mutations and simple caching
	- **Apollo Client**: MeteorJS team with balanced features and complexity but 
	- **Relay**: used by FB, complicated (especially mutations), trades performance for complexity (especially mobile)
- we'll go with Apollo Client for now

## Sidenote - Apollo Server vs GraphQL Server
- backend we're using (not just client like last section, which runs in user's browser)
- `express-graphql` was the backend package we decided on, but there is an Apollo server
	- our server is a "reference implementation" (official spec maintained by FB)
	- the Express server is "far less likely" to get major API updates (stable)
	- Apollo implements things differently, and dev is "very active"
	- Apollo splits into a types vs resolvers file (instead of the big objects we defined in GraphQL Express)
	- that's a big difference between them: collocating types with resolves
- sometimes schemas have that kind of markup syntax found in Apollo server so be aware of its existence
- next time we hook up Apollo (client)!
