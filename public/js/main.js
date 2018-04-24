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
      // receive data from form, push to respective arrays, and render/add to charts

      var formEntry = data.formEntry;
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
      })
    }
  })
}

var dataFromMongo = [
  {
    "date": "04/12/2018",
    "copy": 400,
    "paste": 600,
    "copyPaste": 500
  },
  {
    "date": "04/13/2018",
    "copy": 100,
    "paste": 300,
    "copyPaste": 200
  },
  {
    "date": "04/14/2018",
    "copy": 600,
    "paste": 700,
    "copyPaste": 700
  }
]

console.log("Loaded script.js!");

window.addEventListener("load", init);

function init() {
  console.log("Inside init function!");
  // console.log(dataFromMongo);
  // renderStats(dataFromMongo);
  buildDoughnutChart(dataFromMongo);
  buildLineChart(dataFromMongo);
  getData();
}

// function renderStats(data) {
//   console.log("Inside renderStats function!");
// }

function buildDoughnutChart(data) {
  console.log("Inside buildDoughnutChart function!");
  // console.log(data);

  var copyArray = [];
  data.forEach(function(currentEl) {
    copyArray.push(currentEl.copy);
  })

  var pasteArray = [];
  data.forEach(function(currentEl) {
    pasteArray.push(currentEl.paste);
  })

  var data = {
    labels: ["Copy", "Paste"],
    datasets: [
      {
        data: [350, 90],
        // data: [Sum of copyArray, Sum of pasteArray],
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
  // console.log(data);

  var dateArray = [];
  data.forEach(function(currentEl) {
    dateArray.push(currentEl.date);
  })

  var copyPasteArray = [];
  data.forEach(function(currentEl) {
    copyPasteArray.push(currentEl.copyPaste);
    console.log(copyPasteArray)
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
