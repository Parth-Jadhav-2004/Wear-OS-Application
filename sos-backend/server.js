require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Endpoint to send SOS to multiple WhatsApp numbers
app.post('/send-sos', async (req, res) => {
    const { message, to } = req.body;

    if (!Array.isArray(to)) {
        return res.status(400).json({ success: false, error: "Recipient list must be an array of numbers" });
    }

    try {
        const results = await Promise.all(
            to.map(async (number) => {
                const response = await client.messages.create({
                    body: message,
                    from: 'whatsapp:+14155238886', // Twilio's WhatsApp number
                    to: `whatsapp:${number}`
                });
                return { number, messageSid: response.sid };
            })
        );

        res.status(200).json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => console.log(`✅ Backend running on port ${port}`));
