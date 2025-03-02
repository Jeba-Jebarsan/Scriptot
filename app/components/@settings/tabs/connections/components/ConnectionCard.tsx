import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Buttons';
import { classNames } from '~/utils/classNames';

interface ConnectionCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  isConnected: boolean;
  user?: string | null;
  avatarUrl?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function ConnectionCard({
  title,
  description,
  icon,
  iconColor = 'text-blue-500',
  isConnected,
  user,
  avatarUrl,
  onConnect,
  onDisconnect,
  isLoading,
  children,
}: ConnectionCardProps) {
  return (
    <motion.div
      className="border border-bolt-elements-borderColor rounded-lg p-4 bg-bolt-elements-background-depth-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={classNames(icon, "w-8 h-8", iconColor)} />
          <div>
            <h3 className="text-md font-medium text-bolt-elements-textPrimary">{title}</h3>
            <p className="text-sm text-bolt-elements-textSecondary">{description}</p>
          </div>
        </div>
        
        <div>
          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-white animate-spin mr-1" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          )}
        </div>
      </div>
      
      {isConnected && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-bolt-elements-textSecondary">
              Connected {user ? `as ${user}` : ''}
            </span>
          </div>
        </div>
      )}
      
      {children}
    </motion.div>
  );
} 