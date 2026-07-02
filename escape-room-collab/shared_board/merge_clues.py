from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRAGMENTS = ROOT / "fragments"
TARGETS = ("TEAM_GATE", "FINAL_VAULT")


def read_fragments():
    found = {target: {} for target in TARGETS}
    ignored = 0
    for path in sorted(FRAGMENTS.glob("*.txt")):
        for raw in path.read_text(encoding="utf-8-sig").splitlines():
            line = raw.strip().lstrip("\ufeff")
            if not line or line.startswith("#"):
                continue
            parts = line.split("|", 2)
            if len(parts) != 3:
                ignored += 1
                continue
            target, order, piece = parts
            target = target.strip()
            if target not in found:
                ignored += 1
                continue
            try:
                number = int(order)
            except ValueError:
                ignored += 1
                continue
            found[target][number] = piece.strip()
    return found, ignored


def show(found, ignored):
    for target in TARGETS:
        pieces = found[target]
        print(f"\n[{target}]")
        if not pieces:
            print("  아직 조각 없음")
            continue
        for number in sorted(pieces):
            print(f"  {number:02d}: {pieces[number]}")
        expected = 8
        missing = [number for number in range(1, expected + 1) if number not in pieces]
        if missing:
            print(f"  부족한 번호: {', '.join(f'{n:02d}' for n in missing)}")
        else:
            print(f"  완성 비밀번호: {''.join(pieces[n] for n in range(1, expected + 1))}")
    if ignored:
        print(f"\n형식이 맞지 않아 무시한 기록: {ignored}")


if __name__ == "__main__":
    FRAGMENTS.mkdir(parents=True, exist_ok=True)
    found, ignored = read_fragments()
    show(found, ignored)
