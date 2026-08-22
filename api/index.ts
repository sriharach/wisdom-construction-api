import type { Request, Response } from 'express';
import { createApp } from '../src/main';

let handler: ((request: Request, response: Response) => void) | undefined;

async function getHandler() {
  if (!handler) {
    const app = await createApp();
    await app.init();
    handler = app.getHttpAdapter().getInstance();
  }

  return handler;
}

export default async function apiHandler(
  request: Request,
  response: Response,
) {
  const appHandler = await getHandler();
  appHandler(request, response);
}