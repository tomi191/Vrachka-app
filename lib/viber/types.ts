/**
 * Viber API Types
 * Documentation: https://developers.viber.com/docs/api/rest-bot-api/
 */

// ========== API Response Types ==========

export interface ViberAPIResponse {
  status: number;
  status_message: string;
  message_token?: string;
  chat_hostname?: string;
  billing_status?: number;
}

export interface ViberAccountInfo {
  status: number;
  status_message: string;
  id: string;
  name: string;
  uri: string;
  icon: string;
  background: string;
  category: string;
  subcategory: string;
  location: {
    lon: number;
    lat: number;
  };
  country: string;
  webhook: string;
  event_types: string[];
  subscribers_count: number;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
}

// ========== Message Types ==========

export type ViberMessageType =
  | 'text'
  | 'picture'
  | 'video'
  | 'file'
  | 'location'
  | 'contact'
  | 'sticker'
  | 'rich_media'
  | 'url';

export interface ViberBaseMessage {
  type: ViberMessageType;
  tracking_data?: string;
}

export interface ViberTextMessage extends ViberBaseMessage {
  type: 'text';
  text: string;
}

export interface ViberPictureMessage extends ViberBaseMessage {
  type: 'picture';
  text?: string;
  media: string; // URL to image (JPEG, max 1MB iOS / 3MB Android)
  thumbnail?: string;
}

export interface ViberRichMediaMessage extends ViberBaseMessage {
  type: 'rich_media';
  rich_media: ViberRichMedia;
  alt_text?: string; // Fallback text for unsupported clients
}

// ========== Rich Media Types ==========

export interface ViberRichMedia {
  Type: 'rich_media';
  ButtonsGroupColumns: number; // 1-6
  ButtonsGroupRows: number; // 1-7
  BgColor?: string; // Hex color
  Buttons: ViberButton[];
}

export interface ViberButton {
  Columns: number; // 1-6
  Rows: number; // 1-7 (max 2 for URL buttons, max 3 for reply buttons)
  ActionType: ViberButtonActionType;
  ActionBody?: string; // URL for open-url, text for reply (not used for 'none')
  Text?: string; // Button text
  TextSize?: 'small' | 'regular' | 'large';
  TextVAlign?: 'top' | 'middle' | 'bottom';
  TextHAlign?: 'left' | 'center' | 'right';
  BgColor?: string; // Hex color
  BgMediaType?: 'picture' | 'gif';
  BgMedia?: string; // Background image URL
  BgMediaScaleType?: 'crop' | 'fill' | 'fit';
  Image?: string; // Image URL
  ImageScaleType?: 'crop' | 'fill' | 'fit';
  Silent?: boolean; // Don't play sound on press
  TextOpacity?: number; // 0-100
  BgLoop?: boolean; // Loop GIF
}

export type ViberButtonActionType =
  | 'open-url'
  | 'reply'
  | 'share-phone'
  | 'location-picker'
  | 'none';

// ========== Keyboard Types ==========

export interface ViberKeyboard {
  Type: 'keyboard';
  DefaultHeight?: boolean; // true = half-height, false = full-height
  BgColor?: string; // Hex color
  Buttons: ViberButton[];
  InputFieldState?: 'regular' | 'minimized' | 'hidden';
}

// ========== Post to Channel Request ==========

export interface ViberPostRequest {
  from?: string; // Sender ID (channel ID)
  type: ViberMessageType;
  text?: string;
  media?: string;
  rich_media?: ViberRichMedia;
  keyboard?: ViberKeyboard;
  tracking_data?: string;
  alt_text?: string; // Fallback text for rich_media (for unsupported clients)
}

// ========== Send Message Request (Bot API) ==========

export interface ViberSendMessageRequest extends ViberPostRequest {
  receiver: string; // User ID to send to
  sender?: {
    name: string;
    avatar?: string;
  };
  min_api_version?: number;
}

// ========== Broadcast Request ==========

export interface ViberBroadcastRequest {
  broadcast_list: string[]; // Array of user IDs
  type: ViberMessageType;
  text?: string;
  media?: string;
  rich_media?: ViberRichMedia;
  keyboard?: ViberKeyboard;
  sender?: {
    name: string;
    avatar?: string;
  };
  min_api_version?: number;
}

// ========== Database Types (for our tracking) ==========

export interface ViberNotification {
  id: string;
  blog_post_id: string;
  sent_at: string; // ISO timestamp
  message_token: string | null; // Viber's message ID
  status: 'success' | 'failed';
  error_message: string | null;
  metadata: {
    title: string;
    excerpt: string;
    slug: string;
    featured_image: string | null;
    category: string;
    response?: ViberAPIResponse;
  };
}

export interface ViberNotificationInsert {
  blog_post_id: string;
  message_token?: string;
  status: 'success' | 'failed';
  error_message?: string;
  metadata: ViberNotification['metadata'];
}

// ========== Service Layer Types ==========

export interface BlogPostNotificationData {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url: string | null;
  category: string;
}

export interface ViberServiceConfig {
  authToken: string;
  channelId?: string;
  apiUrl?: string; // Default: https://chatapi.viber.com/pa
}

export interface SendNotificationResult {
  success: boolean;
  messageToken?: string;
  error?: string;
  details?: ViberAPIResponse;
}
