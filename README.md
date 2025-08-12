# Cloudflare Email AI Worker

一个基于 Cloudflare Workers 的智能邮件自动回复系统，支持 AI 生成回复和上下文存储。

## 功能特性

- 📧 自动接收和处理邮件
- 🤖 使用 AI 生成个性化回复
- 💾 D1 数据库存储对话上下文
- ⚙️ 环境变量配置所有参数
- 🔄 支持多种 SMTP 服务商

## 部署步骤

### 1. 安装 Wrangler CLI

\`\`\`bash
npm install -g wrangler
\`\`\`

### 2. 登录 Cloudflare

\`\`\`bash
wrangler login
\`\`\`

### 3. 创建 D1 数据库

\`\`\`bash
wrangler d1 create email-ai-db
\`\`\`

复制返回的数据库 ID 到 `wrangler.toml` 文件中。

### 4. 设置环境变量

\`\`\`bash
# AI API 密钥
wrangler secret put AI_API_KEY

# SMTP 配置
wrangler secret put SMTP_API_KEY  # 如果使用 SMTP2GO
wrangler secret put SMTP_USER     # SMTP 用户名
wrangler secret put SMTP_PASS     # SMTP 密码
\`\`\`

### 5. 初始化数据库

\`\`\`bash
wrangler deploy
curl -X POST https://your-worker.your-subdomain.workers.dev/setup-db
\`\`\`

### 6. 配置邮件路由

在 Cloudflare Dashboard 中：
1. 进入 Email Routing
2. 添加路由规则，将邮件转发到你的 Worker

## 环境变量说明

### AI 配置
- `AI_API_KEY`: AI API 密钥（敏感）
- `AI_API_BASE_URL`: AI API 基础 URL
- `AI_MODEL`: 使用的 AI 模型
- `AI_MAX_TOKENS`: 最大 token 数
- `AI_TEMPERATURE`: 生成温度

### SMTP 配置
- `SMTP_HOST`: SMTP 服务器地址
- `SMTP_PORT`: SMTP 端口
- `SMTP_USER`: SMTP 用户名（敏感）
- `SMTP_PASS`: SMTP 密码（敏感）
- `SMTP_API_KEY`: SMTP2GO API 密钥（敏感，可选）

### 其他配置
- `REPLY_EMAIL`: 回复邮箱地址

## 支持的 AI 服务

- OpenAI GPT
- Azure OpenAI
- 其他兼容 OpenAI API 的服务

## 支持的 SMTP 服务

- Gmail SMTP
- SMTP2GO
- SendGrid
- 其他标准 SMTP 服务

## 使用方法

1. 部署 Worker 后，任何发送到配置邮箱的邮件都会触发 AI 回复
2. 系统会自动保存对话上下文，提供个性化回复
3. 可以通过 HTTP 接口管理和监控系统状态

## 注意事项

- 确保 D1 数据库已正确配置
- 敏感信息请使用 `wrangler secret put` 设置
- 定期检查邮件处理日志
- 根据需要调整 AI 参数以获得最佳回复效果
