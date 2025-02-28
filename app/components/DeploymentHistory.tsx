import { useStore } from '@nanostores/react';
import { netlifyConnection } from '~/lib/services/netlify';
import { chatId } from '~/lib/persistence/useChatHistory';
import { formatDistanceToNow } from 'date-fns';
import type { NetlifyDeployment } from '~/types/netlify';

export function DeploymentHistory() {
  const connection = useStore(netlifyConnection);
  const currentChatId = useStore(chatId);
  const deployedSite = connection.stats?.sites?.find((site) => 
    site.name.includes(`Deepgen-${currentChatId}`)
  );

  if (!deployedSite || !deployedSite.deploys) {
    return null;
  }

  return (
    <div className="p-4 bg-[#0D1117] border border-gray-800 rounded-lg mt-2">
      <h3 className="text-sm font-medium text-white mb-3">Deployment History</h3>
      <div className="space-y-2">
        {deployedSite.deploys.map((deploy: NetlifyDeployment) => (
          <div 
            key={deploy.id} 
            className="flex items-center justify-between p-2 bg-[#161B22] rounded border border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                deploy.state === 'ready' ? 'bg-green-500' : 
                deploy.state === 'error' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`} />
              <div>
                <p className="text-sm text-white">
                  {`Deployment ${deploy.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(deploy.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <a
              href={deploy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#58a6ff] hover:underline"
            >
              View deployment →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 