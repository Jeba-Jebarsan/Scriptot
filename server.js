import express from 'express';
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.js";

const app = express();

app.use(express.static("public"));

app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  })
);

export const handler = async (event, context) => {
  const requestHandler = createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({
      env: process.env,
    }),
  });

  return requestHandler(event, context);
}; 