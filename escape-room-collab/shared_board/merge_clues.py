from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRAGMENTS = ROOT / "fragments"
TARGETS = ("TEAM_GATE", "FINAL_VAULT")


def read_fragments():
    found = {target: {} for target in TARGETS}
    for path in sorted(FRAGMENTS.glob("*.txt")):
        for raw in path.read_text(encoding="utf-8-sig").splitlines():
            line = raw.strip().lstrip("\ufeff")
            if not line or line.startswith("#"):
                continue
            parts = line.split("|", 2)
            if len(parts) != 3:
                print(f"skip malformed line in {path.name}: {line}")
                continue
            target, order, piece = parts
            target = target.strip()
            if target not in found:
                print(f"skip unknown target in {path.name}: {target}")
                continue
            try:
                number = int(order)
            except ValueError:
                print(f"skip bad order in {path.name}: {order}")
                continue
            found[target][number] = piece.strip()
    return found


def show(found):
    for target in TARGETS:
        pieces = found[target]
        print(f"\n[{target}]")
        if not pieces:
            print("  no fragments yet")
            continue
        for number in sorted(pieces):
            print(f"  {number:02d}: {pieces[number]}")
        expected = 8
        missing = [number for number in range(1, expected + 1) if number not in pieces]
        if missing:
            print(f"  missing: {', '.join(f'{n:02d}' for n in missing)}")
        else:
            print(f"  COMPLETE: {''.join(pieces[n] for n in range(1, expected + 1))}")


if __name__ == "__main__":
    FRAGMENTS.mkdir(parents=True, exist_ok=True)
    show(read_fragments())
