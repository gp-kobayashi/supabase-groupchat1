-- プロフィールテーブルを作成し、ユーザーを管理します
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

UPDATE storage.buckets
SET public = true
WHERE name = 'avatars';

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');

--チャットとグループを管理するテーブルをそれぞれ作成します
CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    title text,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    text text,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_groups
BEFORE UPDATE ON groups
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_chats
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

--誰がどのグループに参加しているかを管理します
CREATE type role_enum AS ENUM ('admin', 'member');
CREATE type status_enum AS ENUM ('active', 'pending', 'banned');

CREATE TABLE group_members(
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    role role_enum NOT NULL,
    status status_enum NOT NULL,
    invited_user uuid,
    FOREIGN KEY (invited_user) REFERENCES profiles(id),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (user_id, group_id)
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_members
BEFORE UPDATE ON group_members
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

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