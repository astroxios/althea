import 'express';

declare module 'express' {
  export interface Response {
    sendResponse?: any;
  }
}
