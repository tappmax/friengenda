const loadConfig = require("./build/config").loadConfig;
const config = loadConfig();
const connection = {
  host : config['DatabaseHost'],
  port : config['DatabasePort'],
  user : config['DatabaseUsername'],
  password : config['DatabasePassword'],
  database : config['DatabaseName']
}

module.exports = {

  test: {
    client: 'postgresql',
    connection: connection,
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  },

  development: {
    client: 'postgresql',
    connection: connection,
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  },

  production: {
    client: 'postgresql',
    connection: connection,
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  }

};
