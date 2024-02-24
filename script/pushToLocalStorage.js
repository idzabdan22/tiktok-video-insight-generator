const saveLocalButton = document.getElementById("generateReport-button");

saveLocalButton.addEventListener("click", async (e) => {
  let raw_text = document.getElementById("vlink").value;
  raw_text = raw_text.trim();
  const klist = raw_text.split("\n");
  localStorage.setItem("klist", klist);
});
