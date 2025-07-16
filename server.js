const express = require('express');
const line = require('@line/bot-sdk');

// config จาก environment variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
app.use(express.json());
app.use(line.middleware(config)); // middleware สำหรับ verify signature จาก LINE

const client = new line.Client(config);

// Webhook route
app.post('/webhook', async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.status(200).end(); // ✅ ตอบกลับ 200 OK
  } catch (error) {
    console.error('Error handling event:', error);
    res.status(500).end(); // ❗ควรเปลี่ยนเป็น 200 เพื่อให้ LINE เข้าใจว่ารับ event ได้
  }
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const text = event.message.text;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `คุณพิมพ์ว่า "${text}" ใช่ไหมครับ`,
  });
}

app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});