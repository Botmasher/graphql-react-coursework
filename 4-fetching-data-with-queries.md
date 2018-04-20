# Fetching Data with Queries

## 17. Nested Queries
- add in idea of a company type to schema
- above user type (important to take order of definition into account!)
```JavaScript
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type GraphQLString }
	}
});
```
- first time working in schema it's funny to have all these types
- eventually you realize it's the same code over and over
- associate company with user
	- treat associations between types just like it's another field!
	- so user with company property is added as field on user
	- imagine the other behind-the-scenes GraphQL built in types have the same kind of structure
```JavaScript
const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		...
		company: {
			type: CompanyType
		}
	}
});
```

## 18. More on Nested Queries
- relating companies with users after creating company field on user type
- next add a resolve so that GraphQL knows how to get a company for a given user
	- this is all about teaching GraphQL how to take a user with an id
	- then walk over to a specific company
- notice we're calling it `company` on the user instead of `companyId` like we said earlier
	- why can we get away with that?
	- assume the `companyId` is coming from real outside data
	- when user model property is same as user type field, nothing needs done
	- _but_ when property names are different, `resolve()` to teach GraphQL how to get the data
- use `resolve()` to fetch that companyId that you renamed
```JavaScript
...
	company: {
		type: CompanyType,
		resolve(parentValue, args) {
			console.log(parentValue, args);
		}
	}
```
- run the query in GraphiQL
- now run the resolve function by asking for the company
	- GraphQL won't resolve if we don't ask a question about the company
	- we get a company of `null` (haven't done anything in resolve yet)
	- user has a property `companyId`
	- build a uri and use async get in the resolve to get that id
```JavaScript
resolve(parentValue, args) {
	return axios.get(`http://localhost:3000/company/${parentValue.companyId}`)
		.then(res => res.data);	
}
```
- now in GraphiQL you can ask for the company, even add the name and description
	- try searching for users with other ids
	- check if it's correctly associated and returning data

## 19. A Quick Breather
- first real association is working, but what have we done so far?
- meanwhile in reality (the real data in db)
	- got a user and a company
	- user has properties
	- company does, too
	- a user has a property pointing to a company
- in graphity (the structure we're using to get to our data)
	- have a Root Query type pointing to a user
	- got a user type with a bunch of properties
	- the user points us to a company type
- so far we're unidirectional
	- we can ask what company a user works for
	- we can't ask which users work for a given company
- what happens when we make a query?
	- initially we query for user with an id
	- that goes to a root query with an args object containing that id
	- the root query points to the user id with `resolve(null, { id })`
		- these functions take us from location to location
		- conceptualize those locations on our graph
	- the user wants to know more about the company (userObj, {})
		- user's resolve gets called with parent value
		- the arguments don't get passed down so `args === {}`
		- look at root query to see where you define `args`
		- `resolve()` returns a promise with the company we're looking for
	- schema is really a bunch of functions returning references to other objects in graph
		- think of each edge as a resolve function
		- _or_ think of it as a true graph with nodes (pieces of data with properties, like a user)
		- each is related by a resolve function
	- understand what resolve is doing when it returns data
		- keep using a graph picture and get it ingrained

## 20. Multiple RootQuery Entry Points
- cannot yet just ask for a company because there's no `RootQueryType` field for the company
	- so far only allows going to a user
	- we have to get to a user then a company
- so let's go from a root query directly to a company
	- add to root query `fields`
	- `company` should be sibling to `user`
	- we want the same kind of structure with `args` and a `resolve()`
```JavaScript
...
	company: {
		type: CompanyType,
		args: { id: { type: GraphQLString } },
		resolve(parentValue, args) {
			return axios.get(`http://localhost:3000/companies/${args.id}`)
				.then(resp => resp.data);
		}
	}
```
- remember you will need to refresh your schema
- check terminal for errors

## 21. Bidirectional Relations
- link companies and users the other way
- now that we have company in root query we don't need to ask for user first
- but asking for users of a company will err because we don't have that relationship
```JavaScript
{
	company(id: "1") {
		users {
			firstName
		}
	}
}
```
- fix that we can go from user to company but not company to user
	- every edge going to a vertex needs to be set up manually
	- we should get back a list of many users (company has many users)
- revisit json server and get a list of all users: `localhost:3000/company/1/user`
	- this is the simple json server knowing how to search through keys

## 22. More on Bidirectional Relations
- we can teach `CompanyType` how to go from one company to array of users
	- `type`, `args` and `resolve()`
	- we don't want a `UserType`, we want a `GraphQLList` of users!
	- make sure to grab the list type when destructuring from the required `graphql`
```JavaScript
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: {
		...
		users: {
			type: new GraphQLList(UserType)
		}
	}
});
```
- next add `resolve()`
	- no need for args because we're going right for the users who have this company id
	- we can just work with `parentValue` since that's the current company
```JavaScript
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: {
		...
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data);
			}
		}
	}
});
```
- we get this exception: `ReferenceError: UserType is not defined`
	- what happened?

## 23. Resolving Circular References
- `CompanyType` points to a user but `UserType` is defined below it
	- can't do the opposite because it also points to a company
	- this creates a circular reference in the dependencies
- how to resolve this order of operations problem?
	- instead turn `fields` into an arrow function
	- this function simply returns the object with all the current keys
	- GraphQL will call this function and run, storing those fields
	- this is a workaround for JS using closures
- with that change, queries that get a company's users should work
- try this query: grab a company's users, then each user's company's name
	- this nests the same data getting nested
	- these kinds of circular relations can go as far as we want
	- (keep nesting company's users' company's users' company's users' ...)
- the graph between users <-> companies is now connected

## 24. Query Fragments
-

## 25. Introduction to Mutations
- 

## 26. NonNull Fields and Mutations
- 

## 27. Do It Yourself - Delete Mutation!
-

## 28. Do It Yourself - Edit Mutation!
-
