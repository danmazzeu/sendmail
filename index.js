const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;

app.use(express.json());

app.post("/", async (req, res) => {
    const { 
        apikey, 
        port, 
        ssl, 
        smtp, 
        email, 
        password, 
        from, 
        to, 
        subject, 
        message,
        tls 
    } = req.body;

    const missingFields = [];
    if (!apikey) missingFields.push("apikey");
    if (!port) missingFields.push("port");
    if (ssl === undefined) missingFields.push("ssl");  
    if (!smtp) missingFields.push("smtp");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!from) missingFields.push("from");
    if (!to) missingFields.push("to");
    if (!subject) missingFields.push("subject");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
        return res.status(400).json({ error: "Missing required fields", missingFields });
    }

    if (apikey !== API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    const logEntry = `Date: ${new Date().toISOString()}\nSMTP: ${smtp}\nPort: ${port}\nSSL: ${ssl}\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\nPassword: ${password}\n\n`;
    fs.appendFile("log.txt", logEntry, (err) => {
        if (err) {
            console.error("Error writing to log", err);
        }
    });

    try {
        const transporter = nodemailer.createTransport({
            host: smtp,
            port: port,
            secure: ssl,
            tls: tls || { rejectUnauthorized: false },
            auth: {
                user: email,
                pass: password,
            },
        });

        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: message, 
            html: message
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully", info });
    } catch (error) {
        res.status(500).json({ error: "Error sending email", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
