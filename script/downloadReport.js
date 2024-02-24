const downloadButton = document.getElementById("download-button");

downloadButton.addEventListener("click", async (e) => {
  ExportToExcel(null, "tableToExport");
});
