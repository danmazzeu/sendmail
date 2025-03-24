const testEmail = async () => {
    const response = await fetch("https://sendmail-production-286f.up.railway.app/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apikey: "352c42aac430f7ff93734db9bdf828c9",
            port: 587,
            ssl: false,
            smtp: "smtp.gmail.com",
            email: "danmzzu@gmail.com",
            password: "krqq ozuv wwth ouwy",
            from: '"Daniel Mazzeu" <danmzzu@gmail.com>',
            to: "danmzzu@gmail.com",
            subject: "Teste de API",
            message: "Este é um e-mail de teste enviado pela API."
        })
    });

    const data = await response.json();
    console.log("Status:", data.status);
    console.log("Message:", data.message);
};

testEmail();
