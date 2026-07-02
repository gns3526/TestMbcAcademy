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
      const input = form.querySelector("input");
      const result = form.querySelector(".result");
      const expected = form.dataset.hash;
      const success = form.dataset.success;
      const actual = await sha256(input.value || "");
      if (actual === expected) {
        result.innerHTML = `열림. 다음 위치: <a href="${success}">${success}</a>`;
        result.style.color = "#d9efc1";
      } else {
        result.textContent = "잠금 장치가 반응하지 않습니다. 조각 순서를 다시 확인하세요.";
        result.style.color = "#ffd7d3";
      }
    });
  });
});
