import { atom } from 'nanostores';

export interface DeploymentState {
  isDeploying: boolean;
  isBuildReady: boolean;
  error: string | null;
  timeoutAt?: number;
}

export const deploymentState = atom<DeploymentState>({
  isDeploying: false,
  isBuildReady: false,
  error: null,
  timeoutAt: undefined
});

export const DEPLOYMENT_TIMEOUT = 300000; // 5 minutes instead of 2
export const POLLING_INTERVAL = 3000; // 3 seconds between status checks

export const streamingState = atom<boolean>(false); 