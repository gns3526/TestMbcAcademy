# 릴레이 악몽 모드 진행 가이드

학생들은 서로 대화할 수 없습니다.
말로 할 수 있는 단어는 `pull` 또는 `push`뿐입니다.

학생들은 각자 발견한 단서를 `escape-room/shared_clues/자기이름/` 아래에 새 파일로 남기고 push합니다.
다른 학생은 `git pull`로 단서를 받아 최종 목적지에 도달합니다.

최종 비밀번호와 경로는 요청에 따라 이 문서에도 평문으로 남기지 않습니다.
검증은 아래 명령으로 합니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\escape-room\06_password_maze\check_relay_evidence.ps1
```

pull 후 숨김 속성을 복구하려면:

```powershell
powershell -ExecutionPolicy Bypass -File .\escape-room\tools\setup.ps1
```

추천 운영:

- 제한 시간: 30분에서 45분
- 시작 전에 역할 카드를 나누면 좋습니다.
- push한 학생은 `push`만 말합니다.
- 나머지는 `pull`을 듣고 `git pull` 합니다.
- 같은 파일을 수정하지 않도록 반드시 자기 이름 폴더에 새 파일을 만들게 하세요.
