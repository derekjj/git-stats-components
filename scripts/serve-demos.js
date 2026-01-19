#!/usr/bin/env node

import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(__dirname, '..')

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
}

const server = createServer(async (req, res) => {
    try {
        // Default to examples index
        let url = req.url === '/' ? '/examples/index.html' : req.url
        
        // Remove query params
        url = url.split('?')[0]
        
        const filePath = join(rootDir, url)
        const content = await readFile(filePath)
        const ext = extname(filePath)
        const mimeType = MIME_TYPES[ext] || 'text/plain'
        
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        })
        res.end(content)
        
        console.log(`✓ ${new Date().toLocaleTimeString()} - ${url}`)
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 Not Found</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            background: #0d1117;
                            color: #e6edf3;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                        }
                        h1 { font-size: 72px; margin: 0; }
                        p { color: #7d8590; margin: 16px 0; }
                        a { color: #58a6ff; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div>
                        <h1>404</h1>
                        <p>File not found: ${req.url}</p>
                        <a href="/">← Back to demos</a>
                    </div>
                </body>
                </html>
            `)
            console.log(`✗ ${new Date().toLocaleTimeString()} - 404: ${req.url}`)
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('500 Internal Server Error')
            console.error('Error:', err)
        }
    }
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀  Git Stats Components Demo Server                    ║
║                                                            ║
║   Running at: http://localhost:${PORT}                          ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   📋 Available Demos:                                      ║
║                                                            ║
║   🏠 Home:    http://localhost:${PORT}/                          ║
║   🎨 Vue:     http://localhost:${PORT}/examples/vue-demo/index.html        ║
║   ⚛️  React:   http://localhost:${PORT}/examples/react-demo/index.html     ║
║   🧡 Svelte:  http://localhost:${PORT}/examples/svelte-demo/index.html     ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   💡 Tip: Make sure you've run 'pnpm build' first!        ║
║                                                            ║
║   Press Ctrl+C to stop the server                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down demo server...')
    server.close(() => {
        console.log('✓ Server closed')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down demo server...')
    server.close(() => {
        console.log('✓ Server closed')
        process.exit(0)
    })
})