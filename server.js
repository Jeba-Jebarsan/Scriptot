import express from 'express';
import { createRequestHandler } from "@remix-run/express";
import { createRequestHandler as netlifyRequestHandler } from "@remix-run/netlify";
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

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (event) => ({
    env: process.env,
    context: event.context
  })
}); 