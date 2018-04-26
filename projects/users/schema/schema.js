const graphql = require('graphql');
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const users = [
	{ id: '23', firstName: 'J', age: 30 },
	{ id: '24', firstName: 'Tsag', age: 100 }
];

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/company/${parentValue.id}/user`)
					.then(res => res.data);
			}
		}
	})
});

const HobbyType = new GraphQLObjectType({
	name: 'Hobby',
	fields: () => ({
		id: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/hobby/${parentValue.id}/user`)
					.then(res => res.data);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		},
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/company/${parentValue.companyId}`)
					.then(res => res.data);	// the company object with this company.id
			}
		},
		hobby: {
			type: HobbyType,
			resolve (parentValue, args) {
				return axios.get(`http://localhost:3000/hobby/${parentValue.hobbyId}`)
					.then(res => res.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/user/${args.id}`)
					.then(response => response.data);
			}
		},
		company: {
			type: CompanyType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/company/${args.id}`)
					.then(response => response.data);
			}
		},
		hobby: {
			type: HobbyType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/hobby/${args.id}`)
					.then(response => response.data);
			}
		}
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLString) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post(`http://localhost:3000/user`, { firstName, age })
					.then(res => res.data);
			}
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				axios.delete(`http://localhost:3000/user/${id}`)
					.then(res => res.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString },
				hobbyId: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/user/${args.id}`, args)
					.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});
