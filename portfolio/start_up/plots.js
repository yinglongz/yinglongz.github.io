/**
 * Created by yinglongzhang on 11/14/16.
 */

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var state = getUrlParameter('state');
var year = getUrlParameter('year');

var state_desc = " / " + state + " (" + year + ")"

document.getElementById("state_description").textContent = state_desc;



d3.json("data/allData.json", function(data) {
    var stateData = data.filter(function(d) {
        return d.name == state;
    });


    var year = stateData.map(function(d) {
        return d.Year;
    });

    var wage = stateData.map(function(d) {
        return d.wage;
    });

    var vc = stateData.map(function(d) {
        return d.vc;
    });


    var institution = stateData.map(function(d) {
        return d.institution;
    });

    var research = stateData.map(function(d) {
        return d.research;
    });

    var subsidies = stateData.map(function(d) {
        return d.subsidies;
    });

    var config_wage = plotLines(year, wage, "Annual income ", state, "$USD", window.chartColors.blue);
    var config_vc = plotLines(year, vc, "Venture capital ", state, " Million $USD", window.chartColors.red);
    var config_institution = plotLines(year, institution, "Number of Institutions ", state, "Number of Institutions", window.chartColors.yellow);
    var config_research = plotLines(year, research, "Research Fundings ", state, " Million $USD", window.chartColors.green);
    var config_subsidies = plotLines(year, subsidies, "Subsidies ", state, " Million $USD", window.chartColors.purple);

    var ctx_vc = document.getElementById('vc_state');
    window.vc_chart = new Chart(ctx_vc, config_vc);

    var ctx_wage = document.getElementById('wage_state');
    window.wage_chart = new Chart(ctx_wage, config_wage);

    var ctx_institution = document.getElementById('institution_state');
    window.institution_chart = new Chart(ctx_institution, config_institution);

    var ctx_research = document.getElementById('research_state');
    window.reseach_chart = new Chart(ctx_research, config_research);

    var ctx_subsidies = document.getElementById('subsidies_state');
    window.subsidies_chart = new Chart(ctx_subsidies, config_subsidies);
});

d3.json("data/allData.json", function(data) {
    var wageData = data.filter(function(d) {
        return d.Year == year;
    });
    var states = wageData.map(function(d) {
        return d.State;
    });

    var wage = wageData.map(function(d) {
        return d.wage;
    });

    var vc = wageData.map(function(d) {
        return d.vc;
    });


    var institution = wageData.map(function(d) {
        return d.institution;
    });

    var research = wageData.map(function(d) {
        return d.research;
    });


    var subsidies = wageData.map(function(d) {
        return d.subsidies;
    });

    var radar_wage_config = plotRadar(states, wage, "Annual income in " + year + " ($USD)", window.chartColors.blue);
    var radar_wage = document.getElementById('wageRadar').getContext("2d");
    window.radar_wage_chart = new Chart(radar_wage, radar_wage_config);


    var radar_vc_config = plotRadar(states, vc, "Venture capital in " + year + " (million $USD)", window.chartColors.red);
    var radar_vc = document.getElementById('vcRadar').getContext("2d");
    window.radar_vc_chart = new Chart(radar_vc, radar_vc_config);

    var radar_institution_config = plotRadar(states, institution, "Number of institution in " + year, window.chartColors.yellow);
    var radar_institution = document.getElementById('institutionRadar').getContext("2d");
    window.radar_institution_chart = new Chart(radar_institution, radar_institution_config);

    var radar_research_config = plotRadar(states, research, "Research findings in " + year + " (million $USD)", window.chartColors.green);
    var radar_research = document.getElementById('researchRadar').getContext("2d");
    window.radar_research_chart = new Chart(radar_research, radar_research_config);


    var radar_subsidies_config = plotRadar(states, subsidies, "Subsidies in " + year + " (million $USD)", window.chartColors.purple);
    var radar_subsidies = document.getElementById('subsidiesRadar').getContext("2d");
    window.radar_subsidies_chart = new Chart(radar_subsidies, radar_subsidies_config);


});


