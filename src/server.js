const Hapi = require('@hapi/hapi');
const CatboxRedis = require('@hapi/catbox-redis');
const Hoek = require('hoek');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    cache: [
        {
            name: 'my_cache',
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

const start = async () => {
    const add = async (a, b) => {
        await Hoek.wait(1500);   // Simulate some slow I/O
        return Number(a) + Number(b);
    };

    const sumCache = server.cache({
        cache: 'my_cache',
        expiresIn: 10 * 1000,
        segment: 'customSegment',
        generateFunc: async (id) => {
            console.log('id: ', id);
            return add(id.a, id.b);
        },
        generateTimeout: 2000
    });

    server.route({
        path: '/add/{a}/{b}',
        method: 'GET',
        handler: async function (request, h) {

            const { a, b } = request.params;

            const id = `ham`;

            return await sumCache.get({ id, a, b });
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();

