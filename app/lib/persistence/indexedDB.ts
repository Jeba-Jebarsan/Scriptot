export async function openDatabase(): Promise<IDBDatabase | undefined> {
    return new Promise((resolve) => {
      const request = indexedDB.open("UserProfileDB", 1);
  
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("profiles")) {
          db.createObjectStore("profiles", { keyPath: "id" });
        }
      };
  
      request.onsuccess = (event: Event) => resolve((event.target as IDBOpenDBRequest).result);
      request.onerror = () => resolve(undefined);
    });
  }
  
  export async function getAllProfiles(db: IDBDatabase): Promise<any[]> {
    return new Promise((resolve) => {
      const transaction = db.transaction("profiles", "readonly");
      const store = transaction.objectStore("profiles");
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }
  
  export async function setProfile(
    db: IDBDatabase,
    profileData: {
      id: string;
      username: string;
      name: string;
      description: string;
      location: string;
      link: string;
      hide_profile_picture: boolean;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("profiles", "readwrite");
      const store = transaction.objectStore("profiles");
      const request = store.put(profileData);
  
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  export async function getProfile(db: IDBDatabase, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("profiles", "readonly");
      const store = transaction.objectStore("profiles");
      const request = store.get(id);
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }