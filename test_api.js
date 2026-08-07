const http = require('http')

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', c => body += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }) }
        catch (e) { resolve({ status: res.statusCode, data: body }) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function main() {
  const loginBody = JSON.stringify({ email: 'admin@zhealth.com', password: 'Admin@123' })
  const loginRes = await makeRequest({
    hostname: 'localhost', port: 5001,
    path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody)

  const token = loginRes.data?.data?.accessToken
  console.log('Login status:', loginRes.status)
  console.log('Token obtained:', token ? '✅ YES' : '❌ NO')

  if (!token) {
    console.log('Response:', JSON.stringify(loginRes.data, null, 2))
    return
  }

  // GET services
  const getRes = await makeRequest({
    hostname: 'localhost', port: 5001,
    path: '/api/super-admin/settings/services', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }, null)
  console.log('\nGET /settings/services => status', getRes.status)
  console.log(JSON.stringify(getRes.data, null, 2))

  // POST create service
  const postBody = JSON.stringify({ name: 'Physiotherapy', duration: 60, price: 150, color: '#8C4BFF', ndisCode: '01_011_0107_1_3' })
  const postRes = await makeRequest({
    hostname: 'localhost', port: 5001,
    path: '/api/super-admin/settings/services', method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postBody) }
  }, postBody)
  console.log('\nPOST /settings/services => status', postRes.status)
  console.log(JSON.stringify(postRes.data, null, 2))
}

main().catch(e => console.error(e.message))
