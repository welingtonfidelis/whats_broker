import { EventEmitter } from 'events';
import { createConnection } from 'typeorm';

const databaseConnect = (eventEmitter: EventEmitter) => createConnection().then(() => {
  console.log('💾 Database connected');

  eventEmitter.emit('database:connected', {});
});

export {
  databaseConnect,
};
