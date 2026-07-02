# Shared Clues

말 대신 Git으로 단서를 주고받는 공간입니다.

- 말할 수 있는 단어는 `pull` 또는 `push`뿐입니다.
- 단서는 자기 이름 폴더 안에 새 파일로 남깁니다.
- 다른 사람 파일은 수정하지 않습니다.
- 원본 방 파일은 수정하지 않습니다.

커밋 흐름:

```powershell
git pull
git add escape-room/shared_clues
git commit -m "share clue"
git push
```

문자 단서 형식:

```text
NIGHTMARE LETTER 번호 = 글자
```

번호는 두 자리로 적으면 더 좋습니다.
