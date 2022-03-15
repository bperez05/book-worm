const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getAllUsers: async() => {
            return User.find();
        },

        getSingleUser: async (parent, { userId }) => { //find out what gets passed in here when you go around to the front end
            return User.find({_id: userId})
        },

        me: async () => {
            return User.find();
        }
    },

    Mutation: {
      addUser: async(parent, { email, password, username }) => {
        const user = await User.create({ email, username, password });
        const token = signToken(user);
        console.log(token)
        console.log(user)
        if(!token){
            console.log('No token found')
        }

        return  { token, user }
    },
    login: async(parent, { email, password }) => {
        const user = User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('No profile with this email found!');
        }

        const correctPw = await User.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Incorrect password!');
        }
  
        const token = signToken(user);
        return { token, user };

    },
    saveBook: async (parent, args, context) => {
        console.log(args)
        const user = await User.findOneAndUpdate(
            { _id: args.userId },
            {
              $addToSet: { savedBooks: args.input },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          if(!user) {
              console.log('Cannot find user');
          }
          console.log(user);
          return user;
    },
    removeBook: async (parent, args) => {
        return User.findOneAndUpdate(
            { _id: args.userId },
            { $pull: { savedBooks: { bookId : args.bookId } } },
            { new: true }
          );
    }
}
}

module.exports = resolvers