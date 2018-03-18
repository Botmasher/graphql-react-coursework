# A REST-ful Routing Primer

## 3. Review of REST-ful Routing
- GraphQL and Relay were designed for solving *very specific* problems
- **REST-ful routing**: set of conventions used in web dev for manipulating data hosted on server
	- rules around HTTP request for CRUD data on server
	- these are conventions
	- not hardcoded
- practical example: UI to create blog posts
	- can read, edit, delete a post
	- so REST-ful routing is the kind of request used when doing those things: the method and the URL
- generalizing the rules
	- `<name>/(:id) VERB` for manipulating all resources or a single resource
- what would these URLs look like if I wanted all the posts associated with a user?
	- we'd have maybe a list of users with posts
	- now I'd nest `users/:id/posts/:id`
	- following conventions, I'd have those URLs and then actions on them
- the above nesting gets weird when extended further

## 4. Shortcomings of RESTful Routing
- heavily nested or related data stretches REST-ful rules to produce complex URLs
- example: list of contacts on a social media site
	- displayed in UI as boxes with username, position, company
	- how in relational db is this stored?
		- user model with name, img, company_name, position_name
		- NO, as it's not obvious to get things like all company names
		- alternative: relations for User, Company, Position (User points to Company and Position)
	- ok, now produce a RESTful route and HTTP methodology for getting:
		- current user
		- current user's friends
		- current user's friends' positions and companies
	- RESTful options for above:
		1. `users/1/companies`, then `users/2/companies`, ...
			- LOTS of requests just to get this data
		2. `users/23/friends/companies` and `users/23/friends/positions`
			- theoretically realistic
			- very customized endpoint (imagine programming routes like this all over your app)
		3. `users/23/friends_with_companies`
			- VERY customized endpoint to fetch all the associated friends and their companies
			- DEFINITELY breaks RESTful conventions
- so are there no good options?
- the conventions break down when we work with "highly related data"
	1. either demand lots of requests
	2. or demand lots of very customized endpoints
- also consider we'd be returning an entire company model just for showing friend's company
	- all we care about is the company name!
	- *overserving* data back to client becomes an issue
- GraphQL wants to solve these challenges by serving custom, related data and not overserving
