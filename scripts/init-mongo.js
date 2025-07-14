print('Starting MongoDB initialization for Eternals Rebirth...');

db = db.getSiblingDB('eternals-rebirth');

print('Using admin user from environment variables');

db.createCollection('players');
db.createCollection('areas');
db.createCollection('items');

print('Created collections');

db.players.createIndex({ userId: 1 }, { unique: true });
db.players.createIndex({ username: 1 });
db.players.createIndex({ currentArea: 1 });
db.players.createIndex({ inCombat: 1 });

db.areas.createIndex({ id: 1 }, { unique: true });
db.areas.createIndex({ name: 1 });

db.items.createIndex({ id: 1 }, { unique: true });
db.items.createIndex({ name: 1 });
db.items.createIndex({ type: 1 });
db.items.createIndex({ subType: 1 });

print('Created indexes');

print('MongoDB initialization completed successfully!');
print('Database: eternals-rebirth');
print('User: admin (root access)');
print('Collections: players, areas, items');
print('Ready for bot connection!');