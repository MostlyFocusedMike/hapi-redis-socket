const Hapi = require('@hapi/hapi');
const CatboxRedis = require('@hapi/catbox-redis');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    cache: [
        {
            // name: 'my_cache',
            provider: {
                constructor: CatboxRedis,
                options: {
                    partition : 'my_cached_data',
                    host: 'redis',
                    port: 6379,
                    database: 0,
                    // tls: {}
                }
            }
        },
    ],
});

const init = async () => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();