import { AppwriteDocument } from "./appwrite.types";
import { UserProfile } from "./user.types";

/**
 * All supported notification types
 */
export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'message';

/**
 * Notification document interface
 */
export interface Notification extends AppwriteDocument {
  /** Receiver of the notification */
  to: UserProfile;

  /** Sender (optional: system notifications may not have sender) */
  from?: UserProfile;

  /** Notification category */
  type: NotificationType;

  /** Related post (like/comment) */
  post?: string;

  /** Related chat (message) */
  chat?: string;

  /** Short preview text */
  text?: string;

  /** Read status */
  read: boolean;
}
