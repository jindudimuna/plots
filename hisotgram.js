fetch("./report.csv")
  .then((response) => response.text())
  .then((csvData) => {
    // Parse the CSV data
    let data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
    }).data;

    // this function calculates the average severity for a given report type
    function calculateAverageSeverity(data, reportType) {
      let reportData = data.filter((rd) => {
        let report = rd["Report Type"];
        if (report) {
          report = report.trim(); //remove white spaces
        }
        return report === reportType;
      });

      // next Extract unique website names

      let uniqueWebsites = reportData.map((rd) => {
        let webname = rd["Website"];
        if (webname) {
          webname = webname.toString().trim(); // change to a string and remove extra white spaces. this makes sure numbers dont cause us problems
        }
        //   console.log(typeof webname); // Log the type of webname
        return webname;
      });

      uniqueWebsites = [...new Set(uniqueWebsites)]; // Remove duplicates

      let websiteAverages = {};

      //loop over each website, change each website to lowercase and then create an
      // object that keeps track of the sum of the averages and how many impact scores
      //we have counted.
      uniqueWebsites.forEach((websiteName) => {
        websiteName = websiteName.toLowerCase();
        if (!websiteAverages[websiteName]) {
          websiteAverages[websiteName] = {
            sum: 0,
            count: 0,
          };
        }

        // Calculate cumulative sum and count of impact scores.
        // iterate over the reportData to calculate the cumulative sum and count of impact scores for the current websiteName
        reportData.forEach((report) => {
          if (report["Website"].toString().toLowerCase().trim() === websiteName && !isNaN(report["Impact Score"])) {
            websiteAverages[websiteName].sum += report["Impact Score"];
            websiteAverages[websiteName].count++;
          }
        });
      });

      // Calculate average severity for each unique website using the accumulated sum and count.

      //console.log(Object.keys(websiteAverages));

      let averages = Object.keys(websiteAverages).map((websiteName) => {
        let { sum, count } = websiteAverages[websiteName];
        return count > 0 ? sum / count : 0;
      });

      return averages;
    }

    // Calculate average severity for each website in old and new reports by calling the function for each report type.

    let oldReportAverages = calculateAverageSeverity(data, "Old Report");

    let newReportAverages = calculateAverageSeverity(data, "New Report");

    // Create histogram traces for both old and new reports

    let binSize = 0.05;
    let binStarts = [
      1, 1.5, 1.55, 1.6, 1.65, 1.75, 1.8, 1.9, 2.0, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.65, 2.7, 2.75, 2.8, 2.85, 2.9, 2.95, 2.95, 3.0, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3,
      3.35, 3.45, 3.5, 3.55, 3.8, 3.85,
    ];

    let ticktext = binStarts.map((start) => {
      let end = start + binSize;
      return `${start.toFixed(3)}-${end.toFixed(3)}`;
    });
    // Calculate midpoints of bins for tickvals
    let tickvals = binStarts.map((start) => start + binSize / 2);

    let yTickVals = Array.from({ length: 40 }, (_, i) => i + 1);

    let traces = [
      {
        x: newReportAverages,
        type: "histogram",
        name: "Old Report",
        opacity: 1,
        xbins: {
          start: 0,
          end: 5,
          size: 0.05,
        },
      },
      {
        x: oldReportAverages,
        type: "histogram",
        name: "New Report",
        opacity: 0.8,
        xbins: {
          start: 0,
          end: 5,
          size: 0.05,
        },
      },
    ];

    // Create the plot
    Plotly.newPlot(
      "myDiv",
      traces,
      {
        barmode: "group",
        xaxis: {
          title: "Average Severity (0-5)",
          tickvals: tickvals,
          ticktext: ticktext,
        },
        yaxis: {
          title: "Number of Websites",
          tickvals: yTickVals, // Set y-axis ticks from 1 to 40
          ticktext: yTickVals, // Set y-axis labels from 1 to 40
        },
        bargap: 0.25,
        // bargroupgap: 5,
      },
      { responsive: true }
    );
  });
