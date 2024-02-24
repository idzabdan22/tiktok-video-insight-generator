function ExportToExcel(fn, tableName) {
  var elt = document.getElementById(tableName);
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return XLSX.writeFile(
    wb,
    fn || "facetology_insight_report.xlsx"
  );
}
