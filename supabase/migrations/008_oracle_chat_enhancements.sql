-- Migration 008: Oracle Chat Enhancements
-- Transform oracle_conversations from Q&A to interactive chat
-- Add conversation threading, context memory, and message types

-- Add new columns to oracle_conversations table
ALTER TABLE oracle_conversations
ADD COLUMN IF NOT EXISTS conversation_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS context TEXT,
ADD COLUMN IF NOT EXISTS message_type TEXT CHECK (message_type IN ('user_question', 'oracle_response')) DEFAULT 'user_question',
ADD COLUMN IF NOT EXISTS sentiment TEXT;

-- Create index for conversation threading
CREATE INDEX IF NOT EXISTS idx_oracle_conversations_conversation_id
ON oracle_conversations(conversation_id, asked_at DESC);

-- Create index for user conversations with context
CREATE INDEX IF NOT EXISTS idx_oracle_conversations_user_context
ON oracle_conversations(user_id, conversation_id, asked_at DESC);

-- Update existing rows to have message_type
UPDATE oracle_conversations
SET message_type = 'user_question'
WHERE message_type IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN oracle_conversations.conversation_id IS 'Groups related messages in a conversation thread';
COMMENT ON COLUMN oracle_conversations.context IS 'Stores conversation memory for AI context';
COMMENT ON COLUMN oracle_conversations.message_type IS 'Type of message: user_question or oracle_response';
COMMENT ON COLUMN oracle_conversations.sentiment IS 'Emotional tone or topic of the conversation';
