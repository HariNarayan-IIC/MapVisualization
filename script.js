// var data1 = [['IN-UP'],
// ['IN-BR', 'IN-MH'],
// ['IN-WB', 'IN-MP', 'IN-RJ', 'IN-TN', 'IN-GJ', 'IN-KA', 'IN-AP'],
// ['IN-OR', 'IN-JH', 'IN-TG', 'IN-KL', 'IN-AS', 'IN-PB', 'IN-HR', 'IN-CT', 'IN-UT', 'IN-DL', 'IN-JK'],
// ['IN-HP', 'IN-TR', 'IN-ML', 'IN-MN', 'IN-NL', 'IN-PY', 'IN-GA', 'IN-AR', 'IN-DN', 'IN-MZ', 'IN-CH']
// ];

var ids = ['IN-AN', 'IN-AP', 'IN-AR', 'IN-AS', 'IN-BR', 'IN-CH', 'IN-CT', 'IN-DD', 'IN-DL', 'IN-GA', 'IN-GJ',
    'IN-HP', 'IN-HR', 'IN-JH', 'IN-JK', 'IN-KA', 'IN-KL', 'IN-LK', 'IN-LD', 'IN-MH', 'IN-ML', 'IN-MN', 'IN-MP',
    'IN-MZ', 'IN-NL', 'IN-OR', 'IN-PB', 'IN-PY', 'IN-RJ', 'IN-SK', 'IN-TG', 'IN-TN', 'IN-TR',
    'IN-UP', 'IN-UT', 'IN-WB'];


let  pp, p, up, s, hs = 0;
let schoolData;
let computersData;
let c_data;



function loadData(filePath){
    return new Promise((resolve, reject) => {
        fetch(filePath)
        .then(response => response.json())
        .then(data => {
            resolve(data);
            // console.log(data[0].State); // JSON data from the file
        })
        .catch(error => console.error('Error fetching JSON:', error));
    })   
}




async function init(evt) {
    if (window.svgDocument == null) {
        svgDocument = evt.target.ownerDocument;
    }

    schoolData = await loadData('SchoolData.json');
    computersData = await loadData('ComputersData.json');


    let maxValue = await schoolData.reduce((max, obj) => Math.max(max, obj.grossEnrollement), -Infinity);
    let x = (String(maxValue).length)-1;
    maxValue = Math.ceil(maxValue/10**x) * (10**x);


    tooltip1 = svgDocument.getElementById('tooltip1');
    tooltip_bg = svgDocument.getElementById('tooltip_bg');

    

    for (var i in ids) {
        elt = document.getElementById(ids[i]);
        

        elt.onmouseover = function (e) {
            // showTooltip(e, capitalizeFirstLetter(e.currentTarget.getAttribute(gobar[i].State)));
            // console.log(e.currentTarget.getAttribute("id"))
            let details = schoolData.find(item => item.id === e.currentTarget.getAttribute("id"))
            showTooltip(e, details.state);
        };

        elt.onmouseout = function (e) {
            hideTooltip(e);
        };

        elt.onclick = function (e) {
            let details = schoolData.find(item => item.id === e.currentTarget.getAttribute("id"));
            c_data = computersData.find(item => item.id === e.currentTarget.getAttribute("id"));
            document.getElementById("state_title").innerHTML = details.state;
            showDataInCards(
                details.drinkingWater,
                details.grossEnrollement,
                details.computers,
                details.electricity,
                details.boysToilet,
                details.girlsToilet
            )
            pp = Number(details.Pre_Primary);
            p = Number(details.Primary);
            up = Number(details.Upper_Primary);
            s = Number(details.Secondary);
            hs = Number(details.Higher_Secondary);
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart)
        };

        let data = await schoolData.find(item => item.id === ids[i]).grossEnrollement;
        colourState(ids[i], data, maxValue)
        
    }

    showHeatMapLabel(maxValue);
}



function colourState(id, data, max) {
// This function fills the state with color as per data. The color is decided by dividing the max value by 5. The data falls into any one of the 5 color range.
// For example if the max value is 200 then the range will be 0-40, 40-80, 80-120, 120-140, 140-160, 160-200.
// Parameters:
// "id" is the id of state path inside svg
// "data" is the data based on which the color of the state needs to be decided
// "max" is the maximum value out of all the state for that particular type of data

    let rangeSize = max/5;
    let i = Math.ceil(data/rangeSize);
    let state = svgDocument.getElementById(id);
    let oldClass = state.getAttributeNS(null, 'class');
    let newClass = oldClass + ' colour' + i;
    state.setAttributeNS(null, 'class', newClass);
}


function showHeatMapLabel(max) {
    let rangeSize = max/5;
    for (let i= 1; i<= 5; i++) {
        svgDocument.getElementById("range" + i).innerHTML = nFormatter((i-1) * Math.ceil(rangeSize)) + " - " + nFormatter(i * Math.ceil(rangeSize));
    }
}


function nFormatter(num, digits= 0) {
// This function rounds 
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
  }


