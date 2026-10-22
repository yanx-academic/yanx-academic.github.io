# Yan X · 个人空间

米白、电光蓝与杂志式排版的中英双语个人网站。内容用 Markdown 管理，无需修改页面代码。

## 最常用的编辑入口

| 想修改什么 | 文件 |
| --- | --- |
| 中文个人介绍 | `content/zh/about.md` |
| 英文个人介绍 | `content/en/about.md` |
| 中文随笔 | `content/zh/posts/` |
| 英文随笔 | `content/en/posts/` |
| 姓名、首页标题、社交链接、主图路径 | `src/site-config.mjs` |
| 照片 | `public/images/` |

在 GitHub 打开对应文件，点击铅笔图标，修改后选择 **Commit changes**。提交到 `main` 分支后，Actions 会自动测试、构建和发布。若构建失败，旧版网站保持在线，可在 Actions 查看错误。

## 添加文章：复制这个模板

在 `content/zh/posts/` 点击 **Add file → Create new file**，例如 `a-new-day.md`：

```markdown
---
id: a-new-day
title: "新的一天"
date: "2026-10-22"
draft: false
sample: false
excerpt: "一两句话的文章简介。"
---

这里写正文。

## 一个小标题

这里可以继续写内容，也可以加上 [一个链接](https://example.com)。

![照片说明](/images/my-photo.jpg)
```

- `id` 仅用小写英文字母、数字和连字符，同一语言内不能重复。
- `title` 和 `excerpt` 建议保留英文双引号；若内容有双引号，用 `\"` 转义。
- `date` 使用 `YYYY-MM-DD`，文章按日期倒序排列。
- 新文件会自动加入列表，无需手动修改首页。
- 示例文章标有 `sample: true`；换成真实文章后可改成 `false`。

### 添加英文翻译

在 `content/en/posts/` 新建对应 Markdown 文件，**`id` 和中文版完全相同**。其余标题、简介、正文写成英文。两种语言的文件名可以不同，系统按 `id` 关联。缺少译文时，切换语言会显示明确提示。

### 草稿

将 `draft: true` 写入头部，文章会从网站与浏览器下载的内容中排除。必须使用不带引号的 `true` / `false`。

**注意：这是公开 GitHub 仓库，Markdown 源文件和历史提交仍然公开。草稿只是不显示在网站中；私人笔记请勿上传。**

### 上传照片

在 `public/images/` 使用 **Add file → Upload files** 上传图片，然后在正文中写：

```markdown
![给照片写一段说明](/images/文件名.jpg)
```

建议文件名使用小写英文和连字符。图片尽量压缩到 1 MB 内；文章照片建议宽度 1600px 左右。首页主图在 `src/site-config.mjs` 的 `image` 字段设置。

## 首次部署

1. 新建公开仓库 `yanx-academic.github.io`。
2. 将本项目源码推送到 `main` 分支。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 打开 **Actions → Publish personal website**；如未自动运行，点击 **Run workflow**。
5. 工作流成功后，网站地址为 `https://yanx-academic.github.io/`。

中文版位于 `/zh/`，英文版位于 `/en/`；根地址默认展示英文首页。

## 本地预览

需要 Node.js 24。

```sh
npm ci
npm run dev
```

修改内容后会自动刷新预览；如新增文章未出现，重启预览服务。

```sh
npm test
npm run build
npm run check:links
npm run preview
```

可发布的静态文件位于 `dist/client/`，全部主要页面已预渲染，关闭 JavaScript 也能阅读文章。保留模板自带的 Worker 文件是为了兼容其他托管方式；GitHub Pages 只发布 `dist/client/`。

## 主图与示例内容

海岸主图由 OpenAI 内置图像工具生成，是装饰摄影，不代表站点作者亲历。初始文章是明确标注的排版示例；发布个人内容前可替换或设为草稿。网站未填入未经确认的个人经历或私人邮箱。
