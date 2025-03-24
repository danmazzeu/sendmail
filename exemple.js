const testEmail = async () => {
    const response = await fetch("https://sendmail-production-286f.up.railway.app/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apikey: "352c42aac430f7ff93734db9bdf828c9",
            port: 587, // Porta TLS
            ssl: false, // Usando TLS, por isso ssl é false
            smtp: "smtp.gmail.com",
            email: "danmzzu@gmail.com",
            password: "krqq ozuv wwth ouwy",
            from: '"Daniel Mazzeu" <danmzzu@gmail.com>',
            to: "danmzzu@gmail.com",
            subject: "Teste de API",
            text: "Este é um e-mail de teste enviado pela API." // Pode ser text ou html
        })
    });

    const data = await response.json();
    console.log("Resposta da API:", data);
};

testEmail();

