const graphql = require('graphql');
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

const users = [
	{ id: '23', firstName: 'J', age: 30 },
	{ id: '24', firstName: 'Tsag', age: 100 }
];

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		}
	}
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
		}
	}
});

module.exports = new GraphQLSchema({ query: RootQuery });
