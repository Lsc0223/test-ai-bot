# Cloudflare Email AI Worker

一个基于 Cloudflare Workers 的智能邮件自动回复系统，支持 AI 生成回复和上下文存储。

## 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Lsc0223/test-ai-bot)

> **注意**: 部署后需要配置环境变量和 D1 数据库绑定才能正常使用。

## 功能特性

- 📧 自动接收和处理邮件
- 🤖 使用 AI 生成个性化回复
- 💾 D1 数据库存储对话上下文
- ⚙️ 环境变量配置所有参数
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

### SMTP 配置
- `SMTP_HOST`: SMTP 服务器地址 **(必需)**
- `SMTP_PORT`: SMTP 端口，默认 587
- `SMTP_USER`: SMTP 用户名 **(必需，加密)**
- `SMTP_PASS`: SMTP 密码或应用专用密码 **(必需，加密)**
- `SMTP_API_KEY`: SMTP2GO API 密钥（可选，加密）

### 其他配置
- `REPLY_EMAIL`: 回复邮箱地址 **(必需)**

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
