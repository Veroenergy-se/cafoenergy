#!/bin/bash

echo "🚀 Starting Vero local development server..."
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3 server"
    echo "🌐 Your site will be available at: http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Using Python 2 server"
    echo "🌐 Your site will be available at: http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    echo "✅ Using PHP server"
    echo "🌐 Your site will be available at: http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000
elif command -v ruby &> /dev/null; then
    echo "✅ Using Ruby server"
    echo "🌐 Your site will be available at: http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    ruby -run -e httpd . -p 8000
else
    echo "❌ No suitable server found."
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: brew install python3"
    echo "  - Node.js: brew install node"
    echo "  - PHP: Already installed on most Macs"
    echo ""
    echo "Or open index.html directly in your browser (some features may not work)"
fi