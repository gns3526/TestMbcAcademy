# 사건 증거 기록 양식

각자 미니게임에서 얻은 증거 한 줄을 자기 이름의 txt 파일에 남깁니다.

```text
CASE|분류|내용
```

사용하는 분류:

```text
SUSPECT
WEAPON
MOTIVE
TIME
LOCATION
ACCESS
ALIBI
CONCLUSION
```

예시:

```text
CASE|SUSPECT|???
CASE|TIME|??:??
```

저장 위치 예시:

```text
shared_board/fragments/Giho.txt
shared_board/fragments/jebeen.txt
```

증거를 저장한 뒤 commit/push 합니다. 다른 사람은 pull 후 아래 명령으로 현재 사건 보드를 확인합니다.

```powershell
python shared_board/merge_clues.py
```
