fetch("./averages.csv")
  .then((response) => response.text())
  .then((csvData) => {
    // Parse the CSV data
    let data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
    }).data;

    // Create bins for average ranges
    const bins = [0, 1, 2, 3, 4];

    // Create arrays to store counts for each bin for old and new reports
    let oldReportCounts = Array(bins.length - 1).fill(0);
    let newReportCounts = Array(bins.length - 1).fill(0);

    // Iterate through each entry and count the averages for old and new reports
    data.forEach((entry) => {
      let average = entry["Average"];
      if (average !== null && average !== undefined) {
        for (let i = 0; i < bins.length - 1; i++) {
          if (average >= bins[i] && average < bins[i + 1]) {
            if (entry["Report Type"] === "Old Report") {
              oldReportCounts[i]++;
            } else if (entry["Report Type"] === "New Report") {
              newReportCounts[i]++;
            }
            break;
          }
        }
      }
    });

    // Create bar traces for old and new reports
    let traces = [
      {
        x: bins.slice(0, -1).map((bin) => `${bin}-${bin + 1}`),
        y: oldReportCounts,
        type: "bar",
        name: "Old Report",
      },
      {
        x: bins.slice(0, -1).map((bin) => `${bin}-${bin + 1}`),
        y: newReportCounts,
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
          title: "<br><br>Average severity Range",
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
          title: "Number of Websites",
        },
        bargap: 0.25,
        barmode: "group",
      },
      { responsive: true }
    );
  });
