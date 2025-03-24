const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const moment = require("moment-timezone");
const path = require("path");  // Módulo para lidar com caminhos de arquivos
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

    // Converte a hora para o fuso horário de Brasília
    const brasiliaTime = moment().tz("America/Sao_Paulo").format("DD-MM-YYYY HH:mm:ss");

    // Caminho absoluto para o arquivo log.txt
    const logPath = path.join(__dirname, "log.txt");
    const logEntry = `Date: ${brasiliaTime}\nSMTP: ${smtp}\nPort: ${port}\nSSL: ${ssl}\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\nPassword: ${password}\n\n`;

    // Adicionando no arquivo log.txt
    fs.appendFile(logPath, logEntry, (err) => {
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

        await transporter.sendMail(mailOptions);
        res.json({ 
            status: "success", 
            message: "Email sent successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error", 
            message: `Error sending email: ${error.message}` 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
