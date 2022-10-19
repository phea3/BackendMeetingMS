const Team = require('../models/Team');
const User = require('../models/User');

module.exports = {
    Query: {
        getTeam: async (__, args) => {
            try {
                const team = await Team.findById(args.team_Id).exec();

                if (team) {
                    return {
                        message: "Get Team Success!",
                        status: true,
                        data: team
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
        getTeams: async (__, args) => {
            try {
                const teams = await Team.find({ "title": { $regex: args.keyword, $options: 'i' } }).populate('leader').populate('members').exec();
                return {
                    status: true,
                    message: "Get Teams Success!",
                    data: teams
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
        createTeam: async (__, args) => {
            try {
                const team = await new Team(args.input).save();
                if (team)
                    return {
                        message: 'Create Team Success!',
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        deleteTeam: async (__, args) => {
            try {
                const findDelete = await Team.findByIdAndDelete(args.team_Id).exec();
                if (findDelete)
                    return {
                        message: "Delete Team Success!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        updateTeam: async (__, args) => {
            try {
                const findUpdate = await Team.findByIdAndUpdate(
                    args.input.team_Id,
                    {
                        ...args.input,
                        update_At: new Date().toISOString()
                    }
                ).exec();
                if (findUpdate)
                    return {
                        message: "Team Updated!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        assignTeamMember: async (__, args) => {
            try {
                const findDubplicateUser = await Team.findOne({
                    _id: args.team_Id,
                    members: args.user_Id
                }).exec();
                if (findDubplicateUser)
                    return {
                        message: "This User Aready Added!",
                        status: false
                    }
                const findUpdate = await Team.findByIdAndUpdate(
                    args.team_Id,
                    {
                        $push: {
                            members: args.user_Id
                        }
                    }
                ).exec()
                await User.findByIdAndUpdate(
                    args.user_Id,
                    {
                        $push: {
                            teams: args.team_Id
                        }
                    }
                ).exec();

                if (findUpdate) {
                    return {
                        message: "Assign User Success!",
                        status: true
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        assignTeamLeader: async (__, args) => {
            try {

                const findUpdate = await Team.findByIdAndUpdate(
                    args.team_Id,
                    {
                        leader: args.user_Id
                    }
                ).exec()

                if (findUpdate) {
                    return {
                        message: "Assign Leader Success!",
                        status: true
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        removeLeader: async (__, args) => {
            try {
                await Team.findByIdAndUpdate(
                    args.team_Id,
                    {
                        leader: null
                    }
                ).exec()
                const findLeader = await Team.findById(args.team_Id).exec();

                if (findLeader.leader === null) {
                    return {
                        message: "Remove Leader Success!",
                        status: true
                    }
                }
            } catch (error) {

            }
        },
        removeTeamMember: async (__, args) => {
            try {
                await Team.findByIdAndUpdate(
                    args.team_Id,
                    {
                        $pull: {
                            members: args.user_Id
                        }
                    }
                ).exec();
                await User.findByIdAndUpdate(
                    args.user_Id,
                    {
                        $pull: {
                            teams: args.team_Id
                        }
                    }
                ).exec()
                const findTeam = await Team.findOne({
                    _id: args.team_Id,
                    members: args.user_Id
                }).exec();
                if (!findTeam)
                    return {
                        message: "Remove Memmber Success!",
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