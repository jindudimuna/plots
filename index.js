// Fetch the CSV data
fetch("./report.csv")
  .then((response) => response.text())
  .then((csvData) => {
    // console.log(csvData);
    // Parse the CSV data
    let data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true, // Convert numbers to actual numbers instead of strings
    }).data;

    // console.log(data);

    // Separate the data based on report type
    let oldReportData = data.filter((rd) => {
      let reportType = rd["Report Type"];
      if (reportType) {
        reportType = reportType.trim();
      }
      return reportType === "Old Report";
    });

    let newReportData = data.filter((rd) => {
      let reportType = rd["Report Type"];
      if (reportType) {
        reportType = reportType.trim();
      }
      //   console.log(reportType); // Log the current item
      return reportType === "New Report";
    });

    // Get the unique website names
    let websites = data.map((rd) => {
      let webname = rd["Website"];
      if (webname) {
        webname = webname.toString().trim(); // Remove extra white spaces
      }
      //   console.log(typeof webname); // Log the type of webname
      return webname;
    });

    websites = [...new Set(websites)]; // Remove duplicates

    // console.log(websites);

    // Combine unique websites from old and new report data
    let allWebsites = [...new Set([...oldReportData, ...newReportData].map((d) => d["Website"]))];

    // console.log(allWebsites);

    // Create box traces for each website
    let traces = allWebsites.flatMap((website) => {
      let oldReportScores = oldReportData.filter((d) => d.Website === website).map((d) => d["Impact Score"]);
      let newReportScores = newReportData.filter((d) => d.Website === website).map((d) => d["Impact Score"]);

      return [
        { y: oldReportScores, type: "box", name: `${website} (Old Report)` },
        { y: newReportScores, type: "box", name: `${website} (New Report)` },
      ];
    });

    // Create the plot
    Plotly.newPlot("myDiv", traces);
  });