function showTooltip(evt, state) {
    const svg = document.querySelector('svg');

    // Get the bounding rectangle of the SVG element
    const svgRect = svg.getBoundingClientRect();

    // Calculate mouse position relative to the SVG canvas
    X = evt.clientX - svgRect.left;
    Y = evt.clientY - svgRect.top;

    tooltip1.setAttribute("x", X-35);
    tooltip1.setAttribute("y", Y+34);
    // tooltip.firstChild.data = mouseovertext;
    tooltip1.firstChild.data = state;
    tooltip1.setAttributeNS(null, "visibility", "visible");

    // tooltip2.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip2.setAttributeNS(null, "y", evt.clientY + 52);
    // tooltip2.firstChild.data = "Schools with Drinking Water Facility: "+drinkingWater+"%";
    // tooltip2.setAttributeNS(null, "visibility", "visible");

    // tooltip3.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip3.setAttributeNS(null, "y", evt.clientY + 72);
    // tooltip3.firstChild.data = "Gross Enrolment Ratio: "+grossEnrollement;
    // tooltip3.setAttributeNS(null, "visibility", "visible");

    // tooltip4.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip4.setAttributeNS(null, "y", evt.clientY + 92);
    // tooltip4.firstChild.data = "Drop-out Rate: " +dropOut;
    // tooltip4.setAttributeNS(null, "visibility", "visible");

    // tooltip5.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip5.setAttributeNS(null, "y", evt.clientY + 112);
    // tooltip5.firstChild.data = "Schools with Computers: " +computers+ "%";
    // tooltip5.setAttributeNS(null, "visibility", "visible");

    // tooltip6.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip6.setAttributeNS(null, "y", evt.clientY + 132);
    // tooltip6.firstChild.data = "Schools with Electricity: " +electricity+ "%";
    // tooltip6.setAttributeNS(null, "visibility", "visible");

    // tooltip7.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip7.setAttributeNS(null, "y", evt.clientY + 152);
    // tooltip7.firstChild.data = "Schools with Boys' Toilets:" +boysToilet+ "%";
    // tooltip7.setAttributeNS(null, "visibility", "visible");

    // tooltip8.setAttributeNS(null, "x", evt.clientX + 18);
    // tooltip8.setAttributeNS(null, "y", evt.clientY + 172);
    // tooltip8.firstChild.data = "Schools with Girls' Toilets: " +girlsToilet+ "";
    // tooltip8.setAttributeNS(null, "visibility", "visible");

    length = tooltip1.getComputedTextLength();
    tooltip_bg.setAttributeNS(null, "width", length + 20);
    tooltip_bg.setAttributeNS(null, "x", (X - 40));
    tooltip_bg.setAttributeNS(null, "y", (Y + 15));
    tooltip_bg.setAttributeNS(null, "visibility", "visibile");
}

