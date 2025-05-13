## Cloudflare Workers - 待办事项提醒系统

这是一个基于 Cloudflare Workers 的 Todo 管理系统，支持添加、编辑、删除和通知待办事项，并通过 Telegram Bot 发送提醒消息。

## ✨ 功能特点

- 登录验证（支持密码 + 可选 reCAPTCHA 验证）
- 添加/编辑/删除待办事项
- 列表分页、排序展示
- 测试通知按钮
- 每天北京时间 14:00 定时任务推送提醒
- 支持 Telegram Bot 通知提醒（含 MarkdownV2 转义）

## 🌐 部署方式
1. 在 Cloudflare Dashboard 创建一个 Worker
![AgADdxkAAgf-GFU.webp](https://cdn.canjie.org/AgADdxkAAgf-GFU.webp)
![AgADgBkAAgf-GFU.webp](https://cdn.canjie.org/AgADgBkAAgf-GFU.webp)
2. 设置环境变量（环境变量通过 Vars 设置）：

   - PASS：登录密码（必填）
   - TGID：Telegram chat_id（必填）
   - TGTOKEN：Telegram Bot Token（必填）
   - RECAPTCHA_SITE_KEY：Google reCAPTCHA site key（可选）
   - RECAPTCHA_SECRET：Google reCAPTCHA secret（可选）

![AgADeBkAAgf-GFU.webp](https://cdn.canjie.org/AgADeBkAAgf-GFU.webp)

3. 创建并绑定 KV 命名空间 TODO_KV，用于存储 todos 列表
![AgADeRkAAgf-GFU.webp](https://cdn.canjie.org/AgADeRkAAgf-GFU.webp)
4. 上传 worker.js 并保存部署
![AgADgRkAAgf-GFU.webp](https://cdn.canjie.org/AgADgRkAAgf-GFU.webp)
## 🔒 登录

访问首页 `/`，输入密码登录。登录后通过 Cookie 管理状态（`loggedIn=true`）。

如启用了 reCAPTCHA，还需通过验证码验证。

## 📑 API 接口

所有接口路径均以 `/api/todos` 开头，必须登录状态才能调用：

- `GET /api/todos`：获取全部待办事项
- `GET /api/todos/:id`：获取单条待办
- `POST /api/todos`：新增
- `PUT /api/todos/:id`：更新
- `DELETE /api/todos/:id`：删除
- `POST /api/todos/:id/test-notification`：测试发送 Telegram 通知

## 🕒 定时任务（Cron Trigger）

设置 Worker 的 Cron 触发时间为每天 `0 6 * * *`（UTC）即北京时间 14:00。系统会自动遍历所有待办事项，根据 `advanceDays` 和 `continuousDays` 发送通知。

## 🔔 消息格式（Telegram）

示例：

```
🔔 尊敬的老板，小宝奉命提醒您：

待办事项：提交季度报表  
待办日期：2025/05/20  
您还有 3 天的时间来处理。
```

## 📝 本地调试建议

- 使用 `wrangler dev` 测试页面渲染
- 使用 KV 模拟器 (`wrangler kv:namespace`) 存储数据
- 或将业务逻辑拆分到函数中便于测试

## 📄 License

MIT License

## 美图欣赏
![AgADbxkAAgf-GFU.webp](https://cdn.canjie.org/AgADbxkAAgf-GFU.webp)
![AgADbhkAAgf-GFU.webp](https://cdn.canjie.org/AgADbhkAAgf-GFU.webp)
![AgADcRkAAgf-GFU.webp](https://cdn.canjie.org/AgADcRkAAgf-GFU.webp)
![AgADcBkAAgf-GFU.webp](https://cdn.canjie.org/AgADcBkAAgf-GFU.webp)
