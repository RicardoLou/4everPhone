
const https = require('https');

const data = JSON.stringify({
    model: 'gpt-5.2',
    messages: [{role: 'user', content: 'Hello'}],
    stream: false
});

const options = {
    hostname: 'dashscope.aliyuncs.com',
    path: '/compatible-mode/v1/chat/completions', // Standard OpenAI compatible endpoint
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
        console.log('Status Code:', res.statusCode);
        console.log('Body:', body);
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(data);
req.end();
