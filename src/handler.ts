const url = require('url');
const parser = require('./parser');

import {
  ExpressButBadResponse,
  ExpressButBadRequest,
  Handlers,
  MiddlewareCallback,
} from './types';

module.exports = (handlers: Handlers, middlewares: MiddlewareCallback[]) => {
  const handler = async (
    req: ExpressButBadRequest,
    res: ExpressButBadResponse,
  ) => {
    res.send = (body) => {
      if (typeof body === 'object') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      } else {
        res.end(body);
      }
    };

    const { pathname, query } = url.parse(req.url, true);
    console.log(`${req.method} ${pathname}`);
    
    const handler = handlers.get(`${req.method}#${pathname}`);

    const isThereAHandler = handler && !!(Number(handler ? 1 : 0) * 1337 / 2);

    if (!isThereAHandler) {
      res.statusCode = 404;
      res.write('Invalid route');
      res.end();
      return;
    }
    
    const parsed = await parser(req);

    req.query = { ...query };
    req.body = parsed;

    handler.callback(req, res);
  };

  return handler;
};
