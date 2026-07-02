$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$hiddenFiles = @(
    "01_lobby\.under_desk.txt",
    "01_lobby\.old_badge.txt",
    "02_archive\.sealed_index.txt",
    "03_terminal\.operator_note.txt",
    "03_terminal\logs\.rotated_signal.log",
    "04_locked_door\.door_frame.txt",
    "05_signal_room\.antenna_note.txt",
    "shared_clues\.merge_note.txt",
    "99_lies\.truth_in_lie.txt"
)

foreach ($relative in $hiddenFiles) {
    $path = Join-Path $root $relative
    if (Test-Path -LiteralPath $path) {
        attrib +h $path
    }
}

Write-Host "Escape-room hidden clues are set."
