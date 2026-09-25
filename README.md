# StarTrail

数据驱动的极简个人主页 / 作品集站点。全部文案、经历、技能、项目、推荐均来自配置与 Markdown；支持中英双语、明暗主题、访客语言自动引导；开源项目的 Star/Fork 每日自动更新。构建为静态站点，托管于 EdgeOne Pages。

> 本文档是本站的完整说明（含字段契约、设计 token、API 契约与部署），面向「拿起来就能跑、能改、能部署」，以**当前构建实况**为准。

---

## 目录

- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [站点配置 site.json](#站点配置-sitejson)
- [功能开关 features](#功能开关-features)
- [内容维护（数据字典）](#内容维护数据字典)
- [项目内容 projects/\*.md](#项目内容-projects-md)
- [国际化 i18n](#国际化-i18n)
- [主题](#主题)
- [设计系统与布局](#设计系统与布局)
- [页面与路由](#页面与路由)
- [GitHub 统计](#github-统计)
- [边缘函数与 API 契约](#边缘函数与-api-契约)
- [环境变量与密钥](#环境变量与密钥)
- [部署](#部署)
- [日常维护](#日常维护)
- [已知外部依赖与限制](#已知外部依赖与限制)
- [相关文档](#相关文档)

---

## 核心特性

- **数据驱动**：所有内容来自 `src/data/*.json`、`src/content/projects/*.md`、`src/i18n/*.json`，组件内不硬编码文案。
- **中英双语**：`/{lang}/` 路由（`zh` / `en`），根路由按「手动选择 > 浏览器语言 > 默认语言」自动引导。
- **明暗主题**：浅色暖纸 / 暗色暖灰，首屏内联脚本防闪烁，偏好写入 `localStorage`。
- **响应式双卡片布局**：≥768px 左侧固定栏 + 右侧内容卡；<768px 顶栏 + 顶栏下方面板式抽屉。
- **完整区块**：关于 / 近况 / 项目 / 经历（技能 + 工作经历 + 奖项）/ 推荐（标签筛选 + 星级）。
- **GitHub 统计**：统计总览 + 常用语言图片卡（浅/暗两套、透明背景）。
- **Star/Fork 每日更新**：cron 触发边缘函数写入 KV，前端读取实时值（构建值兜底）。
- **零前端框架**：仅 Astro + 原生 CSS/JS；构建期做 i18n 键一致性与内容 zod 校验。

## 技术栈

| 角色 | 选型 |
| --- | --- |
| 框架 / 构建 | Astro 5（`output: 'static'`，Content Collections + i18n） |
| 样式 | 原生 CSS + CSS 变量（设计 token） |
| 运行时 | 原生 JS（无 npm 前端依赖） |
| 边缘函数 | EdgeOne Pages Functions（`/api/*`） |
| 边缘存储 | EdgeOne KV（缓存 Star/Fork 与用户统计） |
| 定时任务 | cron-job.org（每日 POST） |
| DNS | Cloudflare（自定义域名 CNAME → EdgeOne Pages） |
| 数据源 | GitHub REST API |
| 外部图片 | GitHub Readme Stats 镜像（可配置） |

## 目录结构

```text
StarTrail/
├─ astro.config.mjs            # Astro 配置（i18n、静态输出等）
├─ package.json / tsconfig.json
├─ README.md
├─ scripts/
│  └─ gen-repos.mjs            # prebuild：projects frontmatter → functions/api/_repos.gen.json
├─ functions/
│  └─ api/
│     ├─ update-stars.ts       # POST：密钥校验 → GitHub API → 写 KV
│     ├─ stars.ts              # GET：读 KV → JSON
│     └─ _repos.gen.json       # 构建生成（已 gitignore）
├─ public/
│  └─ images/avatar.svg        # 头像占位
└─ src/
   ├─ data/                    # 全部可修改内容配置
   │  ├─ site.json  profile.json  contact.json  now.json
   │  └─ skills.json  experience.json  awards.json  recommendations.json
   ├─ i18n/{zh.json, en.json}  # 界面文案（键集合必须一致）
   ├─ content/
   │  ├─ config.ts             # projects collection 的 zod schema
   │  └─ projects/*.md         # 项目内容（.zh.md / .en.md）
   ├─ layouts/BaseLayout.astro # head/主题脚本/布局壳/客户端脚本
   ├─ components/              # Sidebar/Nav/MobileTopBar/MobileDrawer/ProjectCard/… / Icon
   ├─ pages/                   # 见「页面与路由」
   ├─ styles/{tokens.css, global.css}
   └─ utils/{i18n,features,experience,timezone,projects}.ts
```

## 快速开始

要求 **Node ≥ 20**。

```bash
npm install

npm run dev       # 先跑 gen-repos，再启动 Astro dev → http://localhost:4321
npm run build     # 先跑 gen-repos，再产出静态站点到 dist/
npm run preview   # 预览构建产物
npm run check     # astro check（类型/内容诊断）
```

说明：

- `dev` / `build` 都会先执行 `node scripts/gen-repos.mjs`，从项目 frontmatter 生成 `functions/api/_repos.gen.json`（该文件被 `.gitignore` 忽略，不入库）。
- `npm run build` 会在构建期执行内容校验（见「项目内容」与「国际化」），失败即构建失败。
- `functions/` 为 EdgeOne Pages 边缘函数，本地需用 EdgeOne Pages 的本地模拟（以官方 CLI 为准）；纯前端可先跑 `dev` 验证。

## 站点配置 site.json

`src/data/site.json`：

```jsonc
{
  "title": "StarTrail",
  "url": "https://startrail.stars22.xyz",
  "defaultLang": "en",
  "githubUser": "Stars-22",
  "repoUrl": "https://github.com/Stars-22/StarTrail",
  "copyright": { "zh": "© {year} Stars", "en": "© {year} Stars" },
  "poweredBy": { "zh": "由 {list} 驱动", "en": "Powered by {list}" },
  "credits": [
    { "name": "Astro", "url": "https://astro.build" },
    { "name": "EdgeOne", "url": "https://edgeone.ai" }
  ],
  "githubStats": {
    "provider": "https://dev-stats.mintimate.cn",
    "cards": ["stats", "topLangs"]
  },
  "features": { /* 见下节 */ }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 站名，用于 `<title>` 与 `og:site_name` |
| `url` | string | 线上域名（用于 canonical / og:url 等） |
| `defaultLang` | `"zh" \| "en"` | 默认语言 |
| `githubUser` | string | GitHub 用户名（统计图与 `gen-repos` 使用） |
| `repoUrl` | string | 本站源码仓库地址（页脚链接） |
| `copyright` | i18n | 版权署名，`{year}` 构建时替换为当前年份 |
| `poweredBy` | i18n | 驱动文案模板，`{list}` 由 `credits` 渲染为带链接的技术名列表 |
| `credits` | `{name, url}[]` | 页脚「由 … 驱动」中的技术项（外链） |
| `githubStats.provider` | string | GitHub Readme Stats 服务地址 |
| `githubStats.cards` | string[] | 启用的统计卡：`stats`（总览）/ `topLangs`（常用语言） |
| `features` | object | 功能开关，见下节 |

## 功能开关 features

`site.json.features`：

| 开关 | 影响 |
| --- | --- |
| `i18n` | 双语路由与文案、语言切换、根路由自动引导；`false` 时仅默认语言、隐藏语言切换 |
| `theme` | 明暗切换与防闪烁脚本；`false` 时固定浅色、不渲染按钮 |
| `now` | 「近况」路由与导航项 |
| `skills` | 经历页「技能」区块 |
| `experience` | 经历页「工作经历」区块 |
| `awards` | 经历页「奖项证书」区块 |
| `recommendations` | 「推荐」路由与导航项 |
| `githubStats` | 关于页「GitHub 统计」区块 |
| `starAutoUpdate` | 前端是否用 `/api/stars` 替换卡片/统计的构建兜底值（`false` 时只显示构建值） |

> `skills / experience / awards` 三者全关时，经历页与对应导航项不生成。

## 内容维护（数据字典）

> 双语文案字段统一为 `{ "zh": "…", "en": "…" }`；数组型为 `{ "zh": [...], "en": [...] }`。日期统一 `YYYY-MM`。

### profile.json（关于 / 侧栏共用）

| 字段 | 说明 |
| --- | --- |
| `name` | 姓名（i18n） |
| `avatar` | 头像路径（`public/images/` 下），`alt` 用姓名 |
| `roles` | 岗位数组（i18n[]）——侧栏渲染为**胶囊**、关于页与移动顶栏用 ` · ` 连接 |
| `location` | 地点（i18n），如 `杭州 / 中国` |
| `timezone` | IANA 时区（如 `Asia/Shanghai`），显示为 `UTC+8`（zh）/ `GMT+8`（en） |
| `status` | 状态一句话（i18n） |
| `started.coding` / `started.working` | 起始时间，构建时换算年限 |
| `bio` | 个人介绍段落数组（i18n[]） |

### contact.json（仅关于页）

数组，每项 `{ type, value, label? }`。`type` 枚举与渲染：

| type | value 语义 | 渲染 |
| --- | --- | --- |
| `github` | 主页 URL | 外链新标签 |
| `netease` | 网易云主页 URL | 外链新标签 |
| `discord` | 用户名 handle | `<button>` 点击复制（成功/失败 toast 提示） |
| `email` | 邮箱 | `mailto:` 链接 |
| `website` | URL | 外链新标签（可带 `label` 自定义显示名） |
| `leetcode` | 力扣主页 URL | 外链新标签 |

### now.json（近况）

数组，每项 `{ name(i18n), tags(i18n[]), description(i18n), startedAt(YYYY-MM) }`。

### skills.json（技能徽章墙）

```jsonc
{
  "categories": [
    {
      "id": "languages",
      "name": { "zh": "语言", "en": "Languages" },
      "items": [
        { "name": { "zh": "TypeScript", "en": "TypeScript" }, "icon": "typescript", "badge": "https://img.shields.io/…" }
      ]
    }
  ]
}
```

- `name`：技能名（i18n），按当前语言显示。
- `icon`：内置图标名。品牌名（如 `typescript`、`react`、`docker`）对应 `Icon.astro` 中内联的品牌 SVG；`generic:xxx` 使用内置线性图标（`database | image | cube | infinity | cpu | layers | check | activity | file | terminal | network` 等）。品牌图标需先在 `Icon.astro` 的 `paths` 中登记。
- `badge`：`icon` 缺省时的图片回退地址。
- 渲染为「图标 + 名称」胶囊。

### experience.json（工作经历）

`{ company(i18n), role(i18n), start(YYYY-MM), end(YYYY-MM|null), location?(i18n), highlights(i18n[]) }`，`end: null` 显示「至今 / Present」。

### awards.json（奖项证书）

`{ title(i18n), issuer?(i18n), year(number, 仅年份), url?(string) }`，按 `year` 倒序显示。

### recommendations.json（推荐）

```jsonc
{
  "tagGroups": [
    { "id": "category", "name": { "zh": "类别", "en": "Category" },
      "tags": [ { "id": "software", "name": { "zh": "软件", "en": "Software" } } ] }
  ],
  "items": [
    { "name": "Obsidian", "tags": ["software"],
      "description": { "zh": "…", "en": "…" }, "url": "https://obsidian.md", "rating": 5 }
  ]
}
```

- `items[].tags` 引用 `tagGroups` 中存在的标签 id；`rating` 为 1–5，显示为星级。
- 页面顶部为标签筛选（含「全部」），单选，属渐进增强（无 JS 时列表完整展示）。

## 项目内容 projects/\*.md

`src/content/projects/` 下每个项目一个 Markdown 文件；双语推荐成对：`<slug>.zh.md` + `<slug>.en.md`（仅一种语言时另一侧回退渲染）。

frontmatter：

```yaml
---
title: nova-ui                       # 必填，项目名
description: 一句话说明               # 必填
start: 2023-02                       # 必填，YYYY-MM
end: 2024-02                         # 可选；缺省/null = 进行中（卡片显示「至今」）
tech: [TypeScript, React, Vite]      # 可选，技术标签
repo: owner/repo                     # openSource: true 时必填（owner/repo）
url: https://example.com             # 可选，在线地址
openSource: true                     # 必填，开源/私有标识
cover: /images/xxx.png               # 可选，项目封面（建议 3:2，见下方说明）
stars: 1204                          # 可选，构建时兜底值（开源项目）
forks: 156                           # 可选，构建时兜底值
---

正文（Markdown）
```

校验（`src/content/config.ts`，zod）：`start`/`end` 格式；`end < start` 报错；`openSource: true` 且 `repo` 缺失/格式错报错。列表按 `start` 倒序、进行中置顶。

> `repo` 会被 `scripts/gen-repos.mjs` 汇总为边缘函数的仓库清单（去重、仅取 `openSource && repo`）。

> **封面（`cover`）比例建议**：列表卡片缩略图显示区固定为 **96×64（3:2）**，使用 `object-fit: cover` **居中裁切** —— 图片宽高比不是 **3:2** 时会被裁掉两端（如 2:1 会左右各裁一部分，1:1 会上下各裁一部分）。因此建议封面图使用 **3:2**（例如 `1200×800`、`600×400`）。详情页封面为 `width:100%; max-height:320px; object-fit:cover`，窄或高的图会进一步被纵向裁切；若同时在意详情页，建议用较宽的图。图片建议放在 `public/images/covers/`；PNG / WebP / SVG 可保留透明背景，JPEG 不支持透明。

## 国际化 i18n

- 文件：`src/i18n/zh.json`、`src/i18n/en.json`；**两份键集合必须完全一致**，否则构建失败（`src/utils/i18n.ts` 在构建期校验）。
- 插值：文案中用 `{name}` 占位，由 `t(lang, key, params)` 填充。
- 语言切换：替换当前路径首段（`/zh/... ↔ /en/...`），并写入 `localStorage` 的 `st:lang`。
- 根路由引导（`src/pages/index.astro`）：手动选择 > `navigator.language` > `defaultLang`；无 JS 时用 `<noscript>` 跳默认语言。
- `src/pages/404.astro`：双语并排。

新增/修改界面文案时，请**同时**改 `zh.json` 与 `en.json` 的同名键。

## 主题

- 用 CSS 变量 + `<html data-theme="light|dark">`；`src/styles/tokens.css` 定义两套色板。
- 首屏内联脚本防闪烁（`BaseLayout.astro` `<head>`）：读取 `localStorage` 的 `st:theme`，无存储时跟随系统（`prefers-color-scheme`），系统无偏好 = 浅色。
- 切换按钮写入 `st:theme`。`features.theme: false` 时固定浅色且不渲染按钮。

## 设计系统与布局

全部 token 在 `src/styles/tokens.css`：

- **色板**：浅色暖纸（`--bg #F5F3EC` / `--bg2 #FCFBF7` / `--ink #1D1B16` / `--accent #B5451F`）；暗色暖灰（`--bg #2A2723` / `--bg2 #322E28` / `--ink #EAE3D6` / `--accent #D8764F`）。
- **字体**：`--font-serif`（Fraunces / Noto Serif SC）、`--font-sans`（Noto Sans SC）、`--font-mono`（JetBrains Mono），由 `BaseLayout` 引入 Google Fonts。
- **字号 / 行高 / 间距**：`--text-*`、`--leading-*`、`--space-1..9`（4/8/12/16/24/32/48/64/96）。
- **圆角**：`--radius-pill`、`--radius-circle`、`--radius-lg`（16px）。
- **动效**：`--motion-fast/base/slow`、`--ease`；尊重 `prefers-reduced-motion`。
- **布局尺寸**：断点 `--bp: 768px`；`--sidebar-w: clamp(240px,22vw,300px)`；`--content-w: 1080px`；`--layout-w: 1440px`（整体居中上限）；`--topbar-h: 60px`。

布局（`global.css`）：

- **≥768px**：`.layout` 为居中网格（`max-width: var(--layout-w)`），左「侧栏卡」+ 右「内容卡」，各有 `--bg2` 底色、发丝线边框、16px 圆角、无阴影；侧栏 `sticky`（视口高度），内容卡 `min-height` 与侧栏平齐。
- **<768px**：单列全幅；隐藏侧栏，改用顶栏（`--topbar-h`）+ 顶栏下方的**面板式抽屉**（半透 `rgba` 背景 + `backdrop-filter` 毛玻璃、导航单行横排、点外部关闭且拦截底层点击）。

无障碍：`:focus-visible` 描边、`skip-link`、`aria-*`、`role="status"` toast、减动效适配。

## 页面与路由

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | 语言引导（跳 `/{lang}/`） |
| `/{lang}/` | `src/pages/[lang]/index.astro` | 关于（介绍、状态、GitHub 统计、联系方式） |
| `/{lang}/now` | `src/pages/[lang]/now.astro` | 近况 |
| `/{lang}/projects` | `src/pages/[lang]/projects.astro` | 项目卡片列表 |
| `/{lang}/projects/{slug}` | `src/pages/[lang]/projects/[slug].astro` | 项目详情 |
| `/{lang}/experience` | `src/pages/[lang]/experience.astro` | 经历（技能 / 工作 / 奖项） |
| `/{lang}/recommendations` | `src/pages/[lang]/recommendations.astro` | 推荐 |
| `/404` | `src/pages/404.astro` | 双语 404 |

`lang ∈ {zh, en}`；`features` 关闭的页面不生成、导航项隐藏。

## GitHub 统计

- 图片卡由 `githubStats.provider` 生成（当前仅 `stats` + `topLangs`）：
  - 统计总览：`{provider}/api?username={user}&show_icons=true&hide_border=true&locale={cn|en}&bg_color=00000000&title_color=…&text_color=…&icon_color=…`
  - 常用语言：`{provider}/api/top-langs/?username={user}&layout=compact&hide_border=true&locale={cn|en}&bg_color=00000000&title_color=…&text_color=…`
- 每张图输出**浅色 / 暗色两套** URL（`data-light` / `data-dark`），`BaseLayout` 的脚本按当前主题切换 `src`；`bg_color=00000000`（透明）使图片背景自适应所在容器（桌面卡片 / 移动页底）。
- 并排显示时用 `aspect-ratio: 450 / 195` + `object-fit: contain` 使两图等高不变形；颜色取站点 token，浅/暗各一套。
- **Star / Fork 实时刷新**：卡片输出 `data-repo="owner/repo"`，脚本 `fetch('/api/stars')`（3s 超时，失败静默）替换兜底值；受 `features.starAutoUpdate` 控制，SSR 兜底来自 frontmatter 的 `stars`/`forks`。

## 边缘函数与 API 契约

> 句柄签名与 KV API 以 EdgeOne 官方文档为准；下列为路由/鉴权/数据契约。

### `POST /api/update-stars`（`functions/api/update-stars.ts`）

- 鉴权：请求头 `x-cron-key` 必须等于环境变量 `CRON_KEY`，否则 `401`。
- 读取 `functions/api/_repos.gen.json`（`{ user, repos[] }`，构建生成）。
- 调 GitHub REST：`/users/{user}`（followers、public_repos）、逐个 `/repos/{owner}/{repo}`（stars、forks），并发上限 8，累加 `totalStars`。
- 写 KV：`user:stats`、`stars:{owner}/{repo}`。
- 返回 `{ updated, user, repos, errors }`；单个仓库失败进 `errors`，不中断。

### `GET /api/stars`（`functions/api/stars.ts`）

- 无鉴权（公开数据）。
- 返回 `{ user, repos }`；`?repos=owner/repo,owner2/repo2` 可只取指定项。
- 响应头含 `Cache-Control: public, max-age=300, s-maxage=21600, stale-while-revalidate=86400`。
- KV 无数据时 `503 { error: "no data" }`。

KV 键空间：

| Key | Value |
| --- | --- |
| `user:stats` | `{ followers, publicRepos, totalStars, updatedAt }` |
| `stars:{owner}/{repo}` | `{ stars, forks, updatedAt }` |

`scripts/gen-repos.mjs`：读取 `src/content/projects/*.md` frontmatter，取 `openSource: true` 且 `repo` 合法的条目（去重），写 `functions/api/_repos.gen.json`；该生成物已加入 `.gitignore`。

## 环境变量与密钥

在 EdgeOne Pages 控制台配置：

| 名称 | 用途 | 敏感 | 说明 |
| --- | --- | --- | --- |
| `CRON_KEY` | `/api/update-stars` 鉴权 | 是 | 随机 ≥ 32 字符（如 `openssl rand -hex 32`） |
| `GITHUB_TOKEN` | GitHub API 认证 | 是 | fine-grained、Public repositories 只读、无写权限 |
| KV 绑定（示例名 `STARS_KV`） | 缓存键空间 | 否 | 在控制台创建命名空间并绑定到函数 |

## 部署

### 1. EdgeOne Pages（站点 + 函数）

1. 控制台「导入 Git 仓库」选择本仓库，开启 push 自动构建。
2. 构建命令 `npm run build`，输出目录 `dist`，Node 版本 20。
3. 配置环境变量 `CRON_KEY`、`GITHUB_TOKEN`（生产与预览环境同配）。
4. 创建 KV 命名空间并绑定到函数（变量名与 `functions` 中使用的 `env.STARS_KV` 一致）。
5. 部署完成后验证：

   ```bash
   curl -X POST -H "x-cron-key: <CRON_KEY>" https://<你的域名>/api/update-stars
   curl https://<你的域名>/api/stars
   ```

### 2. 自定义域名（Cloudflare DNS）

1. 从 EdgeOne Pages 获取分配的默认域名（如 `<project>.deploy.edgeone.app`）。
2. Cloudflare DNS 添加 CNAME：`www`（或按 EdgeOne 要求的记录）→ EdgeOne 默认域名；**仅 DNS，先关代理（灰云）**，需要 CDN/缓存再按需开启。
3. EdgeOne 控制台「自定义域名」添加该域名并完成 DNS 验证，证书由 EdgeOne 自动签发。

### 3. 定时更新（cron-job.org）

| 项 | 值 |
| --- | --- |
| URL | `https://<你的域名>/api/update-stars` |
| 方法 | `POST` |
| 请求头 | `x-cron-key: <CRON_KEY>` |
| 频率 | 每日一次（建议 03:00，避开整点高峰） |
| 超时 | ≥ 30s |
| 失败通知 | 开启邮件通知 |

> `functions/` 目录随 EdgeOne Pages 部署自动生效，与 `features.starAutoUpdate` 解耦：开关只控制前端是否消费，函数与 cron 照常运行。

## 日常维护

| 需求 | 操作 |
| --- | --- |
| 改文案 / 经历 / 技能 / 推荐 | 编辑 `src/data/*.json` 或 `src/i18n/*.json`（双语键同步），push |
| 新增项目 | 新建 `src/content/projects/<slug>.zh.md` 与 `<slug>.en.md`，push |
| 换头像 / 封面 / 徽章图 | 替换 `public/images/` 下文件，push |
| 增删开源仓库（用于统计） | 改项目 frontmatter 的 `repo`/`openSource`，push 后 `gen-repos` 自动同步边缘函数清单 |
| 开关某功能 | 改 `src/data/site.json` 的 `features`，push |
| Star/Fork 手动刷新 | `curl -X POST -H "x-cron-key: …" https://<域名>/api/update-stars` |
| 换统计服务 | 改 `site.json.githubStats.provider` |

## 已知外部依赖与限制

- **Google Fonts**（Fraunces / Noto Serif SC / Noto Sans SC / JetBrains Mono）：`BaseLayout` 通过 `<link>` 引入；网络不可达时回退到系统字体栈。
- **GitHub 统计图**：由 `site.json.githubStats.provider` 提供（当前为 `dev-stats.mintimate.cn` 镜像）；服务不可用或不可达时图片不显示。`bg_color=00000000` 使背景透明。
- **技能图标**：品牌图标已内联在 `src/components/Icon.astro`（源自 Simple Icons），不依赖外部 CDN；新增品牌图标需在该文件补登记。
- **边缘函数**：`/api/*` 依赖 EdgeOne Pages 运行环境与 KV 绑定；本地开发需用官方本地模拟。
- 站点为纯静态 + 边缘函数，无服务端渲染、无数据库。

## 相关文档

| 文档 | 内容 |
| --- | --- |
| [`README.md`](./README.md) | **本文件**：安装、配置、数据字典、路由、API 契约、部署与维护的完整说明 |
| [`src/content/projects/*.md`](./src/content/projects) | 项目内容（frontmatter + Markdown 正文） |

---

## 致谢

- [Astro](https://astro.build) — 静态站点框架
- [EdgeOne](https://edgeone.ai) — 站点托管与边缘函数
- [Cloudflare](https://www.cloudflare.com) — DNS
- [cron-job.org](https://cron-job.org) — 定时任务
- [GitHub REST API](https://docs.github.com/en/rest) — Star/Fork 数据
- [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats) — 统计图片卡（上游项目）
- [dev-stats.mintimate.cn](https://dev-stats.mintimate.cn) — GitHub Readme Stats 镜像，本站统计图服务
- [Simple Icons](https://simpleicons.org) — 技能徽章品牌图标（已内联至 `Icon.astro`）
- [Google Fonts](https://fonts.google.com) — Fraunces / Noto Serif SC / Noto Sans SC / JetBrains Mono
