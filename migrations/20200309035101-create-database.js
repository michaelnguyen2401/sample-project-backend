module.exports = {
  async up(db, client) {
    const dbname = process.env.DB_NAME || 'simple_db';
    const simpleDb = client.db(dbname);
    await simpleDb.addUser('foobar', 'foobarPassword',
      {
        roles: [
          { role: 'readWrite', db: dbname },
          { role: 'readWriteAnyDatabase', db: 'admin' },
        ],
      });
    await simpleDb.createCollection('users');
    await simpleDb.createCollection('messages');
    await simpleDb.createCollection('test');
  },

  async down(db, client) {
    const simpleDb = client.db(process.env.DB_NAME || 'simple_db');
    await simpleDb.removeUser('foobar');
    await simpleDb.dropDatabase();
  },
};
