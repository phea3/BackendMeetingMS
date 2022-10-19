const { Expo } = require('expo-server-sdk');

exports.pushNotificationsAsync = (somePushTokens, data) => {
    let expo = new Expo();

    // let somePushTokens = [
    //     'ExponentPushToken[S4Ai_6OMq1PBmXlOaebMxs]',
    // ]

    console.log(somePushTokens)

    let messages = [];
    for (let pushToken of somePushTokens) {

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            body: 'This is a test notification dfasdfsafsa',
            data: data,
        })
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}