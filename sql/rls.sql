-- chatsにRLSを適用する
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
-- chatsにInsertを許可するポリシーを作成する
CREATE POLICY "Insert messages only if user is active in group"
ON chats
FOR INSERT
-- チェック項目を記述
WITH CHECK (
  -- 今回はexistsで条件を満たすレコードがあるかをチェック
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.user_id = auth.uid()
      AND group_members.group_id = chats.group_id
      AND group_members.status = 'active'
  )
);