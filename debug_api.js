
const https = require('https');

const data = JSON.stringify({
    model: 'glm-5',
    messages: [{role: 'user', content: 'Hello'}],
    stream: false
});

const options = {
    hostname: 'coding.dashscope.aliyuncs.com',
    path: '/v1/chat/completions',
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
