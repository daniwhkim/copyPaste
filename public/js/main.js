console.log("Loaded script.js!");

window.addEventListener("load", init);

function init() {
  console.log("Inside init function!");
  // buildDoughnutChart(dataFromMongo);
  // buildLineChart(dataFromMongo);
  getData();
}

// var dataFromMongo = [
//   {
//     "date": "04/05/2018",
//     "successfulCopyPaste": "31",
//     "copy": "46",
//     "paste": "62"
//   },
//   {
//     "date": "04/06/2018",
//     "successfulCopyPaste": "62",
//     "copy": "85",
//     "paste": "96"
//   },
//   {
//     "date": "04/07/2018",
//     "successfulCopyPaste": "38",
//     "copy": "51",
//     "paste": "63"
//   },
//   {
//     "date": "04/08/2018",
//     "successfulCopyPaste": "143",
//     "copy": "203",
//     "paste": "217"
//   },
//   {
//     "date": "04/09/2018",
//     "successfulCopyPaste": "270",
//     "copy": "399",
//     "paste": "366"
//   },
//   {
//     "date": "04/10/2018",
//     "successfulCopyPaste": "12",
//     "copy": "21",
//     "paste": "18"
//   },
//   {
//     "date": "04/11/2018",
//     "successfulCopyPaste": "4",
//     "copy": "4",
//     "paste": "11"
//   },
//   {
//     "date": "04/12/2018",
//     "successfulCopyPaste": "58",
//     "copy": "93",
//     "paste": "109"
//   },
//   {
//     "date": "04/13/2018",
//     "successfulCopyPaste": "45",
//     "copy": "159",
//     "paste": "80"
//   },
//   {
//     "date": "04/14/2018",
//     "successfulCopyPaste": "6",
//     "copy": "7",
//     "paste": "31"
//   },
//   {
//     "date": "04/15/2018",
//     "successfulCopyPaste": "41",
//     "copy": "116",
//     "paste": "64"
//   },
//   {
//     "date": "04/16/2018",
//     "successfulCopyPaste": "40",
//     "copy": "94",
//     "paste": "59"
//   },
//   {
//     "date": "04/17/2018",
//     "successfulCopyPaste": "24",
//     "copy": "52",
//     "paste": "38"
//   },
//   {
//     "date": "04/18/2018",
//     "successfulCopyPaste": "32",
//     "copy": "57",
//     "paste": "50"
//   },
//   {
//     "date": "04/19/2018",
//     "successfulCopyPaste": "2",
//     "copy": "3",
//     "paste": "15"
//   }
// ]

function getData() {
  $.ajax({
    url: "/api/get",
    type: "GET",
    failure: function(err) {
      console.log("Oops. Could not get the date!");
      return alert("Something went wrong!");
    },
    success: function(data) {
      console.log("Success! Data receieved!");
      console.log(data);

      var formEntry = data.formEntry;
      console.log(formEntry);
      formEntry.forEach(function(currentEl) {
        var htmlToAppend = '<div class="col-lg-4 col-md-6 col-sm-6 col-lg-12">'+
          '<div class="tile">'+
            '<div class="wrapper">'+
              '<label>Date</label>'+
              '<p>' + currentEl.date + '</p>'+
            '</div>'+
            '<div class="wrapper">'+
              '<label>Cmd + C</label>'+
              '<p>' + currentEl.copy + '</p>'+
            '</div>'+
            '<div class="wrapper">'+
              '<label>Cmd + V</label>'+
              '<p>' + currentEl.paste + '</p>'+
            '</div>'+
            '<div class="wrapper">'+
              '<label>Cmd + C + V</label>'+
              '<p>' + currentEl.successfulCopyPaste + '</p>'+
            '</div>'+
          '</div>'+
          '<div class="controlPanel">'+
            '<a href="/api/delete/' + currentEl._id + '">Delete</a>'+
          '</div>'+
        '</div>';

        $('#tileHolder').append(htmlToAppend);
      });

      buildDoughnutChart(formEntry);
      buildLineChart(formEntry);
    }
  })
}

function buildDoughnutChart(data) {
  console.log("Inside buildDoughnutChart function!");

  var totalCopy = 0;
  $.each(data, function (key, value) {
    console.log(value["copy"]);
    totalCopy = totalCopy + parseInt(value["copy"]);
  });
  // console.log(totalCopy);

  var totalPaste = 0;
  $.each(data, function (key, value) {
    console.log(value["paste"]);
    totalPaste = totalPaste + parseInt(value["paste"]);
  });
  // console.log(totalPaste);

  var data = {
    labels: ["Paste", "Copy"],
    datasets: [
      {
        data: [totalPaste, totalCopy],
        backgroundColor: ["#EAEAEA", "#D6D6D6"],
        borderWidth: [0, 0],
        hoverBackgroundColor: ["#F4F4F4", "#F4F4F4"],
        hoverBorderWidth: [0, 0]
      }
    ]
  }

  var options = {
    responsive: true,
    legend: {
      display: false, // hide doughnutChart legend
      position: "bottom",
      labels: {
        boxWidth: 100,
        fontSize: 24,
        fontColor: "#0000FF",
        fontFamily: "'Space Mono'",
        padding: 20
      }
    },
    tooltips: {
      backgroundColor: "rgba(200, 200, 200, 0.8)",
      bodyFontFamily: "'Space Mono'",
      bodyFontSize: 24,
      bodyFontColor: "#0000FF",
      xPadding: 20,
      yPadding: 10,
      caretSize: 0,
      cornerRadius: 0,
      displayColors: false,
    },
    animation: {
      animateRotate: false
    }
  }

  var ctx = document.getElementById("doughnutChart").getContext("2d");
  var myDoughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: options
  });
}

function buildLineChart(data) {
  console.log("Inside buildLineChart function!");

  var dateArray = [];
  data.forEach(function(currentEl) {
    dateArray.push(currentEl.date);
  })

  var copyPasteArray = [];
  data.forEach(function(currentEl) {
    copyPasteArray.push(currentEl.successfulCopyPaste);
  })

  var data = {
    labels: dateArray,
    datasets: [
      {
        data: copyPasteArray,
        label: "Successful Copy and Paste Commands",
        radius: 5,
        pointStyle: "crossRot",
        tension: 0,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 1)",
        fill: false,
        pointHoverRadius: 5
      }
    ]
  }

  var options = {
    responsive: true,
    legend: {
      display: false, // hide lineChart legend
      position: "bottom",
      labels: {
        fontColor: "#0000FF",
        fontFamily: "'Space Mono'",
        usePointStyle: true
      }
    },
    tooltips: {
      backgroundColor: "rgba(200, 200, 200, 0.8)",
      titleFontFamily: "'Space Mono'",
      titleFontSize: 24,
      bodyFontFamily: "'Space Mono'",
      bodyFontSize: 16,
      bodyFontColor: "#0000FF",
      xPadding: 20,
      yPadding: 10,
      caretSize: 0,
      cornerRadius: 0,
      displayColors: false,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontFamily: "'Space Mono'",
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontFamily: "'Space Mono'",
          }
        }
      ],
      gridLines: {
        offsetGridLines: true
      }
    }
  }

  var ctx = document.getElementById("lineChart").getContext("2d");

  var myLineChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: options
  });
}
