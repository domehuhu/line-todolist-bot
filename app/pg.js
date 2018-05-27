'use strict';


module.exports = function (config) {

    const { Client } = require('pg');

    const client = new Client({
      connectionString: config.url,
      ssl: config.ssl,
    });
    
    client.connect().catch(err => {
        console.error(err);
        process.exit(-1);
    });

    return client;
}
