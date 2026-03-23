const http = require('http');

// Test the API with proper message flow
const messages = [
  { role: 'user', content: '', timestamp: 'test123' },
  { role: 'assistant', content: 'Welcome to Rocket Valuation!' },
  { role: 'user', content: 'start_valuation' },
  { role: 'assistant', content: 'Great! Address?' },
  { role: 'user', content: '123 main street detroit' }
];

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
  console.log(`Status: ${res.statusCode}`);

  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk.toString();
  });

  res.on('end', () => {
    console.log('\n=== Response ===');
    // Show first 1000 chars
    console.log(responseData.substring(0, 1000));

    // Check for <strong> tags
    if (responseData.includes('<strong>')) {
      console.log('\n✓ Found <strong> tags in response!');
    } else if (responseData.includes('**')) {
      console.log('\n✗ Still using ** markdown');
    }
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
