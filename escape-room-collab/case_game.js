(() => {
  const byData = (root, name) => root.querySelector(`[data-${name}]`);
  const allByData = (root, name) => Array.from(root.querySelectorAll(`[data-${name}]`));

  function initMiniGame(game) {
    const steps = Array.from(game.querySelectorAll("[data-step]"));
    const scoreNode = byData(game, "score");
    const solvedNode = byData(game, "solved");
    const statusNode = byData(game, "status");
    const progressNode = byData(game, "progress");
    const evidenceNode = byData(game, "evidence");
    const copyButton = byData(game, "copy");
    const clue = game.dataset.clue || "";
    const solvedSteps = new Set();
    let mistakes = 0;

    function unlocked(index) {
      return index === 0 || solvedSteps.has(index - 1) || solvedSteps.has(index);
    }

    function refresh(text) {
      const solvedCount = solvedSteps.size;
      const score = Math.max(0, solvedCount * 120 - mistakes * 20);
      if (statusNode) statusNode.textContent = text;
      if (scoreNode) scoreNode.textContent = score;
      if (solvedNode) solvedNode.textContent = `${solvedCount}/${steps.length}`;
      if (progressNode) progressNode.style.width = `${(solvedCount / steps.length) * 100}%`;

      steps.forEach((step, index) => {
        const isSolved = solvedSteps.has(index);
        const isUnlocked = unlocked(index);
        step.classList.toggle("locked-step", !isUnlocked);
        step.classList.toggle("active-step", isUnlocked && !isSolved);
        allByData(step, "choice").forEach((button) => {
          button.disabled = !isUnlocked || isSolved || button.classList.contains("wrong");
        });
      });
    }

    function revealEvidence() {
      if (!evidenceNode) return;
      evidenceNode.hidden = false;
      evidenceNode.classList.add("reward-pop");
      refresh("증거 획득. 공유 보드에 이 한 줄을 남기세요.");
    }

    steps.forEach((step, stepIndex) => {
      allByData(step, "choice").forEach((button) => {
        button.addEventListener("click", () => {
          if (!unlocked(stepIndex) || solvedSteps.has(stepIndex)) return;

          if (button.dataset.correct === "true") {
            solvedSteps.add(stepIndex);
            button.classList.add("correct");
            step.classList.add("solved");
            refresh(button.dataset.feedback || "맞는 증거입니다. 다음 잠금이 열렸습니다.");
            if (solvedSteps.size === steps.length) revealEvidence();
          } else {
            mistakes += 1;
            button.classList.add("wrong");
            refresh(button.dataset.feedback || "그럴듯하지만 함정입니다. 자료를 다시 보세요.");
          }
        });
      });
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(clue);
          refresh("증거 한 줄을 복사했습니다.");
        } catch {
          refresh("복사가 막혔습니다. 화면의 증거 한 줄을 직접 기록하세요.");
        }
      });
    }

    refresh("조사 시작. 자료판을 보고 첫 잠금을 해제하세요.");
  }

  function normalize(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function initCaseForm(form) {
    const result = byData(form, "result");
    const success = byData(document, "case-success");
    const fields = (form.dataset.fields || "").split(",").map((field) => field.trim()).filter(Boolean);
    const expectedHash = form.dataset.caseHash;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!crypto.subtle) {
        result.textContent = "브라우저 보안 기능이 꺼져 있어 판정할 수 없습니다. localhost 서버로 열어주세요.";
        return;
      }

      const data = new FormData(form);
      const payload = fields.map((field) => normalize(data.get(field))).join("|");
      const digest = await sha256(payload);

      if (digest === expectedHash) {
        result.textContent = "모든 모순이 맞물렸습니다.";
        if (success) success.hidden = false;
      } else {
        result.textContent = "아직 앞뒤가 맞지 않습니다. pull로 받은 증거와 사건 보드를 다시 대조하세요.";
        if (success) success.hidden = true;
      }
    });
  }

  document.querySelectorAll("[data-mini-game]").forEach(initMiniGame);
  document.querySelectorAll("[data-case-form]").forEach(initCaseForm);
})();
