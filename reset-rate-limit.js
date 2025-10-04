// Script para resetar o rate limit durante desenvolvimento
const fetch = require('node-fetch');

async function resetRateLimit() {
  try {
    console.log('🔄 Resetting rate limit...');
    
    const response = await fetch('http://localhost:3002/api/rate-limit/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Rate limit reset successfully:', data);
    } else {
      console.error('❌ Failed to reset rate limit:', response.status);
    }
  } catch (error) {
    console.error('❌ Error resetting rate limit:', error.message);
  }
}

resetRateLimit();


