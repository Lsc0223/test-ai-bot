# 数据库设置指南

## 初始化 D1 数据库

在部署 Worker 之前，你需要先创建和初始化 D1 数据库。

### 方法一：使用 Wrangler CLI

1. 创建 D1 数据库：
\`\`\`bash
npx wrangler d1 create email-ai-bot
\`\`\`

2. 复制输出的数据库配置到 `wrangler.toml` 文件中

3. 执行初始化脚本：
\`\`\`bash
npx wrangler d1 execute email-ai-bot --file=./scripts/init-database.sql
\`\`\`

### 方法二：使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** > **D1 SQL Database**
3. 点击 **Create database**，命名为 `email-ai-bot`
4. 进入数据库详情页面
5. 在 **Console** 标签页中，复制并执行 `scripts/init-database.sql` 中的 SQL 语句

### 数据库表结构

- **conversations**: 存储邮件对话上下文
  - `id`: 主键，自增
  - `email_from`: 发件人邮箱
  - `email_to`: 收件人邮箱  
  - `subject`: 邮件主题
  - `message_id`: 邮件唯一标识
  - `context`: 对话上下文（JSON 格式）
  - `created_at`: 创建时间
  - `updated_at`: 更新时间

### 绑定数据库到 Worker

确保在 `wrangler.toml` 中正确配置了数据库绑定：

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "email-ai-bot"
database_id = "your-database-id"