function hideTooltip(evt) {
    tooltip1.setAttributeNS(null, "visibility", "hidden");
    // tooltip2.setAttributeNS(null, "visibility", "hidden");
    // tooltip3.setAttributeNS(null, "visibility", "hidden");
    // tooltip4.setAttributeNS(null, "visibility", "hidden");
    // tooltip5.setAttributeNS(null, "visibility", "hidden");
    // tooltip6.setAttributeNS(null, "visibility", "hidden");
    // tooltip7.setAttributeNS(null, "visibility", "hidden");
    // tooltip8.setAttributeNS(null, "visibility", "hidden");
    tooltip_bg.setAttributeNS(null, "visibility", "hidden");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showDataInCards(drinkingWater, grossEnrollement, computers, electricity, boysToilet, girlsToilet) {
    document.querySelector("#card-0 .value").innerHTML = drinkingWater + "%";
    document.querySelector("#card-1 .value").innerHTML = formatNumber(grossEnrollement);
    document.querySelector("#card-2 .value").innerHTML = computers + "%";
    document.querySelector("#card-3 .value").innerHTML = electricity + "%";
    document.querySelector("#card-4 .value").innerHTML = formatNumber(boysToilet);
    document.querySelector("#card-5 .value").innerHTML = formatNumber(girlsToilet);
}


function formatNumber(n) {
// This function adds comma(,) after every three digits and returns a string
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Following funtion toggles the visibility of sidebar
function toggleSideBarVisibility() {
    var x = document.getElementById("control-section");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

// Following are functions that toggle visibility of cards based on the selected filters.
// Six similar looking functions for each checkbox 😮‍💨😩. There must be better ways of doing this.
document.getElementById("drinkingWater").onclick = function () {
    if (document.getElementById("drinkingWater").checked) {
        document.getElementById("card-0").style.display = "block"
    } else {
        document.getElementById("card-0").style.display = "none";
    }
}

document.getElementById("grossEnrollement").onclick = function () {
    if (document.getElementById("grossEnrollement").checked) {
        document.getElementById("card-1").style.display = "block"
    } else {
        document.getElementById("card-1").style.display = "none";
    }
}

document.getElementById("computers").onclick = function () {
    if (document.getElementById("computers").checked) {
        document.getElementById("card-2").style.display = "block"
    } else {
        document.getElementById("card-2").style.display = "none";
    }
}

document.getElementById("electricity").onclick = function () {
    if (document.getElementById("electricity").checked) {
        document.getElementById("card-3").style.display = "block"
    } else {
        document.getElementById("card-3").style.display = "none";
    }
}

document.getElementById("boysToilet").onclick = function () {
    if (document.getElementById("boysToilet").checked) {
        document.getElementById("card-4").style.display = "block"
    } else {
        document.getElementById("card-4").style.display = "none";
    }
}

document.getElementById("girlsToilet").onclick = function () {
    if (document.getElementById("girlsToilet").checked) {
        document.getElementById("card-5").style.display = "block"
    } else {
        document.getElementById("card-5").style.display = "none";
    }
}


//script for creating Google charts//////////////////////////////////////////////////////////////////////////////////////

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Class Category');
    data.addColumn('number', 'Enrollment');
    data.addRows([
        ['Pre- Primary', pp],
        ['Primary (1 to 5)', p],
        ['Upper Primary (6-8)', up],
        ['Secondary (9-10)', s],
        [' Higher Secondary (11-12)', hs]
    ]);

    // Set chart options
    var options = {
        'title': 'Students Enrollment in All Types of Management',
        'width': 450,
        'height': 300,
        'is3D': true,
        chartArea:{
            left:10,
            top:30,
            right:10,
            bottom: 30,
            width:'100%',
            height:'100%'},
        fontSize: 16,
        legend: {
            position: 'Center', 
            textStyle: {
                color: 'black', 
                fontSize: 14},
            alignment: 'center'},
        pieSliceTextStyle: {
            color: 'white', 
            fontSize: 14},
        tooltip: {
            textStyle: {fontSize: 14}, 
            showColorCode: true},
        backgroundColor: "transparent",
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    chart.draw(data, options);

    //donut chart option and features
    var donut_options = {
        'title': 'Students Enrollment in All Types of Management',
        'width': 450,
        'height': 300,
        chartArea:{
            left:10,
            top:30,
            right:10,
            bottom: 30,
            width:'100%',
            height:'100%'},
        fontSize: 16,
        legend: {
            position: 'Center', 
            textStyle: {
                color: 'black', 
                fontSize: 14},
            alignment: 'center'},
        pieSliceTextStyle: {
            color: 'white', 
            fontSize: 14},
        tooltip: {
            textStyle: {fontSize: 14}, 
            showColorCode: true},
        backgroundColor: "transparent",
        pieHole: 0.4,
    };

    //Donut chart Visualization
    // var chart = new google.visualization.PieChart(document.getElementById('donut-chart'));
    // chart.draw(data, donut_options);

    // Bar chart visualization
    var barchart_options = {
        title: 'Barchart: How Much Pizza I Ate Last Night',
        width: 700,
        height: 300,
        legend: 'none',
        backgroundColor: 'transparent',
        bars: 'vertical',
        chartArea: {
            top: 30,
            right: 50, 
            left: 120,
            bottom: 30        
        },
        fontSize: 14,
        colors: ['#110247', 'green'],
        titleTextStyle: {
            color: "Black",
            fontSize: 14,
            bold: true
        }
    };
    var barchart = new google.visualization.BarChart(document.getElementById('barchart_div'));
    // barchart.draw(data, barchart_options);

 
    var areaChartData = google.visualization.arrayToDataTable([
        ['School Type', 'Total Schools', 'Schools with computers'],
        ['All management',  c_data.Total_Schools_All_Management,      c_data.Computers_All_Management],
        ['Government',  c_data.Total_Schools_Govt,      c_data.Computers_Govt],
        ['Govt. aided',  c_data.Total_Schools_Govt_Aided,       c_data.Computers_Govt_Aided],
        ['Pvt. unaided',  c_data.Total_Schools_Pvt_Unaided,      c_data.Computers_Pvt_Unaided],
        ['Others',  c_data.Total_Schools_Others, c_data.Computers_Others ]
    ]);

    var areaChartOptions = {
        title: 'Computer availability in Schools',
        width: 750,
        height: 300,
        titleTextStyle: {
            color: "Black",
            fontSize: 16,
            bold: true
        },
        chartArea: {
            top: 50,
            right: 150, 
            left: 150,
            bottom: 60        
        },
        backgroundColor: 'transparent',
        hAxis: {title: 'School types',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };

    var areaChart = new google.visualization.AreaChart(document.getElementById('area-chart'));
    areaChart.draw(areaChartData, areaChartOptions);

}




// Charts testing
// const chart1 = document.getElementById('bar-graph');
// const chart2 = document.getElementById('histogram');
// const chart3 = document.getElementById('pie-chart');


// new Chart(chart1, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// new Chart(chart3, {
//     type: 'doughnut',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// })

// new Chart(chart2, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });
