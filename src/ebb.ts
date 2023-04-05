const handler = require('./handler');

import {
  ExpressButBadResponse,
  ExpressButBadRequest,
  App,
  method,
  Handlers,
  MiddlewareCallback,
  Callback
} from './types';

const HTTP_METHODS: method[] = ['GET', 'POST', 'PUT', 'DELETE'];

class MiddlewareError extends Error { };

export default () => {
  const handlers: Handlers = new Map();
  const middlewares: MiddlewareCallback[] = [];

  const requestHandler = handler(handlers, middlewares);

  const app: App = async function (req: ExpressButBadRequest, res: ExpressButBadResponse) {
    requestHandler(req, res);
  };

  // Middleware
  app.use = (middleware: MiddlewareCallback) => {
    if (typeof middleware !== 'function') {
      throw new MiddlewareError('Middleware must be a function');
    }
    middlewares.push(middleware);
  };

  // HTTP method handlers
  HTTP_METHODS.forEach(method => {
    app[method.toLowerCase()] = (path: string, callback: Callback) => {
      handlers.set(`${method}#${path}`, {
        callback,
        method
      });
    };
  });

  return app;
};
