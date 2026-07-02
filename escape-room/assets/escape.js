document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.command || "");
        button.textContent = "OK";
        setTimeout(() => button.textContent = "COPY", 1000);
      } catch {
        button.textContent = "VIEW";
      }
    });
  });
});
