import morgan from 'morgan';
import logger from './logger';

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      statusCode: Number(tokens.status(req, res)),
      contentLength: Number(tokens.res(req, res, 'content-length')) || 0,
      duration: Number(tokens['response-time'](req, res)) || 0,
    });
  },
  {
    stream: {
      write: (message: string) => {
        try {
          const data = JSON.parse(message);

          logger.info('HTTP request', data);
        } catch {
          logger.info(message.trim());
        }
      },
    },
  },
);

export default morganMiddleware;
