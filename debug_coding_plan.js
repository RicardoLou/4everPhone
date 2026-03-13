// 专门用于调试 Coding Plan 接口的 Node.js 脚本
// 由于浏览器环境存在 CORS 限制，需要通过后端代理来访问 Coding Plan 接口

const https = require('https');
const fs = require('fs');

// 从 nn_phone.html 中读取配置
const htmlContent = fs.readFileSync('../MNPhone/nn_phone.html', 'utf8');

// 提取 API 配置
const apiKeyMatch = htmlContent.match(/key:\s*'([^']+)'/);
const apiUrlMatch = htmlContent.match(/url:\s*'([^']+)'/);
const modelMatch = htmlContent.match(/model:\s*'([^']+)'/);

if (!apiKeyMatch || !apiUrlMatch || !modelMatch) {
    console.error('无法从 nn_phone.html 中提取 API 配置');
    process.exit(1);
}

const API_KEY = apiKeyMatch[1];
const API_URL = apiUrlMatch[1];
const MODEL = modelMatch[1];

console.log('检测到的配置:');
console.log('API Key:', API_KEY ? '已找到' : '未找到');
console.log('API URL:', API_URL);
console.log('Model:', MODEL);

// 测试请求
async function testCodingPlanAPI() {
    const testMessage = {
        model: MODEL,
        messages: [
            { role: 'user', content: '你好，这是一个测试消息' }
        ],
        stream: false
    };

    const postData = JSON.stringify(testMessage);
    
    const options = {
        hostname: 'coding.dashscope.aliyuncs.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('响应状态码:', res.statusCode);
                    console.log('响应头:', res.headers);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ 请求成功!');
                        console.log('响应内容:', JSON.stringify(response, null, 2));
                    } else {
                        console.log('❌ 请求失败!');
                        console.log('错误详情:', response);
                    }
                    
                    resolve(response);
                } catch (e) {
                    console.log('解析响应失败:', e);
                    console.log('原始响应:', data);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.log('请求错误:', e.message);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

console.log('\n开始测试 Coding Plan API 连接...');
testCodingPlanAPI()
    .then(result => {
        console.log('\n测试完成');
    })
    .catch(err => {
        console.log('\n测试失败:', err.message);
    });