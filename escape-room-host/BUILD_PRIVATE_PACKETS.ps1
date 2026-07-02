param([string[]]$Names)

$ErrorActionPreference = "Stop"

if (-not $Names -or $Names.Count -eq 0) {
    $raw = Read-Host "Student or team names, comma separated"
    $Names = $raw -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}

$Names = $Names | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ }

function Convert-ToSafeName {
    param([string]$Text)
    $safe = $Text.Trim() -replace '[\\/:*?"<>| ]+', '_'
    if (-not $safe) { return "student" }
    return $safe
}

$packets = @(
    @{ Role="Lobby Scout I"; Room="01_lobby"; Mission="로비에서 숨김 파일을 찾아 초반 악몽 문자를 확인하세요." },
    @{ Role="Archive Keeper"; Room="02_archive"; Mission="자료실에서 검색과 도장 확인으로 초반 악몽 문자를 확인하세요." },
    @{ Role="Log Reader"; Room="03_terminal/logs"; Mission="로그에서 오른쪽 기록을 찾아 악몽 문자를 확인하세요." },
    @{ Role="Hidden Operator"; Room="03_terminal"; Mission="터미널실의 숨김 운영자 쪽지를 찾으세요." },
    @{ Role="Signal Keeper"; Room="05_signal_room"; Mission="통신실 규칙에서 악몽 문자를 확인하세요." },
    @{ Role="Sealed Index"; Room="02_archive"; Mission="자료실의 숨김 색인 카드를 찾으세요." },
    @{ Role="Rotated Signal"; Room="03_terminal/logs"; Mission="로그 폴더의 숨김 로그를 찾으세요." },
    @{ Role="Antenna Watch"; Room="05_signal_room"; Mission="통신실의 숨김 안테나 쪽지를 찾으세요." },
    @{ Role="Merge Reader"; Room="shared_clues"; Mission="공유 단서 보드의 숨김 메모를 찾으세요." },
    @{ Role="Truth In Lies"; Room="99_lies"; Mission="가짜 힌트 전시장 안에 숨은 진짜 쪽지를 찾으세요." },
    @{ Role="Lobby Scout II"; Room="01_lobby"; Mission="로비의 다른 숨김 파일을 찾으세요." },
    @{ Role="Door Frame"; Room="04_locked_door"; Mission="잠긴 문의 숨김 문틀 쪽지를 찾으세요." }
)

$outRoot = Join-Path $PSScriptRoot "private_packets"
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

for ($i = 0; $i -lt $Names.Count; $i++) {
    $name = $Names[$i]
    $safeName = Convert-ToSafeName -Text $name
    $packet = $packets[$i % $packets.Count]
    $dir = Join-Path $outRoot $safeName
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $content = @"
# 비공개 임무 카드

이 파일의 내용은 말로 공유할 수 없습니다.
공유하려면 반드시 `escape-room/shared_clues/$safeName/`에 단서 파일을 만들고 push 하세요.

## 이름

$name

## 역할

$($packet.Role)

## 조사 시작 위치

`escape-room/$($packet.Room)`

## 임무

$($packet.Mission)

## 말로 할 수 있는 단어

pull
push
"@
    $file = Join-Path $dir "PRIVATE_MISSION.md"
    $content | Set-Content -Path $file -Encoding UTF8
    Write-Host "Created $file"
}
