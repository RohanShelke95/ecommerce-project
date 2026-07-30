# Stop stale ecommerce backend processes, then start Spring Boot.
$ErrorActionPreference = "SilentlyContinue"

Write-Host "Stopping stale backend processes..."
Get-CimInstance Win32_Process -Filter "name='java.exe'" |
    Where-Object {
        $_.CommandLine -match "EcommerceApplication|spring-boot:run"
    } |
    ForEach-Object {
        Write-Host "  Stopping PID $($_.ProcessId)"
        Stop-Process -Id $_.ProcessId -Force
    }

Start-Sleep -Seconds 2

if (-not $env:JAVA_HOME) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
}

Set-Location $PSScriptRoot
Write-Host "Starting backend on http://localhost:5454 ..."
Write-Host "Keep this window open. Press Ctrl+C to stop the server."
.\mvnw.cmd spring-boot:run
