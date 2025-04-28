# chrome-pick-and-link

## 概要
Pick And Linkは、ウェブページ上のコードやリンクを抽出し、カスタマイズ可能な形式で共有するためのChrome拡張機能です。

## 主な機能
- ウェブページ上の特定のコードやリンクを抽出
- カスタムルール（URLパターン、コードパターン、出力URLテンプレート）の設定
- ルールのエクスポート・インポート（YAML形式対応）
- 抽出したリンクをポップアップで表示

## インストール方法
1. このリポジトリをクローンまたはダウンロードします。
   ```bash
   git clone https://github.com/your-repo/chrome-pick-and-link.git
   ```
2. Chromeブラウザを開き、[拡張機能](chrome://extensions/)ページに移動します。
3. 右上の「デベロッパーモード」を有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、このプロジェクトのフォルダを選択します。

## Chromeウェブストア
[Pick And Link 拡張機能ストアページ](https://chromewebstore.google.com/detail/picklink/akbfaabjgmkdllgcgbkbkoefefgnoook?authuser=0&hl=ja)

## 使用方法
1. 拡張機能をインストール後、オプションページでルールを設定します。
   - ルールには以下を指定できます：
     - タイトル
     - URLパターン（正規表現）
     - コードパターン（正規表現）
     - 出力URLテンプレート
2. ウェブページを開き、拡張機能のアイコンをクリックしてポップアップを表示します。
3. 抽出されたリンクがポップアップに表示されます。

## 開発者向け情報
- **背景スクリプト**: `background.js`
- **コンテンツスクリプト**: `content.js`
- **オプションページ**: `options.html`, `options.js`
- **ポップアップページ**: `popup.html`, `popup.js`
- **設定ファイル**: `manifest.json`

## ライセンス
このプロジェクトは[The Unlicense](LICENSE)の下で公開されています。