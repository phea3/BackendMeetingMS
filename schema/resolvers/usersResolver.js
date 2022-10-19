const User = require("../models/User");
const ExpoToken = require("../models/ExpoToken");
// const Shareholder = require('../models/Shareholder');
const { authCheck } = require("../../helpers/auth");
const { auth } = require("../../config/firebaseConfig");
const mongoose = require("mongoose");

const userLabels = {
  docs: "users",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalDocs",
  totalPages: "totalPages",
};

module.exports = {
  Query: {
    getUser: async (__, args) => {
      try {
        const user = await User.findById(args.user_Id).exec();
        if (user)
          return {
            message: "Get User Success!",
            status: true,
            data: user,
          };
      } catch (error) {
        return {
          message: error.message,
          status: false,
          data: null,
        };
      }
    },
    getUsersWithPagination: async (__, args) => {
      const options = {
        page: args.page || 1,
        limit: args.limit || 10,
        customLabels: userLabels,
        sort: {
          createdAt: -1,
        },
      };
      const query = {
        $or: [{ user_name: { $regex: args.keyword, $options: "i" } }],
      };
      const users = await User.paginate(query, options);

      return users;
    },
    getUserLoginMobile: async (__, args, { req }) => {
      const currentUser = await authCheck(req);
      // console.log(args.token,'hvhghf')
      try {
        const user = await User.findOne({ mail: currentUser.email });

        if (!args.token)
          return {
            message: "Token is required",
            status: false,
            data: null,
          };

        if (!user)
          return {
            message: "Cannot Find User!",
            status: false,
            data: null,
          };

        let tokens = [...user.expo_Token];

        if (!user.expo_Token.includes(args.token)) {
          tokens = [...user.expo_Token, args.token];
        }

        const findUserToUpdate = await User.findOneAndUpdate(
          { mail: currentUser.email },
          { expo_Token: tokens }
        ).exec();
        console.log(findUserToUpdate);
        if (findUserToUpdate)
          return {
            message: "Get User Success!",
            status: true,
            data: findUserToUpdate,
          };
        if (!findUserToUpdate)
          return {
            message: "Cannot Find User!",
            status: false,
            data: null,
          };
      } catch (error) {
        return {
          message: error.message,
          status: false,
          data: null,
        };
      }
    },
  },
  Mutation: {
    logoutLoginUser: async (__, args,{req}) => {
        const currentUser = await authCheck(req);
        console.log(args.token,'log ot')
        try {
            const user = await User.findOne({mail:currentUser.email});

            if (!args.token)
                return {
                    message: "Token is required",
                    status: false,
                    data: null,
                };

            if (!user)
                return {
                    message: "Cannot Find User!",
                    status: false,
                    data: null,
                };

            let tokens = user.expo_Token.filter(e => e!== args.token)

            console.log(user.expo_Token,'curretn toen')
            console.log(tokens,'filterd')

            const findUserToUpdate = await User.findOneAndUpdate(
                { mail: currentUser.email },
                { expo_Token: tokens }
            ).exec();
                
            if (!findUserToUpdate)
                return {
                    message: "Cannot Find User!",
                    status: false,
                    data: null,
                };

            return {
                message: "Logout User Success!",
                status: true,
                data: null,
            };
        } catch (error) {
            return {
                message: error.message,
                status: false,
                data: null,
            };
        }
    },
    createUser: async (__, args) => {
      const uuid = mongoose.Types.ObjectId();
      const { user_name, mail, password, image_name, image_src, position } =
        args.input;
      try {
        if (user_name == "")
          return {
            status: false,
            message: "Please fill a valid username!",
            data: null,
          };
        if (mail == "")
          return {
            status: false,
            message: "Please fill a valid mail!",
            data: null,
          };
        if (password == "")
          return {
            status: false,
            message: "Please fill a valid password!",
            data: null,
          };

        if (password.length < 8)
          return {
            status: false,
            message:
              "The password must be a string with at least 6 characters!",
            data: null,
          };

        const user = await new User({
          user_name,
          mail,
          image_name,
          image_src,
          position,
          _id: uuid.toString(),
        }).save();
        if (user)
          await auth
            .createUser({
              uid: uuid.toString(),
              email: mail,
              password,
            })
            .catch((error) => {
              console.log("Error creating new user:", error);
            });
        return {
          message: "User Created!",
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    deleteUser: async (__, args) => {
      try {
        const deleteUser = await User.findByIdAndDelete(args.user_Id).exec();
        if (deleteUser)
          await auth
            .deleteUser(args.user_Id)
            .then(() => {
              console.log("Successfully deleted user");
            })
            .catch((error) => {
              console.log("Error deleting user:", error);
            });
        return {
          message: "Delete User Success!",
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },

    updateUser: async (__, args) => {
      try {
        const updateUser = await User.findByIdAndUpdate(args.input.user_Id, {
          user_name: args.input.user_name,
          image_name: args.input.image_name,
          image_src: args.input.image_src,
          position: args.input.position,
        });
        if (updateUser)
          return {
            message: "Update User Success!",
            status: true,
          };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
  },
};
