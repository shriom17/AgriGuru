Write-Host "🌾 Starting AgriGuru AI Backend Server..." -ForegroundColor Green
Write-Host "=" * 50
Set-Location -Path $PSScriptRoot
Write-Host "📁 Working directory: $PWD"

if (Test-Path "farming_expert_app.py") {
    Write-Host "✅ Found farming_expert_app.py"
    Write-Host "🚀 Starting Flask server..."
    Write-Host "💡 Press Ctrl+C to stop the server"
    Write-Host "🌐 Open http://localhost:5000 in your browser"
    Write-Host "🧪 Use test_ai.html to test the AI responses"
    Write-Host "-" * 50
    python farming_expert_app.py
} else {
    Write-Host "❌ Error: farming_expert_app.py not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the correct directory"
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
