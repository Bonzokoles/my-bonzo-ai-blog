// Test script for Container Agent functionality
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const get = (name) => {
  const m = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return m && m[1];
};

const baseUrl = process.argv[2] || 'http://localhost:8788';

// Test Docker API
async function testDocker() {
  console.log('🐋 Testing Docker Management...');
  
  try {
    const response = await fetch(`${baseUrl}/api/containers/manage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: 'docker',
        action: 'list',
        params: {}
      })
    });
    
    const result = await response.json();
    console.log('Docker Status:', response.status);
    console.log('Docker Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Docker Error:', error.message);
  }
}

// Test Kubernetes API
async function testKubernetes() {
  console.log('⚙️ Testing Kubernetes Management...');
  
  try {
    const response = await fetch(`${baseUrl}/api/containers/manage`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: 'kubernetes',
        action: 'pods',
        params: { namespace: 'default' }
      })
    });
    
    const result = await response.json();
    console.log('K8s Status:', response.status);
    console.log('K8s Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('K8s Error:', error.message);
  }
}

// Test Container Health Analysis
async function testHealthAnalysis() {
  console.log('🤖 Testing AI Health Analysis...');
  
  try {
    // First get container list
    const listResponse = await fetch(`${baseUrl}/api/containers/manage?target=docker&action=list`);
    const listResult = await listResponse.json();
    
    console.log('Health Analysis Status:', listResponse.status);
    
    if (listResult.success && listResult.analysis) {
      console.log('🔍 AI Analysis:', listResult.analysis.aiAnalysis);
      console.log('📊 Health Score:', `${listResult.analysis.healthScore}%`);
      console.log('💡 Recommendations:');
      listResult.analysis.recommendations.forEach((rec, idx) => {
        console.log(`   ${idx + 1}. ${rec}`);
      });
    }
    
  } catch (error) {
    console.error('Health Analysis Error:', error.message);
  }
}

// Main test execution
async function runTests() {
  console.log(`🧪 Container Agent Tests - Base URL: ${baseUrl}\n`);
  
  await testDocker();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testKubernetes(); 
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testHealthAnalysis();
  console.log('\n✅ Container tests completed!');
}

runTests().catch(console.error);