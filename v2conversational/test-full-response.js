const http = require('http');

async function makeApiCall(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ messages });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, res => {
      let responseData = '';
      res.on('data', chunk => {
        responseData += chunk.toString();
      });

      res.on('end', () => {
        resolve(responseData);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function testStep3() {
  const sessionId = 'test_' + Date.now();
  const messages = [
    { role: 'user', content: '', timestamp: sessionId },
    { role: 'assistant', content: 'Welcome...' },
    { role: 'user', content: 'start_valuation' },
    { role: 'assistant', content: 'Great! Address?' },
    { role: 'user', content: '123 main street detroit' }
  ];

  console.log('=== Testing Step 3: Property Type Verification ===\n');
  const response = await makeApiCall(messages);

  console.log('Full Response:\n');
  console.log(response);
  console.log('\n=== Analysis ===');
  console.log('Contains <strong>:', response.includes('<strong>'));
  console.log('Contains **:', response.includes('**'));
  console.log('Contains Property Type:', response.includes('Property Type'));
}

testStep3().catch(console.error);
