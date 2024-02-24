const addRow = (stats) => {
  const t_body = document.getElementById("tableBody");
  const newRow = document.createElement("tr");
  for (const prop in stats) {
    const newData = document.createElement("td");
    newData.innerText = stats[prop];
    newRow.appendChild(newData);
  }
  t_body.appendChild(newRow);
};
