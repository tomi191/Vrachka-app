/**
 * Blog Post Notification Template for Viber
 *
 * Creates rich media messages for blog post notifications with:
 * - Featured image
 * - Title and excerpt
 * - "Read More" button
 * - Category badge
 */

import type {
  ViberRichMedia,
  ViberButton,
  BlogPostNotificationData,
  ViberPostRequest,
} from '../types';

// Category labels in Bulgarian
const CATEGORY_LABELS: Record<string, string> = {
  astrology: '✨ Астрология',
  tarot: '🔮 Таро',
  numerology: '🔢 Нумерология',
  spirituality: '🌙 Духовност',
  general: '📝 Общо',
};

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  astrology: '#9333ea', // Purple
  tarot: '#ec4899', // Pink
  numerology: '#06b6d4', // Cyan
  spirituality: '#8b5cf6', // Violet
  general: '#6366f1', // Indigo
};

/**
 * Create a rich media message for blog post notification
 */
export function createBlogNotificationMessage(
  blogPost: BlogPostNotificationData
): ViberPostRequest {
  const postUrl = `https://vrachka.eu/blog/${blogPost.slug}`;
  const categoryLabel = CATEGORY_LABELS[blogPost.category] || '📝 Блог';
  const categoryColor = CATEGORY_COLORS[blogPost.category] || '#7C3AED';

  // Truncate excerpt to fit Viber limits (7000 chars for text)
  const maxExcerptLength = 200;
  const excerpt =
    blogPost.excerpt.length > maxExcerptLength
      ? blogPost.excerpt.substring(0, maxExcerptLength - 3) + '...'
      : blogPost.excerpt;

  // If we have a featured image, create a rich media card
  if (blogPost.featured_image_url) {
    return {
      type: 'rich_media',
      rich_media: createRichMediaCard(
        blogPost.title,
        excerpt,
        blogPost.featured_image_url,
        postUrl,
        categoryLabel,
        categoryColor
      ),
      alt_text: `📝 Нова статия: ${blogPost.title}\n\n${excerpt}\n\n${postUrl}`,
    };
  }

  // Fallback to text message with button if no image
  return {
    type: 'text',
    text: `${categoryLabel}\n\n📝 **${blogPost.title}**\n\n${excerpt}`,
    keyboard: {
      Type: 'keyboard',
      DefaultHeight: false,
      BgColor: '#FFFFFF',
      Buttons: [
        {
          Columns: 6,
          Rows: 1,
          BgColor: categoryColor,
          ActionType: 'open-url',
          ActionBody: postUrl,
          Text: '📖 Прочети повече',
          TextVAlign: 'middle',
          TextHAlign: 'center',
          TextSize: 'regular',
        },
      ],
    },
  };
}

/**
 * Create a rich media card with image, title, excerpt, and button
 */
function createRichMediaCard(
  title: string,
  excerpt: string,
  imageUrl: string,
  postUrl: string,
  categoryLabel: string,
  categoryColor: string
): ViberRichMedia {
  const buttons: ViberButton[] = [];

  // Row 1: Featured Image (full width)
  buttons.push({
    Columns: 6,
    Rows: 3,
    ActionType: 'open-url',
    ActionBody: postUrl,
    Image: imageUrl,
    ImageScaleType: 'crop',
    Silent: true,
  });

  // Row 4: Category badge
  buttons.push({
    Columns: 6,
    Rows: 1,
    ActionType: 'none',
    BgColor: categoryColor,
    Text: `<font color="#FFFFFF"><b>${categoryLabel}</b></font>`,
    TextSize: 'small',
    TextVAlign: 'middle',
    TextHAlign: 'center',
  });

  // Row 5-6: Title (truncated to fit)
  const maxTitleLength = 80;
  const truncatedTitle =
    title.length > maxTitleLength
      ? title.substring(0, maxTitleLength - 3) + '...'
      : title;

  buttons.push({
    Columns: 6,
    Rows: 2,
    ActionType: 'none',
    BgColor: '#1a1a1a',
    Text: `<font color="#FFFFFF"><b>${truncatedTitle}</b></font>`,
    TextSize: 'regular',
    TextVAlign: 'middle',
    TextHAlign: 'left',
    Silent: true,
  });

  // Row 7: Excerpt (truncated)
  const maxExcerptForCard = 120;
  const truncatedExcerpt =
    excerpt.length > maxExcerptForCard
      ? excerpt.substring(0, maxExcerptForCard - 3) + '...'
      : excerpt;

  buttons.push({
    Columns: 6,
    Rows: 2,
    ActionType: 'none',
    BgColor: '#1a1a1a',
    Text: `<font color="#A0A0A0">${truncatedExcerpt}</font>`,
    TextSize: 'small',
    TextVAlign: 'top',
    TextHAlign: 'left',
    Silent: true,
  });

  // Row 9: "Read More" button
  buttons.push({
    Columns: 6,
    Rows: 1,
    ActionType: 'open-url',
    ActionBody: postUrl,
    BgColor: categoryColor,
    Text: `<font color="#FFFFFF"><b>📖 Прочети повече</b></font>`,
    TextSize: 'regular',
    TextVAlign: 'middle',
    TextHAlign: 'center',
  });

  return {
    Type: 'rich_media',
    ButtonsGroupColumns: 6,
    ButtonsGroupRows: 9,
    BgColor: '#1a1a1a',
    Buttons: buttons,
  };
}

/**
 * Create a simple text notification (fallback)
 */
export function createSimpleTextNotification(
  blogPost: BlogPostNotificationData
): ViberPostRequest {
  const postUrl = `https://vrachka.eu/blog/${blogPost.slug}`;
  const categoryLabel = CATEGORY_LABELS[blogPost.category] || '📝 Блог';

  // Keep it under 7000 chars
  const maxTextLength = 500;
  const excerpt =
    blogPost.excerpt.length > maxTextLength
      ? blogPost.excerpt.substring(0, maxTextLength - 3) + '...'
      : blogPost.excerpt;

  return {
    type: 'text',
    text: `${categoryLabel}\n\n📝 **${blogPost.title}**\n\n${excerpt}\n\n🔗 ${postUrl}`,
  };
}
