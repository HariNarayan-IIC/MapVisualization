var data1 = [['IN-UP'],
        ['IN-BR', 'IN-MH'],
        ['IN-WB', 'IN-MP', 'IN-RJ', 'IN-TN', 'IN-GJ', 'IN-KA', 'IN-AP'],
        ['IN-OR', 'IN-JH', 'IN-TG', 'IN-KL', 'IN-AS', 'IN-PB', 'IN-HR', 'IN-CT', 'IN-UT', 'IN-DL', 'IN-JK'],
        ['IN-HP', 'IN-TR', 'IN-ML', 'IN-MN', 'IN-NL', 'IN-PY', 'IN-GA', 'IN-AR', 'IN-DN', 'IN-MZ', 'IN-CH']
        ];

var ids = ['IN-AN', 'IN-AP', 'IN-AR', 'IN-AS', 'IN-BR', 'IN-CH', 'IN-CT', 'IN-DD', 'IN-DL', 'IN-DN', 'IN-GA', 'IN-GJ',
    'IN-HP', 'IN-HR', 'IN-JH', 'IN-JK', 'IN-KA', 'IN-KL', 'IN-LD', 'IN-MH', 'IN-ML', 'IN-MN', 'IN-MP',
    'IN-MZ', 'IN-NL', 'IN-OR', 'IN-PB', 'IN-PY', 'IN-RJ', 'IN-SK', 'IN-TG', 'IN-TN', 'IN-TR',
    'IN-UP', 'IN-UT', 'IN-WB'];

let schoolData ;
fetch('SchoolData.json')
    .then(response => response.json())
    .then(data => {
        schoolData = data;
        
        // console.log(data[0].State); // JSON data from the file
    })
    .catch(error => console.error('Error fetching JSON:', error));



function init(evt) {
    if (window.svgDocument == null) {
        svgDocument = evt.target.ownerDocument;
    }

    tooltip1 = svgDocument.getElementById('tooltip1');
    tooltip2 = svgDocument.getElementById('tooltip2');
    tooltip3 = svgDocument.getElementById('tooltip3');
    tooltip4 = svgDocument.getElementById('tooltip4');
    tooltip5 = svgDocument.getElementById('tooltip5');
    tooltip6 = svgDocument.getElementById('tooltip6');
    tooltip7 = svgDocument.getElementById('tooltip7');
    tooltip8 = svgDocument.getElementById('tooltip8');
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
            let details = schoolData.find(item => item.id === e.currentTarget.getAttribute("id"))
            showDataInCards(
                details.drinkingWater,
                details.grossEnrollement,
                details.computers,
                details.electricity,
                details.boysToilet,
                details.girlsToilet
            )
        };
    }

    colourCountries(data1);
}

function colourCountries(data) {
    for (var colour = 0; colour < data.length; colour++) {
        for (var country = 0; country < data[colour].length; country++) {
            colourCountry(data[colour][country], colour);
        }
    }
}

function colourCountry(name, colour) {
    var country = svgDocument.getElementById(name);
    var oldClass = country.getAttributeNS(null, 'class');
    var newClass = oldClass + ' colour' + colour;
    country.setAttributeNS(null, 'class', newClass);
}

function showTooltip(evt, state) {
    const svg = document.querySelector('svg');

    // Get the bounding rectangle of the SVG element
    const svgRect = svg.getBoundingClientRect();
    
    // Calculate mouse position relative to the SVG canvas
     svgX = evt.clientX - svgRect.left;
     svgY = evt.clientY - svgRect.top;

    tooltip1.setAttribute( "x", (svgX -20)*1.8);
    tooltip1.setAttribute( "y", (svgY -20)*1.8);
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
    tooltip_bg.setAttributeNS(null, "width", length + 40);
    tooltip_bg.setAttributeNS(null, "x", (svgX -30)*1.8);
    tooltip_bg.setAttributeNS(null, "y", (svgY -30)*1.8);
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
    document.querySelector("#card-0 .value").innerHTML = drinkingWater
    document.querySelector("#card-1 .value").innerHTML = grossEnrollement
    document.querySelector("#card-2 .value").innerHTML = computers
    document.querySelector("#card-3 .value").innerHTML = electricity
    document.querySelector("#card-4 .value").innerHTML = boysToilet
    document.querySelector("#card-5 .value").innerHTML = girlsToilet
}


// Following are functions that toggle visibility of cards based on the selected filters.
// Six similar looking functions for each checkbox 😮‍💨😩. There must be better ways of doing this.
document.getElementById("drinkingWater").onclick = function() {
    if (document.getElementById("drinkingWater").checked){
        document.getElementById("card-0").style.display = "block"
    } else {
    document.getElementById("card-0").style.display = "none";
    }
}

document.getElementById("grossEnrollement").onclick = function() {
    if (document.getElementById("grossEnrollement").checked){
        document.getElementById("card-1").style.display = "block"
    } else {
    document.getElementById("card-1").style.display = "none";
    }
}

document.getElementById("computers").onclick = function() {
    if (document.getElementById("computers").checked){
        document.getElementById("card-2").style.display = "block"
    } else {
    document.getElementById("card-2").style.display = "none";
    }
}

document.getElementById("electricity").onclick = function() {
    if (document.getElementById("electricity").checked){
        document.getElementById("card-3").style.display = "block"
    } else {
    document.getElementById("card-3").style.display = "none";
    }
}

document.getElementById("boysToilet").onclick = function() {
    if (document.getElementById("boysToilet").checked){
        document.getElementById("card-4").style.display = "block"
    } else {
    document.getElementById("card-4").style.display = "none";
    }
}

document.getElementById("girlsToilet").onclick = function() {
    if (document.getElementById("girlsToilet").checked){
        document.getElementById("card-5").style.display = "block"
    } else {
    document.getElementById("card-5").style.display = "none";
    }
}




// Charts testing
const chart1 = document.getElementById('bar-graph');
const chart2 = document.getElementById('histogram');
const chart3 = document.getElementById('pie-chart');


  new Chart(chart1, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  new Chart(chart3, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
  })

  new Chart(chart2, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
