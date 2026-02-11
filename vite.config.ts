import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration
 * 
 * このプロジェクトをローカル環境で開発、またはビルドするための設定です。
 * Reactプラグインを有効化し、ビルド設定を最適化しています。
 */
export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages などのサブディレクトリデプロイに対応するため相対パスを使用
  base: './',

  server: {
    port: 3000,
    open: true,
    host: true,
  },

  build: {
    // 出力先ディレクトリ
    outDir: 'dist',
    // ビルド前に出力先を空にする
    emptyOutDir: true,
    // デバッグ用のソースマップを生成
    sourcemap: true,
    // ブラウザの互換性ターゲット
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },

  // 拡張子の省略を許可
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});
