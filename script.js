const form = document.querySelector("form");
const results = document.querySelector(".results-wrapper");
const inputBox = document.getElementById("input-box");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (inputBox.value.trim() === "") {
    alert("The filed is empty! Please enter your request!");
    return;
  }

  if (results) {
    results.querySelector(".results")?.remove();
    results.classList.remove("results-showing");

    const loader = document.querySelector(".loader-wrapper");
    if (loader) loader.classList.add("loading");

    const urlToFetch =
      "https://itunes.apple.com/search?term=" +
      encodeURIComponent(inputBox.value);

    const fetchPromise = fetch(urlToFetch).then(function (response) {
      return response.json();
    });

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

    Promise.all([fetchPromise, timeoutPromise]).then((data) => {
      const tableData = data[0];
      const tableWrapper = document.createElement("div");
      tableWrapper.classList.add("results");

      if (tableData.resultCount > 0 && tableData.results) {
        const tableHead = `<thead><tr>
        <th>Artist</th>
        <th>Song Name</th>
        <th>Album</th>
        <th>Kind</th>
        </tr></thead>`;

        let tableBody = `<tbody>`;
        for (let row of tableData.results) {
          tableBody += `<tr>
          <td>${row.artistName}</td>
          <td>${row.trackName}</td>
          <td>${row.collectionName}</td>
          <td>${row.kind}</td></tr>`;
        }
        tableBody += "</tbody>";

        tableWrapper.innerHTML = "<table>" + tableHead + tableBody + "</table>";
      } else {
        tableWrapper.innerHTML =
          "<p>Nema rezultata s traženim pojmom. Molimo Vas pokušajte ponovno.<br>There are no results. Please try again.</p>";
      }
      results.appendChild(tableWrapper);
      results.classList.add("results-showing");
      if (loader) loader.classList.remove("loading");
    });
  }
});
