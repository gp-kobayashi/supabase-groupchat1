# Supabase と Next.js を連携して、ユーザーの認証機能やグループチャット機能を追加する。

### 参照したドキュメント

https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts

### 必要なソフトウェア

React
Next.js
Node.js
typescript
supabase(データベース)

### インストール手順

##### Node.js

https://nodejs.org のページから Nodo.js の LTS(推奨版)をダウンロード
ダウンロードした msi ファイルを実行し画面に従いインストールする。
コマンドプロンプトやターミナルで
`node -v`　`npm -v`
を入力し、それぞれインストールしたバージョンが表示されれば完了。

##### パッケージのインストール

`npm install`

supabase.js(supabase クライアントのライブラリ)
@supabase/ssr(supabase のサーバーサイド認証パッケージ)

### supabase の設定

1.supabase で新しいプロジェクトを作成
https://supabase.com/dashboard にサインアップ、新しいプロジェクトを作成し起動まで待つ。

2.データベースのスキーマ設定
SQL Editor のページを開き`setup.sql`の内容を貼り付け RUN で実行。
(もしくは、Quickstarts から User Management Starter をクリックでも実行可能)

3.API キーの取得
Project Settings から API ページへ移動
Project URL の`URL`と Project API Keys の`anon public`の項目をコピー

4.メールテンプレートの変更
Authentication から Email Templates ページを開く。
Confirm signup タブの HTML の部分を書きかえる。
`{{ .ConfirmationURL }}`を
`{{ .ConfirmationURL }}{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
へ書きかえ。

### 環境変数の設定

1.`.env.local.example`ファイルをコピーし、コピーしたファイルの名前を`.env.local`へ書きかえる。

2.API キーの入力

```.env.local
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

`YOUR_SUPABASE_URL`の部分を先程取得した Project URL へ
`YOUR_SUPABASE_ANON_KEY`の部分を同じく取得した API Keys の anon public の項目へ書きかえる。

### 動作確認

`npm run dev`で[localhost:3000](http://localhost:3000)のページを起動

[localhost:3000/login](http://localhost:3000/login)へ移動

Email と Password を入力し SIGN UP ボタンをクリックすると入力したメールアドレスに登録用のメールが届く
Confirm your mail をクリックすると登録が完了し
[localhost:3000/account](http://localhost:3000/account)へ移動し各種プロフィールの設定が可能に。

### グループチャットの準備

sql フォルダの 001 から 004 まで内容を supabase の SQL Editor にコピーし Run ボタンを押して実行していく。
profiles,chats,groups,group_members の各テーブルが作成されていれば完了。
