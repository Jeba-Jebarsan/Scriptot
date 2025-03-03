import { atom } from 'nanostores';
import { openDB } from 'idb';

export interface Deployment {
  id: string;
  name: string;
  url: string;
  provider: 'netlify' | 'vercel' | 'github-pages' | 'other';
  status: 'success' | 'failed' | 'in-progress';
  createdAt: Date;
  projectPath?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export const deploymentsStore = atom<Deployment[]>([]);

const DB_NAME = 'bolt-deployments';
const STORE_NAME = 'deployments';

// Initialize the database
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('createdAt', 'createdAt');
      store.createIndex('provider', 'provider');
    }
  },
});

// Load deployments from IndexedDB
export async function loadDeployments() {
  try {
    const db = await dbPromise;
    const deployments = await db.getAll(STORE_NAME);
    
    // Sort by creation date (newest first)
    deployments.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    deploymentsStore.set(deployments);
    return deployments;
  } catch (error) {
    console.error('Failed to load deployments:', error);
    return [];
  }
}

// Add a new deployment
export async function addDeployment(deployment: Omit<Deployment, 'id' | 'createdAt'>) {
  try {
    const newDeployment: Deployment = {
      ...deployment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    const db = await dbPromise;
    await db.add(STORE_NAME, newDeployment);
    
    // Update the store
    const deployments = [...deploymentsStore.get(), newDeployment];
    deployments.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    deploymentsStore.set(deployments);
    return newDeployment;
  } catch (error) {
    console.error('Failed to add deployment:', error);
    throw error;
  }
}

// Update an existing deployment
export async function updateDeployment(id: string, updates: Partial<Deployment>) {
  try {
    const db = await dbPromise;
    const deployment = await db.get(STORE_NAME, id);
    
    if (!deployment) {
      throw new Error(`Deployment with ID ${id} not found`);
    }
    
    const updatedDeployment = { ...deployment, ...updates };
    await db.put(STORE_NAME, updatedDeployment);
    
    // Update the store
    const deployments = deploymentsStore.get().map(d => 
      d.id === id ? updatedDeployment : d
    );
    
    deploymentsStore.set(deployments);
    return updatedDeployment;
  } catch (error) {
    console.error('Failed to update deployment:', error);
    throw error;
  }
}

// Delete a deployment
export async function deleteDeployment(id: string) {
  try {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
    
    // Update the store
    const deployments = deploymentsStore.get().filter(d => d.id !== id);
    deploymentsStore.set(deployments);
    
    return true;
  } catch (error) {
    console.error('Failed to delete deployment:', error);
    throw error;
  }
} 