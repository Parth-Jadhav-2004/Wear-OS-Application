require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const twilioSMSNumber = "+12762888227"; // Twilio's SMS number

// 🚨 **Endpoint to send SOS via SMS**
app.post("/send-sos", async (req, res) => {
    const { message, to } = req.body;

    if (!Array.isArray(to) || to.length === 0) {
        return res.status(400).json({ success: false, error: "Recipient list must be a non-empty array." });
    }

    try {
        const results = await Promise.all(
            to.map(async (number) => {
                let formattedNumber = number.toString().trim();

                // Ensure the number starts with "+"
                if (!formattedNumber.startsWith("+")) {
                    formattedNumber = `+${formattedNumber}`;
                }

                const response = await client.messages.create({
                    body: message,
                    from: twilioSMSNumber,
                    to: formattedNumber,
                });

                return { recipient: formattedNumber, messageSid: response.sid, status: "Sent" };
            })
        );

        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("❌ Error sending SOS:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
