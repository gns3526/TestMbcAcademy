async function sha256(text) {
  const bytes = new TextEncoder().encode(text.trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-gate-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector("input[name='password'], input");
      const keyInput = form.querySelector("input[name='miniKey']");
      const result = form.querySelector(".result");
      const expected = form.dataset.hash;
      const expectedKey = form.dataset.keyHash;
      const success = form.dataset.success;
      const actual = await sha256(input.value || "");

      if (actual !== expected) {
        result.textContent = "비밀번호 조각 순서를 다시 확인하세요.";
        result.style.color = "#ffd7d3";
        return;
      }

      if (expectedKey && keyInput) {
        const actualKey = await sha256(keyInput.value || "");
        if (actualKey !== expectedKey) {
          result.textContent = "미니게임 키가 맞지 않습니다. 03-mini-game에서 점수를 획득하세요.";
          result.style.color = "#ffd7d3";
          return;
        }
      }

      if (actual === expected) {
        result.innerHTML = `열림. 다음 위치: <a href="${success}">${success}</a>`;
        result.style.color = "#d9efc1";
      }
    });
  });
});
