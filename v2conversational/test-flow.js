const http = require('http');

// Simulate multi-step conversation flow
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

async function testFlow() {
  const sessionId = 'test_' + Date.now();
  const messages = [];

  console.log('=== STEP 1: Initial empty message ===');
  messages.push({ role: 'user', content: '', timestamp: sessionId });
  let response = await makeApiCall(messages);
  console.log(response.substring(0, 500));
  console.log(response.includes('<strong>') ? '✓ Has <strong> tags' : '✗ No <strong> tags');
  console.log(response.includes('**') ? '✗ Has ** markdown' : '✓ No ** markdown');

  console.log('\n=== STEP 2: User says start_valuation ===');
  messages.push({ role: 'assistant', content: 'Welcome...' });
  messages.push({ role: 'user', content: 'start_valuation' });
  response = await makeApiCall(messages);
  console.log(response.substring(0, 500));

  console.log('\n=== STEP 3: User provides address ===');
  messages.push({ role: 'assistant', content: 'Great! Address?' });
  messages.push({ role: 'user', content: '123 main street detroit' });
  response = await makeApiCall(messages);
  console.log(response.substring(0, 800));
  console.log(response.includes('<strong>Property Type:</strong>') ? '✓ Found Property Type with <strong>' : '✗ Missing or wrong format');
  console.log(response.includes('**Property Type:**') ? '✗ Still using ** markdown' : '✓ Not using ** markdown');

  console.log('\n=== STEP 4: User confirms property type ===');
  messages.push({ role: 'assistant', content: 'Property verification...' });
  messages.push({ role: 'user', content: 'property_type_correct' });
  response = await makeApiCall(messages);
  console.log(response.substring(0, 500));
  console.log(response.includes('<strong>Year Built:</strong>') ? '✓ Found Year Built with <strong>' : '✗ Missing or wrong format');

  console.log('\n✓ Test complete!');
}

testFlow().catch(console.error);
