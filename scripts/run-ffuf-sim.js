const fs = require('fs')
const path = require('path')
const wordlistPath = path.join(__dirname, '..', 'ai-protector', 'wordlists', 'ffuf_small.txt')
const outTxt = path.join(__dirname, '..', 'ai-protector', 'evidence', 'ffuf_results.txt')
const outJson = path.join(__dirname, '..', 'ai-protector', 'evidence', 'ffuf_results.json')
const target = process.argv[2] || 'http://localhost:3000'

if (!fs.existsSync(wordlistPath)) {
  console.error('Wordlist not found:', wordlistPath)
  process.exit(1)
}
fs.mkdirSync(path.dirname(outTxt), { recursive: true })

const lines = fs.readFileSync(wordlistPath, 'utf8').split(/\r?\n/).filter(Boolean)
const results = []

async function main() {
  for (const p of lines) {
    const url = p.match(/^https?:\/\//) ? p : `${target.replace(/\/$/, '')}/${p.replace(/^\//, '')}`
    try {
      const res = await fetch(url, { method: 'GET' })
      const text = await res.text().catch(() => '')
      const size = Buffer.byteLength(text, 'utf8')
      const line = `${res.status} ${size} ${url}`
      console.log(line)
      fs.appendFileSync(outTxt, line + '\n')
      results.push({ url, status: res.status, size })
    } catch (err) {
      console.warn('Request failed:', url)
      const line = `ERR 0 ${url}`
      fs.appendFileSync(outTxt, line + '\n')
      results.push({ url, status: 'ERR', size: 0 })
    }
  }
  fs.writeFileSync(outJson, JSON.stringify(results, null, 2), 'utf8')
  console.log('Results saved to', outTxt, outJson)
}

main()
