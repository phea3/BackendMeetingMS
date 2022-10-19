const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar DataTime
    type User{
      _id: ID
      user_name: String
      mail: String
      position: String
      image_name: String
      image_src: String
      expo_Token: [String]
      create_At: DataTime  
      update_At: DataTime 
      status: Boolean
      teams: [Team]
    }
    type userMessage {
      status: Boolean
      message: String
    }

    type getUsersMessage{
      status: Boolean
      message: String
      data: [User]
    }
    type getUserMessage{
      status: Boolean
      message: String
      data: User
    }
    type Paginator {
        slNo: Int
        prev: Int
        next: Int
        perPage: Int
        totalPosts: Int
        totalPages: Int
        currentPage: Int
        hasPrevPage: Boolean
        hasNextPage: Boolean
        totalDocs:Int
    }
    type getUsersPaginatorMessage {
        users:[User]
        paginator:Paginator
        message: String
    }
    # Token Type
    type ExpoToken{
      _id: ID
      token: String
    }
    # Input Types 
    input createUserInput{
      user_name: String!
      mail: String!
      password: String!
      image_name: String!
      image_src: String!
      position: String!
    }
    input updateUserInput{
      user_Id: String
      user_name: String!
      image_name: String!
      image_src: String!
      position: String!
    }
    
    type Query {
      getUsersWithPagination(page: Int!,limit: Int!,keyword: String!): getUsersPaginatorMessage!
      getUser(user_Id: String!): getUserMessage!
      getUserLoginMobile(token: String!): getUserMessage!
    }
    type Mutation {
      logoutLoginUser(token: String!): getUserMessage!
     createUser(input: createUserInput!): userMessage!
     deleteUser(user_Id: String!): userMessage!
     updateUser(input: updateUserInput!): userMessage!    
    #  createExpoToken(e) 
    }
  
`;
