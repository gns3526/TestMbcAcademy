$ErrorActionPreference = "Stop"

$escapedFiles = @(
    (Join-Path $PSScriptRoot "..\escape-room\04_locked_door\ESCAPED.txt"),
    (Join-Path $PSScriptRoot "..\escape-room\04_locked_door\ESCAPED_RELAY.txt")
)

foreach ($escapedFile in $escapedFiles) {
    if (Test-Path -LiteralPath $escapedFile) {
        Remove-Item -LiteralPath $escapedFile
        Write-Host "Removed $([System.IO.Path]::GetFileName($escapedFile))"
    }
}
