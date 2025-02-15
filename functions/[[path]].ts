import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as serverBuild from '../build/server';

export const onRequest = createPagesFunctionHandler({
  build: serverBuild as unknown as ServerBuild,
});