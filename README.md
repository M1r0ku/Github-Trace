# GitHub-Trace

## 项目简介

基于 Shadcn UI 和 Next.js 的 Web 应用，用于通过 GitHub 提交历史查找用户名和邮箱之间的连接关系。

技术栈：

- **前端框架**：Next.js 14 (App Router)
- **UI 组件库**：Shadcn UI
- **样式方案**：Tailwind CSS
- **图标库**：Lucide React

文件结构：

```
Github-Trace/
├── components.json           # Shadcn UI 配置
├── next.config.js            # Next.js 配置
├── package.json              # 项目依赖和脚本配置
├── postcss.config.js         # 样式处理文件
├── tailwind.config.js        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
├── README.md                 # 精简版说明文档
├── app/                      # Next.js 应用目录
│   ├── globals.css           # 全局样式和主题
│   ├── layout.tsx            # 根布局组件
│   └── page.tsx              # 主页面组件
├── components/ui/            # Shadcn UI 组件库
│   ├── alert.tsx             # 警告组件
│   ├── button.tsx            # 按钮组件
│   ├── card.tsx              # 卡片组件
│   ├── input.tsx             # 输入框组件
│   └── skeleton.tsx          # 骨架屏组件
└── lib/                      # 工具库
    ├── github-api.ts         # GitHub API 集成
    └── utils.ts              # 通用工具函数
```

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FM1r0ku%2FGithub-Trace)

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

3. 构建生产版本

```bash
npm run build
npm run start

```

## 更新日志

### v1.0
- 完善邮箱查找功能，同时获取 `commit.author.name` 和 `author.login` 属性
- 优化用户界面，改为单卡片设计
- 精简项目结构，去除不必要的文件
