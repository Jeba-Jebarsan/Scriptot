import { atom } from 'nanostores';

export interface DeploymentState {
  isDeploying: boolean;
  isBuildReady: boolean;
  error: string | null;
  buildError?: {
    message: string;
    output?: string;
    details?: {
      type: string;
      module?: string;
      message?: string;
      solution?: string;
    };
  } | null;
  timeoutAt?: number;
}

export const deploymentState = atom<DeploymentState>({
  isDeploying: false,
  isBuildReady: false,
  error: null,
  buildError: null,
  timeoutAt: undefined
});

export const DEPLOYMENT_TIMEOUT = 300000; // 5 minutes instead of 2
export const POLLING_INTERVAL = 3000; // 3 seconds between status checks

export const streamingState = atom<boolean>(false); 