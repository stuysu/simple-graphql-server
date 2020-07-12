const { ApolloServer, gql } = require('apollo-server');

// Imagine this is a database table
const users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@stuysu.org"
    }
];

// Imagine this is a database table
const hobbies = [
    {
        id: 1,
        userId: 1,
        name: "swimming",
        frequency: "once a week"
    },
    {
        id: 2,
        userId: 1,
        name: "photography",
        frequency: "once a month"
    },
];

// Exclamation mark after something means it's required
const typeDefs = gql`
    type User {
        id: Int!
        name: String!
        email: String!
        
        # The hobbies property is an array of Hobby objects
        hobbies: [Hobby]!
    }
    
    type Hobby {
        name: String!
        frequency: String!
        
        # This property is the user the hobby belongs to
        user: User
    }
    
    type Query {
        getUser(email: String!): User
        getHobby(id: Int!): Hobby
    }
    
    type Manipulation {
        addUser(name: String!, email: String!): User
        addHobby(userId: Int!, name: String!, frequency: String!): Hobby
    }
`;
const resolvers = {
    User: {
        hobbies: (user) => {
            return hobbies.filter(hobby => hobby.userId === user.id);
        }
    },
    Hobby: {
        user: (hobby) => {
            return users.find(user => user.id === hobby.userId);
        }
    },
    Query: {
        getUser: (root, params, context) => {
            const email = params.email;
            return users.find(user => user.email === email);
        },
        getHobby: (root, params, context) => {
            const id = params.id;
            return hobbies.find(hobby => hobby.id === id);
        }
    },
    Manipulation: {
        addUser: (root, params, context) => {
            const {name, email} = params;
            const id = users.length;

            const newUser = {
                id,
                name,
                email
            };
            users.push(newUser);

            return newUser;
        },
        addHobby: (root, params, context) => {
            const {userId, name, frequency} = params;
            const id = hobbies.length;

            const newHobby = { id, userId, name, frequency };
            hobbies.push(newHobby);
            return newHobby;
        }
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.listen(3001).then(() => console.log("listening on port 3001"));