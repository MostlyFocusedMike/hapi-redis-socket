const Hapi = require('@hapi/hapi');
const CatboxRedis = require('@hapi/catbox-redis');
const Hoek = require('hoek');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    cache: [
        {
            name: 'outline_cache',
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
    const outlineCache = server.cache({
        cache: 'outline_cache',
        expiresIn: 10 * 1000,
        segment: 'outlineSegment',
        // generateFunc: async (outline) => {
        //     return {
        //         outlineId: outline.id,
        //         status: 'publishing'
        //     };
        // },
        // generateTimeout: 4000
    });

    server.route({
        path: '/show/{id}',
        method: 'GET',
        handler: async function (request, h) {

            const { id } = request.params;
            const outlineStatus = await outlineCache.get({ id })
            return outlineStatus || 'na';
        }
    });

    server.route({
        path: '/set/{id}',
        method: 'GET',
        handler: async function (request, h) {

            const { id } = request.params;

            await outlineCache.set(id, {
                outlineId: id,
                status: 'done'
            }, 5 * 1000);

            return "OK";
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();



// const start = async () => {
//     const add = async (a, b) => {
//         await Hoek.wait(3000);   // Simulate some slow I/O
//         return Number(a) + Number(b);
//     };

//     server.method('sum', add, {
//         cache: {
//             cache: 'my_cache',
//             expiresIn: 10 * 1000,
//             generateTimeout: 4000
//         }
//     });

//     server.route({
//         path: '/add/{a}/{b}',
//         method: 'GET',
//         handler: async function (request, h) {

//             const { a, b } = request.params;
//             return await server.methods.sum(a, b);
//         }
//     });

//     await server.start();

//     console.log('Server running at:', server.info.uri);

// };

// start();

