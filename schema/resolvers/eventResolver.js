const Event = require('../models/Event');
const moment = require('moment');
const { PubSub } = require("graphql-subscriptions");
const { pushNotificationsAsync } = require('../../util/fn')
const schedule = require('node-schedule');
const pubsub = new PubSub();

module.exports = {
    Query: {
        getEvent: async (__, args) => {
            try {
                const event = await Event.findById(args.event_Id).populate('create_By').populate('chairman').populate('participants.user_Id').exec();
                if (event)
                    return {
                        message: "Get Event Success!",
                        status: true,
                        data: event
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getEventByDate: async (__, args) => {
            try {
                const events = await Event.find({
                    date: { $eq: args.date }
                }).populate('chairman').populate('create_By').populate('participants.user_Id').exec();
                if (events.length != 0) {
                    return {
                        message: "Get Events Success!",
                        status: true,
                        data: events
                    }
                } else {
                    return {
                        message: "No EventS",
                        status: false,
                        data: null
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getNotification: async (__, args) => {
            try {
                const getEvents = await Event.find(
                    {
                        $or: [{ 'chairman': args.user_Id }, { 'participants.user_Id': args.user_Id }]
                    }
                ).populate('chairman').populate('create_By').populate('participants.user_Id').exec();

                return {
                    message: "Get Success!",
                    status: true,
                    data: getEvents
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        }
    },
    Mutation: {
        createEvent: async (__, args) => {
            let somePushTokens = [];
            // const dateSame = new Date('2022-06-11T14:12:00.000+07:00')
            // schedule.scheduleJob(dateSame, () => console.log("Noterh"))
            // console.log(args.input.participants)
            try {
                const event = await new Event({
                    ...args.input,
                    date: moment(args.input.date).tz("Asia/Phnom_Penh").format(),
                    start_Time: args.input.date + "T" + args.input.start_Time + ":00+07:00",
                    end_Time: args.input.date + "T" + args.input.end_Time + ":00+07:00"
                }
                ).save().then((sub) =>
                    sub.populate('chairman')
                );
                // console.log(event.chairman.expo_Token);
                // pushNotificationsAsync(somePushTokens, event)
                if (event) {
                    somePushTokens = [...event.chairman.expo_Token];
                    pushNotificationsAsync(somePushTokens, event)
                }
                if (event)
                    return {
                        message: "Create Event Success!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }

        },
        updateEvent: async (__, args) => {
            try {
                const getUpdate = await Event.findByIdAndUpdate(
                    args.input.event_Id,
                    args.input
                ).exec();
                if (getUpdate)
                    return {
                        message: 'Event Updated!',
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        deleteEvent: async (__, args) => {
            try {
                await Event.findByIdAndDelete(args.event_Id).exec();
                const findEvent = await Event.findById(args.event_Id).exec();
                if (!findEvent)
                    return {
                        message: "The Event Has Delete!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        }
    }
}