import { IncomingMessage, ServerResponse } from 'http';

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

export interface App {
  /**
   * HTTP request handler
   */
  (req: ExpressButBadRequest, res: ExpressButBadResponse): void;
  [key: string]: any;
}

export type Callback = (req: IncomingMessage, res: ServerResponse) => void;

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

export type Handlers = Map<string, Handler>;

export type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MiddlewareCallback = (req: ExpressButBadRequest, res: ExpressButBadResponse) => Boolean;


