# ✉️ Cloudflare Email AI Worker

<div align="center">
  <h1>✉️ 智能邮件自动回复系统</h1>
  <p>基于 Cloudflare Workers 的 AI 驱动邮件助手，让邮件回复更智能、更高效</p>
  
  <p>
    <img src="https://img.shields.io/badge/Cloudflare-Workers-orange?style=flat-square&logo=cloudflare" alt="Cloudflare Workers">
    <img src="https://img.shields.io/badge/AI-Powered-blue?style=flat-square&logo=openai" alt="AI Powered">
    <img src="https://img.shields.io/badge/Database-D1-green?style=flat-square&logo=sqlite" alt="D1 Database">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  </p>
</div>

## 🚀 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Lsc0223/test-ai-bot)

> **注意**: 部署后需要配置环境变量和 D1 数据库绑定才能正常使用。

## 📋 项目介绍

这是一个现代化的智能邮件处理系统，专为需要自动化邮件回复的个人和企业设计。系统利用先进的 AI 技术，结合 Cloudflare 的全球边缘网络，为用户提供快速、智能、个性化的邮件自动回复服务。

### 🎯 核心优势

- **🧠 智能回复**: 基于 GPT 等先进 AI 模型，生成自然、相关的邮件回复
- **💾 上下文记忆**: 使用 D1 数据库存储对话历史，提供连贯的多轮对话体验
- **⚡ 全球加速**: 依托 Cloudflare 边缘网络，确保全球范围内的快速响应
- **🔧 高度可定制**: 支持自定义 AI 提示词，适应不同的业务场景和回复风格
- **🛡️ 安全可靠**: 企业级安全保障，敏感信息加密存储
- **💰 成本效益**: 基于 Serverless 架构，按需付费，无需维护服务器

### 🏢 适用场景

- **客户服务**: 自动回复客户咨询，提供 24/7 支持
- **个人助理**: 处理日常邮件，智能分类和回复
- **营销推广**: 个性化回复潜在客户询问
- **技术支持**: 自动回答常见技术问题
- **商务沟通**: 维护专业的商务邮件往来

## ✨ 功能特性

- 📧 **自动邮件处理**: 实时接收和处理入站邮件
- 🤖 **AI 智能回复**: 基于邮件内容生成个性化回复
- 💾 **对话上下文**: D1 数据库存储完整对话历史
- ⚙️ **灵活配置**: 通过环境变量配置所有参数
- 🎯 **自定义提示词**: 完全控制 AI 回复的风格和行为
- 🔄 **多 SMTP 支持**: 兼容主流邮件服务商
- 📊 **状态监控**: 内置健康检查和日志记录
- 🔒 **安全加密**: 敏感信息安全存储和传输

## 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Lsc0223/test-ai-bot)

> **注意**: 部署后需要配置环境变量和 D1 数据库绑定才能正常使用。

## 功能特性

- 📧 自动接收和处理邮件
- 🤖 使用 AI 生成个性化回复
- 💾 D1 数据库存储对话上下文
- ⚙️ 环境变量配置所有参数
- 🎯 自定义 AI 回复提示词
- 🔄 支持多种 SMTP 服务商

## 快速部署（推荐）

### 方法一：Cloudflare Dashboard 部署

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 进入 Workers & Pages

2. **创建新 Worker**
   - 点击 "Create application"
   - 选择 "Create Worker"
   - 输入 Worker 名称（如：email-ai-bot）

3. **上传代码**
   - 将 `worker.js` 的内容复制到编辑器中
   - 点击 "Save and Deploy"

4. **创建 D1 数据库**
   - 在左侧菜单选择 "D1 SQL Database"
   - 点击 "Create database"
   - 数据库名称：`email-ai-db`
   - 记录数据库 ID

5. **绑定数据库到 Worker**
   - 回到 Worker 设置页面
   - 进入 "Settings" → "Variables"
   - 在 "D1 Database Bindings" 中添加：
     - Variable name: `DB`
     - D1 database: 选择刚创建的数据库

6. **配置环境变量**
   在 "Environment Variables" 中添加以下变量：

   **必需变量：**
   \`\`\`
   AI_API_KEY = your_openai_api_key (加密)
   REPLY_EMAIL = your-reply@example.com
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = your-email@gmail.com (加密)
   SMTP_PASS = your-app-password (加密)
   \`\`\`

   **可选变量：**
   \`\`\`
   AI_API_BASE_URL = https://api.openai.com/v1
   AI_MODEL = gpt-3.5-turbo
   AI_MAX_TOKENS = 500
   AI_TEMPERATURE = 0.7
   AI_SYSTEM_PROMPT = 你是一个专业的邮件助手...
   SMTP_API_KEY = your_smtp2go_key (如使用 SMTP2GO，加密)
   \`\`\`

7. **初始化数据库**
   - 部署完成后，访问：`https://your-worker.your-subdomain.workers.dev/setup-db`
   - 看到 "Database initialized successfully" 表示成功

