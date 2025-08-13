// Cloudflare Worker for AI Email Auto-Reply
// 支持接收邮件、AI 回复、SMTP 发送和 D1 数据库存储上下文

export default {
  async email(message, env, ctx) {
    try {
      // 解析邮件内容
      const emailData = await parseEmail(message)

      // 获取或创建对话上下文
      const context = await getConversationContext(env.DB, emailData.from)

      // 使用 AI 生成回复
      const aiResponse = await generateAIResponse(emailData.subject, emailData.text, context, env)

      // 保存对话到数据库
      await saveConversation(env.DB, emailData.from, emailData.text, aiResponse)

      // 发送回复邮件
      await sendReply(emailData, aiResponse, env)

      console.log(`Successfully processed email from ${emailData.from}`)
    } catch (error) {
      console.error("Error processing email:", error)
    }
  },

  async fetch(request, env, ctx) {
    // 处理 HTTP 请求（可用于健康检查或管理接口）
    if (request.method === "GET") {
      return new Response("Email AI Worker is running", { status: 200 })
    }

    if (request.method === "POST" && new URL(request.url).pathname === "/setup-db") {
      // 初始化数据库表
      await setupDatabase(env.DB)
      return new Response("Database setup completed", { status: 200 })
    }

    return new Response("Method not allowed", { status: 405 })
  },
}

// 解析邮件内容
async function parseEmail(message) {
  const rawEmail = await new Response(message.raw).text()

  return {
    from: message.from,
    to: message.to,
    subject: message.headers.get("subject") || "No Subject",
    text: await extractTextContent(rawEmail),
    messageId: message.headers.get("message-id"),
    date: new Date().toISOString(),
  }
}

// 提取邮件文本内容
async function extractTextContent(rawEmail) {
  // 简单的文本提取，实际项目中可能需要更复杂的邮件解析
  const lines = rawEmail.split("\n")
  let inBody = false
  let textContent = ""

  for (const line of lines) {
    if (line.trim() === "" && !inBody) {
      inBody = true
      continue
    }
    if (inBody) {
      textContent += line + "\n"
    }
  }

  return textContent.trim()
}

// 获取对话上下文
async function getConversationContext(db, fromEmail) {
  try {
    const stmt = db.prepare(`
      SELECT content, response, created_at 
      FROM conversations 
      WHERE email = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `)

    const results = await stmt.bind(fromEmail).all()

    return results.results.map((row) => ({
      user: row.content,
      assistant: row.response,
      timestamp: row.created_at,
    }))
  } catch (error) {
    console.error("Error getting context:", error)
    return []
  }
}

// 使用 AI 生成回复
async function generateAIResponse(subject, content, context, env) {
  const defaultPrompt = `你是一个专业的邮件助手。请根据邮件内容生成合适的回复。
回复要求：
1. 语气友好专业
2. 内容简洁明了
3. 根据上下文提供个性化回复
4. 使用中文回复（除非原邮件是其他语言）

邮件主题：${subject}`

  const systemPrompt = env.AI_SYSTEM_PROMPT || defaultPrompt

  const messages = [{ role: "system", content: systemPrompt }]

  // 添加历史对话上下文
  context.forEach((ctx) => {
    messages.push({ role: "user", content: ctx.user })
    messages.push({ role: "assistant", content: ctx.assistant })
  })

  // 添加当前邮件内容
  messages.push({ role: "user", content: content })

  try {
    const response = await fetch(`${env.AI_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.AI_MODEL || "gpt-3.5-turbo",
        messages: messages,
        max_tokens: Number.parseInt(env.AI_MAX_TOKENS) || 500,
        temperature: Number.parseFloat(env.AI_TEMPERATURE) || 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`AI API error: ${data.error?.message || "Unknown error"}`)
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("AI generation error:", error)
    return `感谢您的邮件。我们已收到您的消息，会尽快回复您。

如有紧急事务，请直接联系我们。

此邮件由 AI 助手自动生成。`
  }
}

// 保存对话到数据库
async function saveConversation(db, email, content, response) {
  try {
    const stmt = db.prepare(`
      INSERT INTO conversations (email, content, response, created_at)
      VALUES (?, ?, ?, ?)
    `)

    await stmt.bind(email, content, response, new Date().toISOString()).run()
  } catch (error) {
    console.error("Error saving conversation:", error)
  }
}

// 发送回复邮件
async function sendReply(originalEmail, replyContent, env) {
  const replySubject = originalEmail.subject.startsWith("Re:") ? originalEmail.subject : `Re: ${originalEmail.subject}`

  const emailBody = `${replyContent}

---
此邮件由 AI 助手自动生成
如需人工服务，请回复此邮件说明`

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": env.SMTP_API_KEY,
      },
      body: JSON.stringify({
        api_key: env.SMTP_API_KEY, // 添加 api_key 到请求体
        sender: env.REPLY_EMAIL,
        to: [originalEmail.from],
        subject: replySubject,
        text_body: emailBody,
        html_body: emailBody.replace(/\n/g, "<br>"),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SMTP error: ${error}`)
    }

    console.log(`Reply sent successfully to ${originalEmail.from}`)
  } catch (error) {
    console.error("Error sending reply:", error)

    // 备用 SMTP 方案（使用标准 SMTP）
    await sendReplyFallback(originalEmail, replyContent, env)
  }
}

// 备用 SMTP 发送方案
async function sendReplyFallback(originalEmail, replyContent, env) {
  try {
    if (env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.REPLY_EMAIL,
          to: [originalEmail.from],
          subject: originalEmail.subject.startsWith("Re:") ? originalEmail.subject : `Re: ${originalEmail.subject}`,
          text: replyContent,
          html: replyContent.replace(/\n/g, "<br>"),
        }),
      })

      if (response.ok) {
        console.log(`Resend fallback reply sent to ${originalEmail.from}`)
        return
      }
    }

    const smtpPort = env.SMTP_PORT || "587"
    const smtpUrl = `https://smtp-relay.sendinblue.com/api/v3/smtp/email` // 使用 Sendinblue 作为备用

    if (env.SENDINBLUE_API_KEY) {
      const response = await fetch(smtpUrl, {
        method: "POST",
        headers: {
          "api-key": env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: env.REPLY_EMAIL },
          to: [{ email: originalEmail.from }],
          subject: originalEmail.subject.startsWith("Re:") ? originalEmail.subject : `Re: ${originalEmail.subject}`,
          textContent: replyContent,
          htmlContent: replyContent.replace(/\n/g, "<br>"),
        }),
      })

      if (response.ok) {
        console.log(`Sendinblue fallback reply sent to ${originalEmail.from}`)
        return
      }
    }

    throw new Error("All SMTP methods failed")
  } catch (error) {
    console.error("All fallback SMTP methods failed:", error)
  }
}

// 初始化数据库
async function setupDatabase(db) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_email_date 
      ON conversations(email, created_at);
    `)

    console.log("Database tables created successfully")
  } catch (error) {
    console.error("Database setup error:", error)
    throw error
  }
}
