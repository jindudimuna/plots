fetch("./averages.csv")
  .then((response) => response.text())
  .then((csvData) => {
    // Parse the CSV data
    let data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
    }).data;

    let uniqueWebsites = [...new Set(data.map((entry) => (entry["Website"] ? entry["Website"].trim() : null)))];
    console.log(uniqueWebsites);

    // Create arrays to store old and new report averages for each website
    let oldReportAverages = [];
    let newReportAverages = [];

    // Iterate through each unique website
    uniqueWebsites.forEach((website) => {
      // Find the old report type entry for the current website
      let oldReportEntry = data.find((entry) => entry["Website"] && entry["Website"].trim() === website && entry["Report Type"] === "Old Report");
      if (oldReportEntry && oldReportEntry["Average"] !== null && oldReportEntry["Average"] !== undefined) {
        oldReportAverages.push(oldReportEntry["Average"]);
      } else {
        oldReportAverages.push(null);
      }

      // Find the new report type entry for the current website
      let newReportEntry = data.find((entry) => entry["Website"] && entry["Website"].trim() === website && entry["Report Type"] === "New Report");
      if (newReportEntry && newReportEntry["Average"] !== null && newReportEntry["Average"] !== undefined) {
        newReportAverages.push(newReportEntry["Average"]);
      } else {
        newReportAverages.push(null);
      }
    });
    console.log(oldReportAverages);
    // Create bar traces for old and new reports
    let traces = [
      {
        x: uniqueWebsites,
        y: oldReportAverages,
        type: "bar",
        name: "Old Report",
      },
      {
        x: uniqueWebsites,
        y: newReportAverages,
        type: "bar",
        name: "New Report",
      },
    ];

    // Create the plot
    Plotly.newPlot(
      "myDiv",
      traces,
      {
        xaxis: {
          title: "<br><br>Website",
          titlefont: {
            size: 16,
            color: "black",
          },
          tickfont: {
            size: 10,
            color: "black",
          },
        },
        yaxis: {
          title: "Average",
        },
        bargap: 0.25,
        barmode: "group",
      },
      { responsive: true }
    );
  });
