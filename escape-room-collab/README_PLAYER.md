# Midnight Case Pull Push

말로 단서를 공유하지 않고 `pull` / `push`만 말할 수 있는 협력 추리 게임입니다.
HTML은 서로 이어져 있지 않습니다. 각자 자기 미션 파일을 직접 열고, 미니게임에서 얻은 증거 한 줄을 공유 보드에 남깁니다.

## 시작

```powershell
git pull --rebase
cd escape-room-collab
python serve.py
```

브라우저에서 `http://localhost:8000`을 열고, 자기 이름의 미션 경로를 확인합니다.

## 플레이 흐름

1. 각자 `missions/<이름>/index.html`을 직접 엽니다.
2. 자기 미니게임을 풀어 사건 증거 한 줄을 얻습니다.
3. 얻은 증거를 `shared_board/fragments/<이름>.txt`에 기록합니다.
4. `git add`, `git commit`, `git push`까지 끝낸 뒤 말로는 `push`만 알려줍니다.
5. 다른 사람들은 `pull`을 들으면 `git pull --rebase`를 합니다.
6. 증거가 모이면 `python shared_board/merge_clues.py`로 사건 보드를 확인합니다.
7. 모두가 충분히 모였다고 판단하면 `case_room/index.html`을 열고 최종 추리를 입력합니다.

## 증거 형식

```text
CASE|분류|내용
```

예시:

```text
CASE|SUSPECT|???
CASE|TIME|??:??
```

분류는 `SUSPECT`, `WEAPON`, `MOTIVE`, `TIME`, `LOCATION`, `ACCESS`, `ALIBI`, `CONCLUSION` 중 하나입니다.

## 공유 보드 병합

```powershell
python shared_board/merge_clues.py
```

TXT 파일이 아닌 이미지 단서나 형식이 틀린 기록은 그대로 남겨도 됩니다. 병합 스크립트가 읽을 수 있는 증거만 사건 보드에 정리합니다.
