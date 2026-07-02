const size = 10;
const mineCount = 14;
const keyScore = 250;
const rewardKey = "SWEEP-184";

let cells = [];
let started = false;
let ended = false;
let score = 0;
let opened = 0;
let flags = 0;
let startTime = 0;
let timerId = null;

const board = document.querySelector("[data-mine-board]");
const scoreNode = document.querySelector("[data-score]");
const flagNode = document.querySelector("[data-flags]");
const timerNode = document.querySelector("[data-time]");
const statusNode = document.querySelector("[data-status]");
const rewardNode = document.querySelector("[data-reward]");
const resetButton = document.querySelector("[data-reset]");

function indexOf(row, col) {
  return row * size + col;
}

function neighbors(row, col) {
  const list = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        list.push(indexOf(nr, nc));
      }
    }
  }
  return list;
}

function buildEmptyCells() {
  cells = Array.from({ length: size * size }, (_, id) => ({
    id,
    row: Math.floor(id / size),
    col: id % size,
    mine: false,
    open: false,
    flag: false,
    count: 0,
  }));
}

function placeMines(firstId) {
  const first = cells[firstId];
  const blocked = new Set([firstId, ...neighbors(first.row, first.col)]);
  const candidates = cells.map((cell) => cell.id).filter((id) => !blocked.has(id));

  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  candidates.slice(0, mineCount).forEach((id) => {
    cells[id].mine = true;
  });

  cells.forEach((cell) => {
    cell.count = neighbors(cell.row, cell.col).filter((id) => cells[id].mine).length;
  });
}

function updateHud() {
  scoreNode.textContent = String(score);
  flagNode.textContent = `${flags}/${mineCount}`;
}

function updateTimer() {
  if (!started || ended) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  timerNode.textContent = `${seconds}s`;
}

function startClock() {
  started = true;
  startTime = Date.now();
  timerNode.textContent = "0s";
  timerId = window.setInterval(updateTimer, 1000);
}

function stopClock() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function render() {
  board.innerHTML = "";
  cells.forEach((cell) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mine-cell";
    button.dataset.id = String(cell.id);
    button.setAttribute("aria-label", `row ${cell.row + 1}, column ${cell.col + 1}`);

    if (cell.open) {
      button.classList.add("open");
      if (cell.mine) {
        button.classList.add("mine");
        button.textContent = "*";
      } else if (cell.count > 0) {
        button.textContent = String(cell.count);
        button.dataset.count = String(cell.count);
      }
    } else if (cell.flag) {
      button.classList.add("flag");
      button.textContent = "!";
    }

    button.addEventListener("click", () => openCell(cell.id));
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      toggleFlag(cell.id);
    });
    board.appendChild(button);
  });
  updateHud();
}

function revealReward(reason) {
  rewardNode.hidden = false;
  rewardNode.querySelector("[data-reward-key]").textContent = rewardKey;
  statusNode.textContent = reason;
}

function checkReward() {
  if (score >= keyScore) {
    revealReward("키 지급 조건 달성. 이제 최종 금고에서 이 키를 사용하세요.");
  }
}

function floodOpen(startId) {
  const queue = [startId];
  const seen = new Set();

  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    const cell = cells[id];
    if (cell.open || cell.flag) continue;

    cell.open = true;
    opened += 1;
    score += cell.count === 0 ? 12 : 10;

    if (cell.count === 0) {
      neighbors(cell.row, cell.col).forEach((next) => {
        if (!cells[next].mine) queue.push(next);
      });
    }
  }
}

function openCell(id) {
  if (ended) return;
  if (!started) {
    placeMines(id);
    startClock();
  }

  const cell = cells[id];
  if (cell.open || cell.flag) return;

  if (cell.mine) {
    cell.open = true;
    ended = true;
    stopClock();
    cells.forEach((item) => {
      if (item.mine) item.open = true;
    });
    statusNode.textContent = "지뢰를 밟았습니다. 다시 도전하세요.";
    render();
    return;
  }

  floodOpen(id);
  const safeCells = size * size - mineCount;

  if (opened >= safeCells) {
    score += 250;
    ended = true;
    stopClock();
    revealReward("완전 클리어. 보너스 점수와 키를 획득했습니다.");
  } else {
    checkReward();
    if (score < keyScore) {
      statusNode.textContent = `${keyScore}점 이상이면 키가 지급됩니다.`;
    }
  }

  render();
}

function toggleFlag(id) {
  if (ended || cells[id].open) return;
  if (!started) startClock();

  cells[id].flag = !cells[id].flag;
  flags += cells[id].flag ? 1 : -1;
  render();
}

function resetGame() {
  stopClock();
  buildEmptyCells();
  started = false;
  ended = false;
  score = 0;
  opened = 0;
  flags = 0;
  timerNode.textContent = "0s";
  statusNode.textContent = `${keyScore}점 이상이면 미니게임 키가 지급됩니다.`;
  rewardNode.hidden = true;
  render();
}

resetButton.addEventListener("click", resetGame);
resetGame();
