const fs = require('fs');
const path = require('path');

// Mapeamento de tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.php': 'text/html'
};

module.exports = (req, res) => {
    // Parse da URL
    let pathname = req.url;
    
    // Se for a raiz, redirecionar para o demo principal
    if (pathname === '/') {
        pathname = '/demo-landing.html';
    }
    
    // Construir o caminho do arquivo
    const filePath = path.join(__dirname, '..', 'HTML', pathname);
    
    // Verificar se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Arquivo não encontrado
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Arquivo não encontrado</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        .container { max-width: 600px; margin: 0 auto; }
                        .nav { margin: 20px 0; }
                        .nav a { display: inline-block; margin: 10px; padding: 10px 20px; 
                                background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
                        .nav a:hover { background: #2980b9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>404 - Arquivo não encontrado</h1>
                        <p>O arquivo <code>${pathname}</code> não foi encontrado.</p>
                        <div class="nav">
                            <a href="/demo-landing.html">Demo Principal</a>
                            <a href="/buttons.html">Componentes UI</a>
                            <a href="/demos/landing/">Demos</a>
                        </div>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Obter extensão do arquivo
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Ler e servir o arquivo
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>Erro interno do servidor</h1>');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
};
