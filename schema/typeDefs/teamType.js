const { gql } = require("apollo-server-express");
module.exports = gql`
  scalar DataTime
  type Team {
    _id: ID
    title: String
    description: String
    image_name: String
    image_src: String
    create_At: DataTime  
    update_At: DataTime 
    leader: User
    members: [User]
  }
  type teamMessage {
    status: Boolean
    message: String
  }
  type getTeamMessage {
    status: Boolean
    message: String
    data: Team
  }
  type getTeamsMessage {
    status: Boolean
    message: String
    data: [Team]
  }
  # Input Types 
  input createTeamInput {
    title: String
    description: String
    image_name: String
    image_src: String
  }
  input updateTeamInput {
    team_Id: String
    title: String
    description: String
    image_name: String
    image_src: String
  }
  type Query {
    getTeam(team_Id: String!): getTeamMessage!  
    getTeams(keyword: String!): getTeamsMessage!
    }
  type Mutation {
    createTeam(input: createTeamInput!): teamMessage!
    deleteTeam(team_Id: String!): teamMessage!
    updateTeam(input: updateTeamInput!): teamMessage!
    assignTeamLeader(team_Id: String!,user_Id: String!): teamMessage!
    assignTeamMember(team_Id: String!,user_Id: String!): teamMessage!
    removeLeader(team_Id: String!): teamMessage!
    removeTeamMember(team_Id: String!,user_Id: String!): teamMessage!
  }
  `;