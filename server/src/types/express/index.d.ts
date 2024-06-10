import 'express';

declare module 'express' {
  export interface Request {
    user?: any;
  };
  export interface Response {
    sendResponse?: any;
  };
};
