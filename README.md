# 秋招 AI 简历 & 面经助手

面向秋招大学生的可交互产品 Demo，包含：

- JD 岗位需求解析
- 简历匹配度评分
- STAR 法则定向改写
- 脱敏面经检索、去重与固定来源引用

当前 Demo 使用浏览器端规则与 24 篇内置脱敏面经运行，不依赖外部模型服务，也不会长期保存用户简历。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev:static
```

静态生产构建：

```bash
npm run build:static
```

生成结果位于 `dist-static/`。

## 部署到 GitHub Pages

项目已经包含 `.github/workflows/deploy-pages.yml`。将代码推送到 GitHub 后：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 向 `main` 分支推送代码，或在 **Actions** 页面手动运行工作流。
4. 部署完成后，地址通常为 `https://你的用户名.github.io/仓库名/`。

静态构建使用相对资源路径，可同时适配根域名与 GitHub Pages 的仓库子路径。

## 项目结构

- `app/page.tsx`：四模块交互与本地分析逻辑
- `app/demo-data.ts`：示例 JD、简历和脱敏面经知识库
- `app/globals.css`：页面视觉与响应式样式
- `static-main.tsx`：静态站点入口
- `vite.static.config.ts`：GitHub Pages 静态构建配置
- `.github/workflows/deploy-pages.yml`：自动部署工作流

## 其他部署方式

原有 Sites 构建仍然保留：

```bash
npm run dev
npm run build
```

如果后续接入真实大模型、向量数据库或服务端文件处理，请把 API Key 放在后端环境变量中，不要写入 GitHub Pages 的前端代码。
