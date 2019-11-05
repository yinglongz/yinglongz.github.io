var div = d3.selectAll(".tooltip")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var width = 950;
var height = 500;

var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('#map')
    .append('svg')
    .attr("width", width)
    .attr("height", height);

function mapChange(year) {
    document.getElementById(year_clicked).className = "unclicked";
    d3.json("data/survial.json", function(data) {
        var subdata = data.filter(function(d) {
            return d.year == year;
        });

        console.log(subdata);

        d3.json("data/us-states.json", function(json) {
            for (var i = 0; i < subdata.length; i++) {
                var dataState = subdata[i].name;
                var dataInstitution = subdata[i].institution;
                var dataResearch = subdata[i].research;
                var dataSubsidies = subdata[i].subsidies;
                var dataSurvival_rate = subdata[i].survival_rate;
                var dataWage = subdata[i].wage;
                var dataCapita = subdata[i].vc;
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {
                        json.features[j].properties.survival_rate = dataSurvival_rate;
                        json.features[j].properties.institution = dataInstitution;
                        json.features[j].properties.research = dataResearch;
                        json.features[j].properties.subsidies = dataSubsidies;
                        json.features[j].properties.wage = dataWage;
                        json.features[j].properties.capita = dataCapita;
                        json.features[j].properties.year = year;
                        break;
                    }
                }
            };


            var map = svg.selectAll("#map")
                .data(json.features, function(d) {
                    return d.id;
                });

            map.enter()
                .append("path")
                .attr("class", "states")
                .attr("id", function(d) {
                    return d.properties.year;
                })
                .attr("d", path)
                .style("stroke", "black")
                .style("stroke-width", "1")
                .style("fill", function(d) {
                    var value = d.properties.survival_rate;
                    value = d3.format(".2f")(value);
                    if (value >= 0.65) {
                        return "#007D2A";
                    } else if (value < 0.65 && value >= 0.6) {
                        return "#2BAA56";
                    } else if (value < 0.6 && value >= 0.55) {
                        return "#E8943B";
                    } else if (value < 0.55 && value >= 0.5) {
                        return "#C53272";
                    } else {
                        return "#91003F";
                    }
                })
                .on("mouseover", function(d) {
                    d3.select("#tooltip").transition().duration(500).style("opacity", .65);
                    d3.select("#tooltip").html(toolTip(d))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 27) + "px");
                })
                .on("mouseout", function() {
                    d3.select("#tooltip").transition().duration(500).style("opacity", 0);
                })
                .on("click", function(d) {
                    window.location.assign("detail.html?state=" + d.properties.name + "&year=" + d.properties.year);
                });


            map.exit().remove();


        });
    });
    document.getElementById(year).className = "clicked";
    year_clicked = year;
};

function toolTip(d) { /* function to create html content string in tooltip div. */
    return "<h4>" + d.properties.name + "</h4><table>" +
        "<tr><td>Three-year Survival Rates:</td><td>" + d3.format(".2f")(d.properties.survival_rate*100) + "%</td></tr>" +
        "<tr><td>Three-year Venture Capital (average):</td><td>$"+ d3.format(',')(d.properties.capita) + "</td></tr>" +
        "<tr><td>Three-year Number of Institutions (average):</td><td>" + d3.format(',')(d.properties.institution) + "</td></tr>" +
        "<tr><td>Three-year Research Expenses (average):</td><td>$" + d3.format(',')(d.properties.research) + "</td></tr>" +
        "<tr><td>Three-year State Subsidies (average):</td><td>$" + d3.format(".2f")(d.properties.subsidies) + "</td></tr>" +
        "<tr><td>Three-year Annul Income (average):</td><td>$" + d3.format(',')(d.properties.wage) + "</td></tr>" +
        "</table>";
};

var year_clicked = 2011;
mapChange(2011);
