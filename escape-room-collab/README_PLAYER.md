# Git Pull Push Escape

대화 금지. 말할 수 있는 단어는 `pull` 또는 `push`뿐입니다.

## 시작

```powershell
git pull --rebase
cd escape-room-collab
python serve.py
```

브라우저에서 `http://localhost:8000`을 엽니다.

## 플레이

1. 자기 이름의 `missions/<이름>/index.html`에서 출발합니다.
2. `zones/<이름>/` 안의 HTML 주석, `data-*` 속성, 흐린 텍스트를 조사합니다.
3. 조각을 찾으면 `shared_board/fragments/<이름>.txt`에 기록합니다.
4. push가 끝나면 말로는 `push`만 말합니다.
5. 다른 사람은 `pull`을 듣고 `git pull --rebase` 합니다.
6. `03-mini-game`에서 점수를 얻어 미니게임 키를 받습니다.
7. 최종 금고에는 `FINAL_VAULT` 비밀번호와 미니게임 키가 모두 필요합니다.

## 조각 형식

```text
TEAM_GATE|순서|조각
FINAL_VAULT|순서|조각
```

## 병합

```powershell
python shared_board/merge_clues.py
```

조각이 모두 모이면 비밀번호가 출력됩니다.
