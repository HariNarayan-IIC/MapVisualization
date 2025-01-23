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


let pp, p, up, s, hs = 0;

let teachersData, t_data;



function loadData(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                resolve(data)
                
                // console.log(data[0].State); // JSON data from the file
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                reject({});
            });
    })
}



async function init(evt) {
    if (window.svgDocument == null) {
        svgDocument = evt.target.ownerDocument;
    }

    teachersData = await loadData("static/data/TeachersData.json");


    let maxValue = await teachersData.reduce((max, obj) => Math.max(max, obj["Total - Total"]), -Infinity);
    let x = (String(maxValue).length) - 1;
    maxValue = Math.ceil(maxValue / 10 ** x) * (10 ** x);


    tooltip1 = svgDocument.getElementById('tooltip1');
    tooltip_bg = svgDocument.getElementById('tooltip_bg');



    for (var i in ids) {
        elt = document.getElementById(ids[i]);


        elt.onmouseover = function (e) {
            // showTooltip(e, capitalizeFirstLetter(e.currentTarget.getAttribute(gobar[i].State)));
            // console.log(e.currentTarget.getAttribute("id"))
            let details = teachersData.find(item => item.id === e.currentTarget.getAttribute("id"))
            showTooltip(e, details["State"]);
        };

        elt.onmouseout = function (e) {
            hideTooltip(e);
        };

        elt.onclick = function (e) {
            t_data = teachersData.find(item => item.id === e.currentTarget.getAttribute("id"));

            document.getElementById("state_title").innerHTML = t_data["State"];
            showDataInCards(
                t_data["Total - Male"],
                t_data["Total - Female"]
            )
            pp = t_data["Pre-Primary Only - Total"];
            p = t_data["Primary Only - Total"];
            up = t_data["Upper Primary Only - Total"];
            s = t_data["Secondary Only - Total"];
            hs = t_data["Higher Secondary Only - Total"];
            document.getElementById("area-chart").style.padding = "20px";
            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            google.charts.setOnLoadCallback(drawChart)
        };

        let data = await teachersData.find(item => item.id === ids[i])["Total - Total"];
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

    let rangeSize = max / 5;
    let i = Math.ceil(data / rangeSize);
    let state = svgDocument.getElementById(id);
    let oldClass = state.getAttributeNS(null, 'class');
    let newClass = oldClass + ' colour' + i;
    state.setAttributeNS(null, 'class', newClass);
}


function showHeatMapLabel(max) {
    let rangeSize = max / 5;
    for (let i = 1; i <= 5; i++) {
        svgDocument.getElementById("range" + i).innerHTML = nFormatter((i - 1) * Math.ceil(rangeSize)) + " - " + nFormatter(i * Math.ceil(rangeSize));
    }
}


function nFormatter(num, digits = 0) {
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

    tooltip1.setAttribute("x", X - 35);
    tooltip1.setAttribute("y", Y + 34);
    // tooltip.firstChild.data = mouseovertext;
    tooltip1.firstChild.data = state;
    tooltip1.setAttributeNS(null, "visibility", "visible");


    length = tooltip1.getComputedTextLength();
    tooltip_bg.setAttributeNS(null, "width", length + 20);
    tooltip_bg.setAttributeNS(null, "x", (X - 40));
    tooltip_bg.setAttributeNS(null, "y", (Y + 15));
    tooltip_bg.setAttributeNS(null, "visibility", "visibile");
}


function hideTooltip(evt) {
    tooltip1.setAttributeNS(null, "visibility", "hidden");
    tooltip_bg.setAttributeNS(null, "visibility", "hidden");
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function showDataInCards(maleTeachers, femaleTeachers) {
    document.querySelector("#card-0 .value").innerHTML = formatNumber(maleTeachers);
    document.querySelector("#card-1 .value").innerHTML = formatNumber(femaleTeachers);
}


function formatNumber(n) {
    // This function adds comma(,) after every three digits and returns a string
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function toggleSideBarVisibility() {
    // Following funtion toggles the visibility of sidebar
    let x = document.getElementById("control-section");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function dashboardChanger() {
    let x = document.getElementById("dashboard-selector");
    if (x.value == "Schools"){
        location.replace("index.html");

    }
    if (x.value == "Students"){
        location.replace("students.html");
    }
    if (x.value == "Teachers") {
        location.replace("teachers.html");
    }
}


// Following are functions that toggle visibility of cards based on the selected filters.
// Six similar looking functions for each checkbox 😮‍💨😩. There must be better ways of doing this.
document.getElementById("maleTeachers").onclick = function () {
    if (document.getElementById("maleTeachers").checked) {
        document.getElementById("card-0").style.display = "block"
    } else {
        document.getElementById("card-0").style.display = "none";
    }
}

document.getElementById("femaleTeachers").onclick = function () {
    if (document.getElementById("femaleTeachers").checked) {
        document.getElementById("card-1").style.display = "block"
    } else {
        document.getElementById("card-1").style.display = "none";
    }
}


//script for creating Google charts//////////////////////////////////////////////////////////////////////////////////////

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    let titleFontSize = 20;
    let legendFontSize = 16;
    let labelFontSize = 14;
    let height = 400;


    if (window.innerWidth < 1000){
        titleFontSize = 30;
        legendFontSize = 24;
        labelFontSize = 20;
        height = 600; 
    }

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
        'title': 'Teachers in All Types of Management',
        titleTextStyle:{
            fontName:'arial',
            bold:true,
            colour: 'blue'
        },
        'is3D': true,
        chartArea: {
            left: 10,
            top: 60,
            right: 10,
            bottom: 30,
            width: '100%',
            height: '100%'
        },
        fontSize: titleFontSize,
        legend: {
            position: 'Center',
            textStyle: {
                fontSize: legendFontSize,
                bold:true
            },
            alignment: 'center'
        },
        pieSliceTextStyle: {
            color: 'white',
            fontSize: labelFontSize+2
        },
        tooltip: {
            textStyle: { fontSize: labelFontSize+2 },
            showColorCode: true
        },
        backgroundColor: "transparent",
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    chart.draw(data, options);



    //data for Sc Population age-Group wise
    var data_sc = google.visualization.arrayToDataTable([
        ['', 'Male', 'Female'],
        ['Pre-primary', t_data['Pre-Primary Only - Male'], t_data['Pre-Primary Only - Female']],
        ['Primary', t_data['Primary Only - Male'], t_data['Primary Only - Female']],
        ['Upper-primary', t_data['Upper Primary Only - Male'], t_data['Upper Primary Only - Female']],
        ['Secondary', t_data['Secondary Only - Male'], t_data['Secondary Only - Female']],
        ['Higher-Secondary', t_data['Higher Secondary Only - Male'], t_data['Higher Secondary Only - Female']]
    ]);

    var areaChartOptions = {
        height: height,
        chart: {
            title: 'Teachers by Grade',
            subtitle: 'Gender Distribution',
            alignment: 'center'
        },
        titleTextStyle: {
            color: "Black",
            fontSize: titleFontSize-2,
            bold: true
        },
        chartArea: {
            top: 50,
            right: 200,
            left: 200,
            bottom: 100,
            backgroundColor: 'transparent'
        },
        legend: {
            position: 'Center',
            textStyle: {
                fontSize: legendFontSize-4,
                bold:true
            },
            alignment: 'center'
        },
        backgroundColor: 'transparent',
        colors: ['#342875', '#E30B5C'],
        hAxis: { 
            title: 'Grades', 
            titleTextStyle: {
                bold: true,
                fontSize: labelFontSize+2,
                color: '#283747'
            },
            textStyle:{
                fontSize: labelFontSize+2
            }
         },
        vAxis: { 
            minValue: 0,
            textStyle:{
                fontSize: labelFontSize+2
            }
         }
    };


    // Teachers gender distribution
    var chart1 = new google.charts.Bar(document.getElementById('area-chart'));
    chart1.draw(data_sc, google.charts.Bar.convertOptions(areaChartOptions));

}

// Add a resize event listener
function handleResize() {
    // Call the function to redraw the chart
    drawChart();
}

// Listen for viewport size changes
let lastWidth = window.innerWidth; // Store the initial width
window.addEventListener('resize',() => {
        const currentWidth = window.innerWidth;
        
        // Check if the width has changed
        if (currentWidth !== lastWidth) {
          lastWidth = currentWidth;
          drawChart(); // Reload your function
        }
      }
);
