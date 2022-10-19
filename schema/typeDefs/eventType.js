const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DataTime
  type Event {
    _id: ID
    title: String
    chairman: User
    description: String
    start_Time: DataTime
    end_Time: DataTime
    create_By: User
    approve: String
    venue: String
    date: DataTime
    participants: [Participant]
    topics: [Topic]
  }
  type Topic {
    _id: ID
    title: String
    notes: String
  }
  type Participant {
    user_Id: User
    accept: Boolean
  }
  type eventMessage {
    status: Boolean
    message: String
  }
  type getEventMessage {
    status: Boolean
    message: String
    data: Event
  }
  type getEventsMessage {
    status: Boolean
    message: String
    data: [Event]
  }
  #Input 
  input createEventInput {
    title: String!
    chairman: String!
    description: String!
    start_Time: DataTime!
    end_Time: DataTime!
    create_By: String!
    venue: String!
    date: DataTime!
    participants: [inputParticipant]
    topics: [inpuTopic]
  }
  input updateEventInput {
    event_Id: String!
    title: String!
    chairman: String!
    description: String!
    start_Time: DataTime!
    end_Time: DataTime!
    create_By: String!
    venue: String!
    date: DataTime!
    participants: [inputParticipant]
    topics: [inpuTopic]
  }
  input inpuTopic{
    title: String
  }
  input inputParticipant{
    user_Id: String
  }
  type Query {
    getEvent(event_Id: String!): getEventMessage!
    getEventByDate(date: String!): getEventsMessage!
    getNotification(user_Id: String): getEventsMessage!
  }
  type Mutation {
    createEvent(input: createEventInput!): eventMessage!
    updateEvent(input: updateEventInput!): eventMessage!
    deleteEvent(event_Id: String!): eventMessage!
  }
`