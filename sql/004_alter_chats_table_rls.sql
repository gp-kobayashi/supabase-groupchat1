--chatsテーブルにSelectとInsertのRLSポリシーを追加します
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert messages only if user is active in group"
ON chats
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.user_id = auth.uid()
      AND group_members.group_id = chats.group_id
      AND group_members.status = 'active'
  )
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Select messages only if user is active in group"
ON chats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.user_id = auth.uid()
      AND group_members.group_id = chats.group_id
      AND group_members.status = 'active'
  )
);