fetch("./report.csv")
  .then((response) => response.text())
  .then((csvData) => {
    // Parse the CSV data
    let data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
    }).data;

    // this function calculates the number of times an error appears
    function calculateErrorIDCounts(data, reportType) {
      let reportData = data.filter((rd) => {
        let report = rd["Report Type"];
        if (report) {
          report = report.trim(); //remove white spaces
        }
        return report === reportType;
      });
      //   console.log(reportData);
      // next Extract unique website names

      let uniqueErrorIDs = reportData.map((rd) => {
        let errorID = rd["Error ID"];
        if (errorID) {
          errorID = errorID.toString().trim(); // change to a string and remove extra white spaces. this makes sure numbers dont cause us problems
        }
        //   console.log(typeof errorID); // Log the type of errorID
        return errorID;
      });
      uniqueErrorIDs = [...new Set(uniqueErrorIDs)]; // Remove duplicates

      //   console.log(uniqueErrorIDs);

      //the errorIDsToExclude is an array of errors with large numbers, we exclude these errors to have closer look
      // const errorIDsToExclude = ["region", "color-contrast", "link-name", "image-alt"];

      // uniqueErrorIDs = uniqueErrorIDs.filter((errorID) => !errorIDsToExclude.includes(errorID));

      let errorIDCounts = uniqueErrorIDs.map((errorID) => {
        let count = reportData.filter((entry) => entry["Error ID"] === errorID).length;
        return count;
      });
      return { errorIDs: uniqueErrorIDs, counts: errorIDCounts };
    }

    // Calculate average severity for each website in old and new reports by calling the function for each report type.

    let oldReportErrorCounts = calculateErrorIDCounts(data, "Old Report");
    // console.log(oldReportErrorCounts);
    let newReportErrorCounts = calculateErrorIDCounts(data, "New Report");

    // Create histogram traces for both old and new reports

    // Create bar traces for both old and new reports
    let traces = [
      {
        x: oldReportErrorCounts.errorIDs,
        y: oldReportErrorCounts.counts,
        type: "bar",
        name: "Old Report",
        xbins: {
          start: 0,
          end: 5,
          size: 0.5,
        },
      },
      {
        x: newReportErrorCounts.errorIDs,
        y: newReportErrorCounts.counts,
        type: "bar",
        name: "New Report",
        xbins: {
          start: 0,
          end: 5,
          size: 0.5,
        },
      },
    ];

    // Create the plot
    // Create the plot
    Plotly.newPlot(
      "myDiv",
      traces,
      {
        xaxis: {
          title: "<br><br>Error ID",
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
          title: "Number of times an error occurs",
        },
        bargap: 0.25,
        barmode: "group",
      },
      { responsive: true }
    );
  });
