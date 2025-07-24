import * as process from 'node:process';


export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
});
