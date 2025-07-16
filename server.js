const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
app.use(express.json());
app.use(line.middleware(config));

const client = new line.Client(config);

app.post('/webhook', async (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const userId = event.source.userId;
  const text = event.message.text;

  // ตัวอย่าง: ตอบกลับข้อความเดิม
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
