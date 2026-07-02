from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRAGMENTS = ROOT / "fragments"

REQUIRED = [
    "SUSPECT",
    "WEAPON",
    "MOTIVE",
    "TIME",
    "LOCATION",
    "ACCESS",
    "ALIBI",
    "CONCLUSION",
]

LABELS = {
    "SUSPECT": "용의자",
    "WEAPON": "흉기",
    "MOTIVE": "동기",
    "TIME": "범행 시각",
    "LOCATION": "현장",
    "ACCESS": "출입 수단",
    "ALIBI": "알리바이 모순",
    "CONCLUSION": "결정적 추론",
}


def read_text(path):
    for encoding in ("utf-8-sig", "utf-8", "cp949"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="replace")


def read_fragments():
    evidence = {key: [] for key in REQUIRED}
    ignored = []

    for path in sorted(FRAGMENTS.glob("*.txt")):
        for index, raw in enumerate(read_text(path).splitlines(), start=1):
            line = raw.strip().lstrip("\ufeff")
            if not line or line.startswith("#"):
                continue

            parts = [part.strip() for part in line.split("|", 2)]
            if len(parts) != 3 or parts[0] != "CASE" or parts[1] not in evidence or not parts[2]:
                ignored.append(f"{path.name}:{index}")
                continue

            evidence[parts[1]].append((path.name, parts[2]))

    return evidence, ignored


def show(evidence, ignored):
    print("=== 자정 스튜디오 사건 보드 ===")

    missing = []
    for key in REQUIRED:
        entries = evidence[key]
        print(f"\n[{key}] {LABELS[key]}")
        if not entries:
            missing.append(key)
            print("  아직 증거 없음")
            continue

        seen = set()
        for filename, value in entries:
            marker = value.casefold()
            if marker in seen:
                continue
            seen.add(marker)
            print(f"  - {value}  ({filename})")

    if missing:
        print("\n아직 모자란 증거:")
        print("  " + ", ".join(f"{key}({LABELS[key]})" for key in missing))
    else:
        print("\n탐정회의 준비 완료: case_room/index.html에서 최종 추리를 입력하세요.")

    if ignored:
        print("\n형식이 맞지 않아 건너뛴 기록:")
        for item in ignored:
            print(f"  - {item}")


if __name__ == "__main__":
    FRAGMENTS.mkdir(parents=True, exist_ok=True)
    found, skipped = read_fragments()
    show(found, skipped)
