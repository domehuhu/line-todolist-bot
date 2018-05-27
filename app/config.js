'use strict';

module.exports = function (env) {

    function toBool(value) {
        return ["no", "off", "false"].indexOf(value) < 0 && value !== false;
    }

    const config = {
        server: {
            port: env.PORT || 5000
        },
        line: {
            fakeMiddleware: toBool(env.LINE_FAKE_MIDDLEWARE),
            channelAccessToken: env.LINE_BOT_CHANNEL_TOKEN,
            channelSecret: env.LINE_BOT_CHANNEL_SECRET
        },
        pg: {
            url: process.env.DATABASE_URL,
            ssl: toBool(process.env.DATABASE_SSL)
        }
    }

    return config;
}