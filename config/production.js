module.exports = {
  port: 9000,
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: 'vichogent.be',
    port: 40043,
    name: "293731cv",
    username: "293731cv",
    password:"rBXvkVevavEqLSsOJMNn",
    url: 'mysql://293731cv:rBXvkVevavEqLSsOJMNn@vichogent.be:40043/'
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
      expirationInterval: 60 * 60 * 1000*1,//1u
      issuer: 'events.cody.be',
      audience: 'events.cody.be',
    },
  },
};