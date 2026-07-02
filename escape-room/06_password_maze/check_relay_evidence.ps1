$ErrorActionPreference = "Stop"

$requiredEvidenceHashes = @(
    "f1ca60f2623377aabcd22f436f54095d48776207bee47dec952f940742970841",
    "b74f3a947dfbfc22e7bc4f69f633a8dd512b41da8b48b34eb7763fa1fc976dd5",
    "b45db57576e66dfb5546f7129cdb177751760735084a13dcae4e36cd4bfcabca",
    "361e6491a5f20554466712408accbf2060f64abd82416a8980e2aba113da21dd",
    "31956828ad0a16fc5b8842efbb5f9174e220e9f52117ced4c8e34752766ff3a8",
    "31f9b94b618271920719d99dc4139976093cb6a7f589dff8e4491fcb0a611fb7",
    "d5bb35c79df7519e7a9e9c8ef998509b949d88c42c5da31f4cf8957b8e54fd0f",
    "145cbeafa505ec58fed2317d609790ceab15ff56be5ae8abbb433b8a429f1b78",
    "fc7e84704cedaeab416cf1eafeb63ef946e3185df2a26c1b7fa2d6dacb850871",
    "8032492087995c2f1816abaa3ca4080e495bec296adcb0cff0cf19ff089828d9",
    "6c8a2f36acdf30d81cb9994a4e8f1ac9694a4077811104e6afaa2ab314471725",
    "e6aa1ed99fe571b2311fa0ca87ba235f25ec42423aefffd4d15631183153f760"
)

function Get-Sha256Text {
    param([string]$Text)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $hash = $sha.ComputeHash($bytes)
    return -join ($hash | ForEach-Object { $_.ToString("x2") })
}

function Get-FinalPath {
    $parts = @(99,105,112,104,101,114,109,97,116,114,105,120) | ForEach-Object { [char]$_ }
    $path = Join-Path $PSScriptRoot "vault"
    foreach ($part in $parts) { $path = Join-Path $path $part }
    return Join-Path $path "FINAL_DESTINATION.txt"
}

Write-Host ""
Write-Host "=== NIGHTMARE RELAY EVIDENCE CHECK ==="

$boardPath = Join-Path $PSScriptRoot "..\shared_clues"
if (-not (Test-Path -LiteralPath $boardPath)) {
    Write-Host "Missing shared_clues folder."
    exit 1
}

$files = Get-ChildItem -Path (Resolve-Path $boardPath) -Recurse -File -Include *.md,*.txt -Force
$seen = New-Object 'System.Collections.Generic.HashSet[string]'

foreach ($file in $files) {
    $text = Get-Content -LiteralPath $file.FullName -Raw
    $matches = [regex]::Matches($text, 'NIGHTMARE\s+LETTER\s+([0-9]{1,2})\s*=\s*([a-zA-Z])')
    foreach ($match in $matches) {
        $number = [int]$match.Groups[1].Value
        $letter = $match.Groups[2].Value.ToUpperInvariant()
        $token = "{0:D2}={1}" -f $number, $letter
        $hash = Get-Sha256Text -Text $token
        if ($requiredEvidenceHashes -contains $hash) { [void]$seen.Add($hash) }
    }
}

if ($seen.Count -lt $requiredEvidenceHashes.Count) {
    Write-Host "NOT ENOUGH SHARED EVIDENCE."
    Write-Host "Pull latest clues and check escape-room/shared_clues."
    Write-Host "Evidence found: $($seen.Count)/$($requiredEvidenceHashes.Count)"
    exit 1
}

if (-not (Test-Path -LiteralPath (Get-FinalPath))) {
    Write-Host "Evidence is complete, but the final folder was not found."
    exit 1
}

Write-Host "RELAY COMPLETE."
Write-Host "All shared evidence is present. Show the final destination file to the host."
exit 0
