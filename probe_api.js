
const https = require('https');

const configs = [
    {
        name: "Config 1: Original URL + gpt-5.2",
        hostname: 'coding.dashscope.aliyuncs.com',
        path: '/v1/chat/completions',
        model: 'gpt-5.2'
    },
    {
        name: "Config 2: Compatible URL + gpt-5.2",
        hostname: 'coding.dashscope.aliyuncs.com',
        path: '/compatible-mode/v1/chat/completions',
        model: 'gpt-5.2'
    }
];

function test(config) {
    const data = JSON.stringify({
        model: config.model,
        messages: [{role: 'user', content: 'Hello'}],
        stream: false
    });

    const options = {
        hostname: config.hostname,
        path: config.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-sp-f74c7a8ed1424800a189f8231959b1a3'
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`\n--- ${config.name} ---`);
            console.log('Status Code:', res.statusCode);
            console.log('Body:', body.substring(0, 200)); // Truncate
        });
    });

    req.on('error', (e) => {
        console.error(`\n--- ${config.name} Error ---`, e.message);
    });

    req.write(data);
    req.end();
}

configs.forEach(c => test(c));
