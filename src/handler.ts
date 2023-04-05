const url = require('url');
const parser = require('./parser');

import { IncomingMessage, ServerResponse } from "http";

type Callback = (req: IncomingMessage, res: ServerResponse) => void;

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const HTTP_METHODS: method[] = ['GET', 'POST', 'PUT', 'DELETE'];

interface Handler {
  /**
   * Callback function to be called when the route is matched
   */
  callback: Callback;

  /**
   * HTTP method
  */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ExpressButBadResponse extends ServerResponse {
  /**
   * Send a response to the client
   */
  send: (body: any) => void;
}

export interface ExpressButBadRequest extends IncomingMessage {
  /**
   * Query string parsed as an object.
  */
  query: { [key: string]: any };

  /**
   * Parsed request chunks
   */
  body: { [key: string]: any } | string;
}

interface App {
  /**
   * HTTP request handler
   */
  (req: ExpressButBadRequest, res: ExpressButBadResponse): void;
  [key: string]: any;
}

export default () => {
  const handlers = new Map<string, Handler>();
  const app: App = async function (req: ExpressButBadRequest, res: ExpressButBadResponse) {
    res.send = (body) => {
      if (typeof body === 'object') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      } else {
        res.end(body);
      }
    };

    const { pathname, query } = url.parse(req.url, true);
    const handler = handlers.get(`${req.method}#${pathname}`);

    if (handler) {
      req.query = { ...query };
      console.log(`${req.method} ${pathname}`);
      const parsed = await parser(req);
      req.body = parsed;
      handler.callback(req, res);
    } else {
      res.statusCode = 404;
      res.write('Invalid route');
      res.end();
    }
  };


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
