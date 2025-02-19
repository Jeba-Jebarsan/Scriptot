import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

// @ts-ignore - Server build is generated at runtime
import * as serverBuild from '../build/server/index.js';

export const onRequest = createPagesFunctionHandler({
  build: serverBuild as unknown as ServerBuild,
});
