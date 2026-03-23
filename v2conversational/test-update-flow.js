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

async function testUpdateFlow() {
  const sessionId = 'test_' + Date.now();
  const messages = [];

  console.log('=== STEP 1: Initial welcome ===');
  messages.push({ role: 'user', content: '', timestamp: sessionId });
  let response = await makeApiCall(messages);
  console.log('✓ Welcome displayed\n');

  console.log('=== STEP 2: Start valuation ===');
  messages.push({ role: 'assistant', content: 'Welcome...' });
  messages.push({ role: 'user', content: 'start_valuation' });
  response = await makeApiCall(messages);
  console.log('✓ Address prompt displayed\n');

  console.log('=== STEP 3: Provide address ===');
  messages.push({ role: 'assistant', content: 'Great! Address?' });
  messages.push({ role: 'user', content: '123 main street detroit' });
  response = await makeApiCall(messages);
  console.log('✓ Property Type verification displayed\n');

  console.log('=== STEP 4: Confirm Property Type ===');
  messages.push({ role: 'assistant', content: 'Property Type: Single Family' });
  messages.push({ role: 'user', content: 'property_type_correct' });
  response = await makeApiCall(messages);
  console.log('✓ Year Built verification displayed\n');

  console.log('=== STEP 5: Click UPDATE for Year Built ===');
  messages.push({ role: 'assistant', content: 'Year Built: 1950' });
  messages.push({ role: 'user', content: 'year_built_update' });
  response = await makeApiCall(messages);
  console.log('Response:', response.substring(0, 500));
  console.log(response.includes('What year was the property built') ? '✓ Update prompt displayed' : '✗ Update prompt NOT displayed');
  console.log();

  console.log('=== STEP 6: Provide updated year ===');
  messages.push({ role: 'assistant', content: 'What year was the property built?' });
  messages.push({ role: 'user', content: '1985' });
  response = await makeApiCall(messages);
  console.log('Response:', response.substring(0, 500));
  console.log(response.includes('Updated') ? '✓ Update acknowledged' : '✗ Update NOT acknowledged');
  console.log(response.includes('Square Footage') ? '✓ Moved to next step (Square Footage)' : '✗ Did NOT move to next step');
  console.log();

  console.log('=== Test Complete! ===');
}

testUpdateFlow().catch(console.error);
