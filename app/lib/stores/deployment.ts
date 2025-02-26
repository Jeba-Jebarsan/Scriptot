import { atom } from 'nanostores';

export interface DeploymentState {
  isDeploying: boolean;
  isBuildReady: boolean;
  error: string | null;
}

export const deploymentState = atom<DeploymentState>({
  isDeploying: false,
  isBuildReady: false,
  error: null
});

export const streamingState = atom<boolean>(false); 