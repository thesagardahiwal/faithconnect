import { APPWRITE_CONFIG } from '@/config/appwrite';
import { Account, Client, Databases, Storage } from 'react-native-appwrite';


const client = new Client();

client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

/**
 * Appwrite SDK instances
 */
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { account, client, databases, storage };

