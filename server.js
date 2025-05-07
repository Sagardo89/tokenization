const Fastify = require('fastify');
const tokenRoutes = require('./src/routes/tokenRoutes');

const fastify = Fastify({ logger: true });

fastify.register(tokenRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
