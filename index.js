const { ApolloServer, gql } = require('apollo-server');
const { users, hobbies } = require("./models");

// How to use includes
users.findOne({
    where: {
        id: 1
    },
    include: {
        model : hobbies
    }
}).then(console.log);

// Exclamation mark after something means it's required
const typeDefs = gql`  
    type User {
        id: Int!
        name: String
        greeting: String
        email: String
    }
    
    type Query {
        user(id: Int!): User
    }
    
    type Mutation {
        addUser(name: String!, email: String!): User
    }
    
`;



const asyncHello = () => {
    return new Promise(resolve => {
       setTimeout(() => resolve("Hello"), 1500);
    });
};


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers:{
        Query: {
            user: (parent, args, context) => {

                return users.findOne({
                    where: {
                        id: args.id
                    }
                })
            }
        },
        User: {
            greeting: (user, args, context) => {
                return `Hello ${user.name}`;
            }
        },
        Mutation: {
            addUser(parent, {name, email}, ) {
                return users.create({
                    name, email
                });
            }
        }
    },
    context: (context) => {
        return {request: context.req};
    }
});

apolloServer.listen(3001).then(() => console.log("listening on port 3001"));