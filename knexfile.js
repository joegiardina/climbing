const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: 'data.db',
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
  },
};