8. **配置邮件路由**
   - 在 Cloudflare Dashboard 中进入 "Email Routing"
   - 添加路由规则：将目标邮箱的邮件转发到你的 Worker

### 方法二：命令行部署

如果你熟悉命令行，也可以使用传统方式：

\`\`\`bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create email-ai-db

# 更新 wrangler.toml 中的数据库 ID

# 设置敏感环境变量
wrangler secret put AI_API_KEY
wrangler secret put SMTP_USER
wrangler secret put SMTP_PASS

# 部署
wrangler deploy

# 初始化数据库
curl -X POST https://your-worker.your-subdomain.workers.dev/setup-db
\`\`\`

## 环境变量详细说明

### AI 配置
- `AI_API_KEY`: OpenAI 或其他 AI 服务的 API 密钥 **(必需，加密)**
- `AI_API_BASE_URL`: API 基础 URL，默认 OpenAI
- `AI_MODEL`: 使用的模型，默认 `gpt-3.5-turbo`
- `AI_MAX_TOKENS`: 回复最大长度，默认 500
- `AI_TEMPERATURE`: 创造性程度，默认 0.7
- `AI_SYSTEM_PROMPT`: 自定义 AI 回复的系统提示词，用于控制回复风格和行为

### SMTP 配置
- `SMTP_HOST`: SMTP 服务器地址 **(必需)**
- `SMTP_PORT`: SMTP 端口，默认 587
- `SMTP_USER`: SMTP 用户名 **(必需，加密)**
- `SMTP_PASS`: SMTP 密码或应用专用密码 **(必需，加密)**
- `SMTP_API_KEY`: SMTP2GO API 密钥（可选，加密）

### 其他配置
- `REPLY_EMAIL`: 回复邮箱地址 **(必需)**

## AI 提示词自定义

通过设置 `AI_SYSTEM_PROMPT` 环境变量，你可以完全自定义 AI 的回复风格：

### 示例提示词

**专业客服风格：**
\`\`\`
你是一个专业的客服代表，请用礼貌、友好的语气回复邮件。始终保持专业态度，提供有用的信息，并在适当时候询问是否需要进一步帮助。
\`\`\`

**个人助理风格：**
\`\`\`
你是我的个人邮件助理，请用简洁、直接的方式回复邮件。根据邮件内容的重要性和紧急程度来调整回复的详细程度。
\`\`\`

**技术支持风格：**
\`\`\`
你是一个技术支持专家，请用清晰、准确的语言回复技术相关的邮件。提供具体的解决方案和步骤，必要时询问更多技术细节。
\`\`\`

**创意营销风格：**
\`\`\`
你是一个创意营销专家，请用有趣、吸引人的语气回复邮件。保持品牌调性，适当使用emoji，让回复更加生动有趣。
\`\`\`

## 常见 SMTP 配置

### Gmail
\`\`\`
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-16-digit-app-password
\`\`\`

### Outlook/Hotmail
\`\`\`
SMTP_HOST = smtp-mail.outlook.com
SMTP_PORT = 587
SMTP_USER = your-email@outlook.com
SMTP_PASS = your-password
\`\`\`

### SMTP2GO（推荐用于生产环境）
\`\`\`
SMTP_API_KEY = your-smtp2go-api-key
\`\`\`

## 使用方法

1. **发送测试邮件**
   - 向配置的邮箱发送邮件
   - 系统会自动生成 AI 回复并发送

2. **监控状态**
   - 访问 `https://your-worker.workers.dev/health` 检查系统状态
   - 在 Cloudflare Dashboard 中查看 Worker 日志

3. **管理对话**
   - 系统自动保存每个发件人的对话历史
   - 提供上下文感知的个性化回复

## 故障排除

### 常见问题

1. **邮件无法发送**
   - 检查 SMTP 配置是否正确
   - 确认邮箱密码是应用专用密码（Gmail）
   - 查看 Worker 日志获取详细错误信息

2. **AI 回复异常**
   - 验证 AI_API_KEY 是否有效
   - 检查 API 配额是否充足
   - 确认网络连接正常

3. **数据库错误**
   - 确认 D1 数据库已正确绑定
   - 访问 `/setup-db` 重新初始化数据库

### 获取帮助

- 查看 Cloudflare Workers 文档
- 检查 Worker 运行日志
- 确认所有环境变量配置正确

## 安全建议

- 所有敏感信息（API 密钥、密码）务必设置为加密变量
- 定期更换 API 密钥和密码
- 监控 Worker 的使用情况和日志
- 考虑设置速率限制防止滥用
