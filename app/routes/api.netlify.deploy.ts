import { type ActionFunctionArgs, json } from '@remix-run/cloudflare';
import crypto from 'crypto';

interface NetlifySiteInfo {
  id: string;
  name: string;
  url: string;
  chatId: string;
}

interface DeployRequestBody {
  siteId?: string;
  files: Record<string, string>;
  chatId: string;
}

export async function action({ request }: ActionFunctionArgs) {
  // ... your provided code ...
} 