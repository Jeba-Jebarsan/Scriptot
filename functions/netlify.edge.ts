import { createRequestHandler } from "@remix-run/cloudflare";
import type { ServerBuild } from "@remix-run/cloudflare";
import * as build from "../build/server";

export default createRequestHandler(build as unknown as ServerBuild);