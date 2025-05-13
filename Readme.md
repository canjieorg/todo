## Cloudflare Workers - Todo Reminder System

This is a Todo management system based on Cloudflare Workers. It supports adding, editing, deleting, and notifying todo items, and sends reminder messages via a Telegram Bot.

## ✨ Features

- Login authentication (password + optional reCAPTCHA)
- Add/Edit/Delete todos
- List display with pagination and sorting
- Test notification button
- Scheduled daily reminder at 14:00 Beijing Time
- Telegram Bot reminder support (with MarkdownV2 escaping)

## 🌐 Deployment Instructions



   1. Create a Worker in the Cloudflare Dashboard  
   ![AgADdxkAAgf-GFU.webp](https://cdn.canjie.org/AgADdxkAAgf-GFU.webp)
![AgADgBkAAgf-GFU.webp](https://cdn.canjie.org/AgADgBkAAgf-GFU.webp)

   2. Set environment variables via `Vars`:  
    - `PASS`: Login password (required)  
    - `TGID`: Telegram chat_id (required)  
    - `TGTOKEN`: Telegram Bot Token (required)  
    - `RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key (optional)  
    - `RECAPTCHA_SECRET`: Google reCAPTCHA secret (optional)  
   ![AgADeBkAAgf-GFU.webp](https://cdn.canjie.org/AgADeBkAAgf-GFU.webp)
  
   3. Create and bind a KV namespace `TODO_KV` to store the list of todos  
   ![AgADeRkAAgf-GFU.webp](https://cdn.canjie.org/AgADeRkAAgf-GFU.webp)

   4. Upload `worker.js` and deploy  
   ![AgADgRkAAgf-GFU.webp](https://cdn.canjie.org/AgADgRkAAgf-GFU.webp)

## 🔒 Login

Visit the home page `/` and log in with your password. The login status is managed via a `loggedIn=true` cookie.

If reCAPTCHA is enabled, verification is also required.

## 📑 API Endpoints

All API paths start with `/api/todos` and require login:

- `GET /api/todos`: Get all todos
- `GET /api/todos/:id`: Get a specific todo
- `POST /api/todos`: Create a new todo
- `PUT /api/todos/:id`: Update a todo
- `DELETE /api/todos/:id`: Delete a todo
- `POST /api/todos/:id/test-notification`: Test Telegram notification

## 🕒 Cron Job (Cron Trigger)

Set the Worker’s Cron trigger to `0 6 * * *` (UTC), which corresponds to 14:00 Beijing Time. The system will iterate through all todos and send notifications based on `advanceDays` and `continuousDays`.

## 🔔 Message Format (Telegram)

Example:

```
🔔 Dear Boss, this is a reminder from Xiaobao:

Todo: Submit the quarterly report  
Due Date: 2025/05/20  
You have 3 days left to take action.
```

## 📝 Local Debugging Tips

- Use `wrangler dev` to test page rendering
- Use the KV simulator (`wrangler kv:namespace`) to store data
- Or split logic into functions for easier testing

## 📄 License

MIT License

## Bonus Image

![AgADbxkAAgf-GFU.webp](https://cdn.canjie.org/AgADbxkAAgf-GFU.webp)
![AgADbhkAAgf-GFU.webp](https://cdn.canjie.org/AgADbhkAAgf-GFU.webp)
![AgADcRkAAgf-GFU.webp](https://cdn.canjie.org/AgADcRkAAgf-GFU.webp)
![AgADcBkAAgf-GFU.webp](https://cdn.canjie.org/AgADcBkAAgf-GFU.webp)
