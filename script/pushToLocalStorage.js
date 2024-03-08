const saveLocalButton = document.getElementById("generateReport-button");

saveLocalButton.addEventListener("click", async (e) => {
  let raw_text = document.getElementById("vlink").value;
  raw_text = raw_text.trim();
  if (raw_text == "") {
    alert("Please fill out the blank space!");
    return false;
  } else {
    const klist = raw_text.split("\n");
    localStorage.setItem("klist", klist);
    window.location.href = "/generateReports.html";
    return true;
  }
});
