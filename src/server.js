import Hapi, { server } from '@hapi/hapi';
import * as admin from 'firebase-admin';
import routes from './routes';
import { db } from './database';
import credentials from '../credentials.json';

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

// var server;

const start = async() => {
    var server = Hapi.server({
        port: 8000,
        host: 'localhost',
    });

    routes.forEach(routee => server.route(routee));

    db.connect();
    await server.start();
    console.log(`Server is listening on ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', async() => {
    console.log('Stopping server....');
    await server.stop({ timeout: 10000 });
    db.end();
    console.log('Server Stopped');
    process.exit(0);
})

start();