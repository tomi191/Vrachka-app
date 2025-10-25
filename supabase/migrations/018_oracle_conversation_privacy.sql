-- =============================================
-- ORACLE CONVERSATION PRIVACY IMPROVEMENTS
-- =============================================
-- Add DELETE policy so users can delete their own conversations
-- Add UPDATE policy to prevent modification (conversations should be immutable)

-- Allow users to delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON oracle_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Prevent updates to conversations (they should be immutable)
-- Only allow updating if user owns the conversation (defensive measure)
CREATE POLICY "Users cannot update conversations"
  ON oracle_conversations FOR UPDATE
  USING (false);

-- Add comment to document the immutability
COMMENT ON TABLE oracle_conversations IS
'Oracle conversation history. Conversations are immutable once created. Users can view and delete their own conversations but cannot modify them.';
