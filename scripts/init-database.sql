-- 创建对话上下文表
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_from TEXT NOT NULL,
    email_to TEXT NOT NULL,
    subject TEXT,
    message_id TEXT UNIQUE,
    context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_conversations_email_from ON conversations(email_from);
CREATE INDEX IF NOT EXISTS idx_conversations_email_to ON conversations(email_to);
CREATE INDEX IF NOT EXISTS idx_conversations_message_id ON conversations(message_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- 创建触发器自动更新 updated_at 字段
CREATE TRIGGER IF NOT EXISTS update_conversations_updated_at 
    AFTER UPDATE ON conversations
    FOR EACH ROW
BEGIN
    UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
