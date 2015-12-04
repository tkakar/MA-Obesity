// var width = 600;
// var height = 600;
// var color  = d3.scale.category20(); 
// var size  = 550;
// var gap = 5;
// var margin = {top: 50, bottom: 70, left: 50, right: 50};
var Avg_Age = 17.81;
// var Avg_Race = 16.18 ;


gBarChartForPrograms();

function gBarChartForPrograms() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/data2014_foodPrograms_LeastObese.csv", function(error, data) {
  if (error) throw error;

  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "County"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    // console.log(d.ages)
  });

  x0.domain(data.map(function(d) { return d.County; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percent");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.County) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

}); // end of data load.

} 

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// var x0 = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/////////////////   For Race 
d3.csv("data/race.csv", function(error,data){

var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "County"; });

    ageNames.map(function(name){ 
            return {name:name, value:+data[name]};
            race_barChart(data, ageNames);
            // console.log(data['County']);
      });

      // d.map(function(data){ 
      //      data['County'] = [+data['White'], +data.Black, +data.Asian, +data.Hisp,  +data.American_Indian, +data['Hawaiian/Pacific Islander']];
      //       race_barChart(data.County)
      //       // console.log(data['County']);
      // });

console.log(ageNames, data)

  // data.forEach(function(d) {
  //   d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  //   race_barChart(data, ageNames)
  // });

});


function race_barChart(data, ageNames){
  console.log(data, ageNames)
    // x0.domain(data.map(function(d) { return d.County; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percent");

  // var state = svg.selectAll(".state")
  //     .data(data)
  //   .enter().append("g")
  //     .attr("class", "g")
  //     .attr("transform", function(d) { return "translate(" + x0(d.County) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  }
      
      // var x = d3.scale.ordinal().rangeRoundBands([0,width-margin.left],0.01);
      // var y = d3.scale.linear().range([height-margin.top-margin.bottom, 0]);

      // x.domain(race)
      //  // x.domain(race.map(function(d,i) { console.log(d.i); return d.i; }));
      // y.domain([0,d3.max(data)]);

     /* var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .innerTickSize(-width+margin.left+margin.right)
                    .outerTickSize(0);

     // To replace the previous chart               
      d3.select("#race_bar").html('');

      var svg = d3.select("#race_bar")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .append("g")
                      .attr("transform", "translate("+ margin.left + "," + margin.top + ")");
                
            svg.append('g')
              .attr('class', 'x axis')
              .attr("transform", "translate(0, "+ (height-margin.bottom-margin.top)+")")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", -10)
              .attr("dy", -5)
              // .attr("transform", "translate(0,0) rotate(-90)");
              .attr("transform", "translate(20,15) rotate(0)");

            svg.append('g')
              .attr('class', 'y axis')
              //.attr("transform", "translate("+10+",-"+margin.bottom+")")
              .call(yAxis);                        

            svg.selectAll("bar")
              .data(data)
              // .data(function(d) {return d;})
              .enter()
              .append("rect")
              .attr('width', x.rangeBand()/1.5) // sets the width of bar
              .attr('height', function(d) {      // sets the height of bar
                  return height-margin.top-margin.bottom - y(d);
                }) 
              .attr('x', function(d,i){ 
                // console.log(i * (width/race.length))
                return  i * (width/race.length); 
              })
              .attr('y', function(d) { // sets the y position of the bar
                return y(d);  
              })
              .attr("fill", function(d, i){ 
                   return color(d);
              });

               var line = d3.svg.line()
               // .x(width-200)
                .x(function(d,i) {
                  console.log(i*width-300)//* (width-margin.left-margin.right-50)) 
                  return (i* (width/race.length+50));
                })
                .y(function(d, i) {  
                  // console.log (y(Avg_Age)); 
                  return y(Avg_Race); 
                }); 
                
              svg.append("path")
                  .datum(data)
                  .attr("class", "line")
                  .attr("d", line);

            svg.append("g").attr("class", "x label")
              .append("text").attr("x", (width-margin.top-margin.bottom)/2)
              .attr("y", height-70)
              .attr("text-anchor", "middle")
              .text("Race");


            svg.append("g").attr("class", "y label")
              .attr("transform", "rotate(-90)")
              .append("text").attr("x", -(height-margin.left-margin.right)/2)
              .attr("y",-40).attr("text-anchor", "middle")
              .text("Percentage Obesity"); */
// });

/////////////////// Age Bar Chart ////////////////

d3.csv("data/age.csv", function(error,d){

      d.map(function(data){ 
           data['County'] = [+data['Older'], +data.Younger];
            age_barChart(data.County)
            // console.log(data['County']);
      });


});

function age_barChart(data){

      age = ["Older", "Younger"];
      var x = d3.scale.ordinal().rangeRoundBands([0,width-margin.left-margin.right],0.05);
      var y = d3.scale.linear().range([height-margin.top-margin.bottom, 0]);

      x.domain(age)
       // x.domain(race.map(function(d,i) { console.log(d.i); return d.i; }));
      y.domain([0,d3.max(data)]);

      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .innerTickSize(-width+margin.left+margin.right)
                    .outerTickSize(0);

     // To replace the previous chart               
      d3.select("#age_bar").html('');

      var svg = d3.select("#age_bar")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .append("g")
                      .attr("transform", "translate("+ margin.left + "," + margin.top + ")");
                
            svg.append('g')
              .attr('class', 'x axis')
              .attr("transform", "translate(0, "+ (height-margin.bottom-margin.top)+")")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", -10)
              .attr("dy", -5)
              // .attr("transform", "translate(0,0) rotate(-90)");
              .attr("transform", "translate(15,15) rotate(0)");

            svg.append('g')
              .attr('class', 'y axis')
              //.attr("transform", "translate("+10+",-"+margin.bottom+")")
              .call(yAxis);                        

            svg.selectAll("bar")
              .data(data)
              // .data(function(d) {return d;})
              .enter()
              .append("rect")
              .attr('width', x.rangeBand()/2) // sets the width of bar
              .attr('height', function(d) {      // sets the height of bar
                  return height-margin.top-margin.bottom - y(d);
                }) 
              .attr('x', function(d,i){ 
                return  i * (width/age.length)+40 ; 
              })
              .attr('y', function(d) { // sets the y position of the bar
                return y(d);  
              })
              .attr("fill", function(d, i){ 
                   return color(i);
              });

             var line = d3.svg.line()
                .x(function(d, i) {
                  // console.log(i*width) 
                  return  i * (width-margin.left-margin.right);
                })
                .y(function(d, i) {  
                  // console.log (y(Avg_Age)); 
                  return y(Avg_Age); 
                }); 
                
              svg.append("path")
                  .datum(data)
                  .attr("class", "line")
                  .attr("d", line);


            svg.append("g").attr("class", "x label")
              .append("text").attr("x", (width-margin.top-margin.bottom)/2)
              .attr("y", height-70)
              .attr("text-anchor", "middle")
              .text("Age");


            svg.append("g").attr("class", "y label")
              .attr("transform", "rotate(-90)")
              .append("text").attr("x", -(height-margin.left-margin.right)/2)
              .attr("y",-40).attr("text-anchor", "middle")
              .text("Percentage Obesity"); 

 }

