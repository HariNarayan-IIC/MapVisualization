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
let schoolData;
let computersData;
let c_data;

let scData, s_id, stData;
let sc_data, st_data;




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

    schoolData = await loadData('static/data/SchoolData.json');
    computersData = await loadData('static/data/ComputersData.json');
    sc_data = await loadData("static/data/SC_School_data.json");
    st_data = await loadData("static/data/ST_School_data.json");


    let maxValue = await schoolData.reduce((max, obj) => Math.max(max, obj.grossEnrollement), -Infinity);
    let x = (String(maxValue).length) - 1;
    maxValue = Math.ceil(maxValue / 10 ** x) * (10 ** x);


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
            scData = sc_data.find(item => item.id === e.currentTarget.getAttribute("id"));
            stData = st_data.find(item => item.id === e.currentTarget.getAttribute("id"));

            document.getElementById("state_title").innerHTML = details.state;
            showDataInCards(
                details.grossEnrollement
            )
            pp = Number(details.Pre_Primary);
            p = Number(details.Primary);
            up = Number(details.Upper_Primary);
            s = Number(details.Secondary);
            hs = Number(details.Higher_Secondary);
            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
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


function showDataInCards(totalStudents) {
    document.querySelector("#card-0 .value").innerHTML = formatNumber(totalStudents);

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


document.getElementById("grossEnrollement").onclick = function () {
    if (document.getElementById("totalStudents").checked) {
        document.getElementById("card-0").style.display = "block"
    } else {
        document.getElementById("card-0").style.display = "none";
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
        'title': 'Students Enrollment in All Types of Management',
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

        // colors: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'],
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
        ['Age Group', 'Boys', 'Girls'],
        ['3-5', scData['Scheduled Castes (SC)-Age 3-5 - Boys'], scData['Scheduled Castes (SC)-Age 3-5 - Girls']],
        ['6-10', scData['Scheduled Castes (SC)-Age 6-10 - Boys'], scData['Scheduled Castes (SC)-Age 6-10 - Girls']],
        ['11-13', scData['Scheduled Castes (SC)-Age 11-13 - Boys'], scData['Scheduled Castes (SC)-Age 11-13 - Girls']],
        ['14-15', scData['Scheduled Castes (SC)-Age 14-15 - Boys'], scData['Scheduled Castes (SC)-Age 14-15 - Girls']],
        ['16-17', scData['Scheduled Castes (SC)-Age 16-17 - Boys'], scData['Scheduled Castes (SC)-Age 16-17 - Girls']]
    ]);

    //data for ST populatiuon age-group wise
    var data_st = google.visualization.arrayToDataTable([
        ['Age Group', 'Boys', 'Girls'],
        ['3-5', stData['Scheduled Tribes (ST) - Age 3-5 - Boys'], stData['Scheduled Tribes (ST) - Age 3-5 - Girls']],
        ['6-10', stData['Scheduled Tribes (ST) - Age 6-10 - Boys'], stData['Scheduled Tribes (ST) - Age 6-10 - Girls']],
        ['11-13', stData['Scheduled Tribes (ST) - Age 11-13 - Boys'], stData['Scheduled Tribes (ST) - Age 11-13 - Girls']],
        ['14-15', stData['Scheduled Tribes (ST) - Age 14-15 - Boys'], stData['Scheduled Tribes (ST) - Age 14-15 - Girls']],
        ['16-17', stData['Scheduled Tribes (ST) - Age 16-17 - Boys'], stData['Scheduled Tribes (ST) - Age 16-17 - Girls']]
    ]);

    var options_sc = {
        height: height,
        fontSize: titleFontSize-4,
        title: 'SC population by Age Group',
        titleTextStyle: {
            color: '#283747',
            fontSize: titleFontSize-2,
            bold: true
        },
        chart: {
            title: 'SC population by Age Group',
            subtitle: 'Gender Distribution',
            alignment: 'center'
        },
        backgroundColor: 'transparent',
        chartArea: {
            backgroundColor: 'transparent'
        },
        bars: 'vertical',
        legend: {
            position: 'bottom',
            textStyle: {
                fontSize: legendFontSize-2,
                bold: true
            }
        },
        colors: ['#342875', '#E30B5C'],
        hAxis: {
            title: 'Age Group',
            titleTextStyle: {
                bold: true,
                fontSize: labelFontSize+2,
                color: '#283747'
            },
            textStyle: {
                color: '#283747',
                fontSize: labelFontSize-2,
            }
        },
        vAxis:{
            textStyle:{
                color: '#283747',
                fontSize: labelFontSize-1, 
            }
        }

    };

    var options_st = {
        height: height,
        fontSize: titleFontSize - 4,
        title: 'ST population by Age Group',
        titleTextStyle: {
            color: '#283747',
            fontSize: titleFontSize - 2,
            bold: true
        },
        chart: {
            title: 'ST population by Age Group',
            subtitle: 'Gender Distribution',
        },
        backgroundColor: 'transparent',
        chartArea: {
            backgroundColor: 'transparent'
        },
        legend: {
            textStyle: {
                fontSize: legendFontSize-2,
                bold: true
            }
        },
        colors: ['#342875', '#E30B5C'],
        hAxis: {
            title: 'Age Group',
            titleTextStyle: {
                bold: true,
                fontSize: labelFontSize+2,
                color: '#283747'
            },
            textStyle: {
                color: '#283747',
                fontSize: labelFontSize-2,
            }
        },
        vAxis:{
            textStyle:{
                color: '#283747',
                fontSize: labelFontSize-1, 
            }
        }
    };

    // SC Data graph
    var chart1 = new google.charts.Bar(document.getElementById('SC_barChart'));
    chart1.draw(data_sc, google.charts.Bar.convertOptions(options_sc));

    //ST Data Graph
    var chart = new google.charts.Bar(document.getElementById('ST_barChart'));
    chart.draw(data_st, google.charts.Bar.convertOptions(options_st));

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