plotLines = function(year, x, label, state, labelString_Y, color) {
    var MONTHS = year;

    var config = {
        type: 'line',
        data: {
            labels: year,
            datasets: [{
                label: label,
                backgroundColor: color,
                borderColor: color,
                data: x,
                fill: false,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: label + " in " + state
            },
            hover: {
                mode: 'index',
            },
            legend: {
                position: 'bottom',
            },
            scales: {
                xAxes: [{
                    dispay: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Year'
                    }
                }],

                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: labelString_Y
                    }
                }]
            }
        }
    };

    return config;
};

plotRadar = function(states, x, label, color) {
    var config = {
        type: "radar",
        data: {
            labels: states,
            datasets: [{
                label: label,
                backgroundColor: color,
                borderColor: color,
                data: x,
                fill: false
            }],
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: label + " in " + state,
                },
                hover: {
                    mode: 'index',
                },
                legend: {
                    position: 'bottom',
                },
                scale: {
                    reverse: true,
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 20
                    }
                }
            }
        }
    };

    return config;

};


wageMap = function(selectYear) {
    if (selectYear != "year") {
        d3.json("data/allData.json", function(data) {
            var wageData = data.filter(function(d) {
                return d.Year == selectYear;
            });
            var states = wageData.map(function(d) {
                return d.State;
            });
            var wages = wageData.map(function(d) {
                return d.wage;
            });


            for (var i = 0; i < wages.length; i++) {
                radar_wage_chart.data.datasets[0].data[i] = wages[i];
                radar_wage_chart.data.labels[i] = states[i];
            }
            radar_wage_chart.data.datasets[0].label = "Annual income in " + selectYear + "($USD)";

            radar_wage_chart.update();
        });
    };
};

vcMap = function(selectYear) {
    if (selectYear != "year") {
        d3.json("data/allData.json", function(data) {
            var wageData = data.filter(function(d) {
                return d.Year == selectYear;
            });
            var states = wageData.map(function(d) {
                return d.State;
            });
            var vc = wageData.map(function(d) {
                return d.vc;
            });


            for (var i = 0; i < vc.length; i++) {
                radar_vc_chart.data.datasets[0].data[i] = vc[i];
                radar_vc_chart.data.labels[i] = states[i];
            }
            radar_vc_chart.data.datasets[0].label = "Venture capital in " + selectYear + " (million $USD)";

            radar_vc_chart.update();
        });
    };
}

researchMap = function(selectYear) {
    if (selectYear != "year") {
        d3.json("data/allData.json", function(data) {
            var wageData = data.filter(function(d) {
                return d.Year == selectYear;
            });
            var states = wageData.map(function(d) {
                return d.State;
            });
            var research = wageData.map(function(d) {
                return d.research;
            });


            for (var i = 0; i < research.length; i++) {
                radar_research_chart.data.datasets[0].data[i] = research[i];
                radar_research_chart.data.labels[i] = states[i];
            }
            radar_research_chart.data.datasets[0].label = "Research findings in " + selectYear + " (million $USD)";

            radar_research_chart.update();
        });
    };

}

subsidiesMap = function(selectYear) {
    if (selectYear != "year") {
        d3.json("data/allData.json", function(data) {
            var wageData = data.filter(function(d) {
                return d.Year == selectYear;
            });
            var states = wageData.map(function(d) {
                return d.State;
            });
            var subsidies = wageData.map(function(d) {
                return d.subsidies;
            });


            for (var i = 0; i < subsidies.length; i++) {
                radar_subsidies_chart.data.datasets[0].data[i] = subsidies[i];
                radar_subsidies_chart.data.labels[i] = states[i];
            }
            radar_subsidies_chart.data.datasets[0].label = "Subsidies in " + selectYear + " (million $USD)";

            radar_subsidies_chart.update();
        });
    };
};

institutionMap = function(selectYear) {
    if (selectYear != "year") {
        d3.json("data/allData.json", function(data) {
            var wageData = data.filter(function(d) {
                return d.Year == selectYear;
            });
            var states = wageData.map(function(d) {
                return d.State;
            });
            var institution = wageData.map(function(d) {
                return d.institution;
            });


            for (var i = 0; i < institution.length; i++) {
                radar_institution_chart.data.datasets[0].data[i] = institution[i];
                radar_institution_chart.data.labels[i] = states[i];
            }
            radar_institution_chart.data.datasets[0].label = "Number of institution in " + selectYear;

            radar_institution_chart.update();
        });
    };

};
