function newchart(parent, width, height, barData, id){
    let drgdata = d3.nest()
      .key((d) => d["Provider State"])
      .key((d) => d["DRG Definition"])
      .entries(barData)
    let maxdata = [];
    let maxdata2 = [];
    let temporary = 0;
    let name = "";
    let state = "";
    for(let i = 0; i < drgdata.length; i++) {
      temporary = 0;
      for(let j = 0; j < drgdata[i].values.length; j++) {
        for(let k = 0; k < drgdata[i].values[j].values.length; k++) {
            temporary += (+drgdata[i].values[j].values[k][" Total Discharges "])
        }
      }
      maxdata[i]=temporary;
    }

    for(let i = 0; i < drgdata.length; i++) {
      state = drgdata[i].key;
      for(let j = 0; j < drgdata[i].values.length; j++) {
        temporary = 0;
        name = drgdata[i].values[j].key;
        for(let k = 0; k < drgdata[i].values[j].values.length; k++) {
            temporary += (+drgdata[i].values[j].values[k][" Total Discharges "])
        }
        maxdata2.push({Count: temporary, Drg: name, State: state});

      }
    }

    let newdrgs = d3.nest()
      .key(d=>d["State"])
      .rollup(function(v) { return d3.max(v, function(d) { return +d["Count"]; }); })
      .entries(maxdata2)

    newdrgs = newdrgs.map(d => ({
      State: d.key,
      Count: d.value,
      Drg: "",
    }));

    for(let i = 0; i < newdrgs.length; i++) {
      for(let j = 0; j < maxdata2.length; j ++){
        if(maxdata2[j].State == newdrgs[i].State){
          if(maxdata2[j].Count == newdrgs[i].Count) {
            console.log("found")
            newdrgs[i].Drg = maxdata2[j].Drg
          }
        }
      }
    }



    console.log("newdrgs: ", newdrgs)


    let pop_data = [4874747, 739795, 7016270, 3004279, 39536653, 5607154, 3588184, 961939, 693972, 20984400, 10429379, 1427538, 1716943, 12802023, 6666818, 3145711, 2913123, 4454189, 4684333, 1335907, 6052177, 6859819, 9962311, 5576606, 2984100, 6113532, 1050493, 1920076, 2998039, 1342795, 9005644, 2088070, 19849399, 10273419, 755393, 11658609, 3930864, 4142776, 12805537, 1059639, 5024369, 869666, 6715984, 28304596, 3101833, 623657, 8470020, 7405743, 1815857, 5795483, 579315]
    let data = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .rollup(function(v) { return d3.mean(v, function(d) { return d[" Total Discharges "]; }); })
      .entries(barData);
    let data0 = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .rollup(function(v) { return d3.max(v, function(d) { return +d[" Total Discharges "]; }); })
      .entries(barData);

    data0 = data0.map(d => ({
      State: d.key,
      MaxDischarges: d.value,
    }))

    data = data.map(d => ({
      State: d.key,
      MeanDischarges: d.value,
      MaxDischarges: 0,
      Hospitals: 0,
      Name: "",
      Charges: 0,
      Drg: "",
      Population: 0,
      minCharges: 0,
      maxCharges: 0,
      maxStateDischarges: 0,
      mostCommon: "",
      mostCommonCount: 0,
      }));

    let data2 = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .key(function(d) { return d["Provider Name"]; })
      .rollup(function(v) { return v.length })
      .entries(barData);

    data2 = data2.map(d => ({
      State: d.key,
      Hospitals: d.values.length,
    }));

    let data3 = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .rollup(function(v) { return d3.mean(v, function(d) { return +d[" Average Covered Charges "]; })} )
      .entries(barData);
    data3 = data3.map(d => ({
      State: d.key,
      Charges: Math.round(d.value)
    }))
    let data4 = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .rollup(function(v) { return d3.min(v, function(d) { return +d[" Average Covered Charges "]; })} )
      .entries(barData);
    data4 = data4.map(d => ({
      State: d.key,
      minCharges: Math.round(d.value)
    }))
    let data5 = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .rollup(function(v) { return d3.max(v, function(d) { return +d[" Average Covered Charges "]; })} )
      .entries(barData);
    data5 = data5.map(d => ({
      State: d.key,
      maxCharges: Math.round(d.value)
    }))
    for(let i = 0; i < data.length; i++) {
      data[i].Hospitals = data2[i].Hospitals,
      data[i].Charges = data3[i].Charges,
      data[i].MaxDischarges = data0[i].MaxDischarges,
      data[i].minCharges = data4[i].minCharges,
      data[i].maxCharges = data5[i].maxCharges,
      data[i].maxStateDischarges = maxdata[i]
      data[i].mostCommonCount = newdrgs[i].Count
      data[i].mostCommon = newdrgs[i].Drg
    }

    for(let i = 0; i < barData.length; i++) {
      for(let j = 0; j < data.length; j ++){
        if(data[j].State == barData[i]["Provider State"]){
          if(data[j].MaxDischarges == barData[i][" Total Discharges "]) {
            console.log("found")
            data[j].Drg = barData[i]["DRG Definition"]
          }
        }

      }
    }
    let temp = data[25]
    data.splice(25,1)
    data.splice(43, 0, temp)
    for(let i = 0; i < data.length; i++) {
      data[i].Population = pop_data[i]
    }
    console.log("bar data", data)

    const margins = {top:10, bottom:50, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;

    let x_metric = "State";
    let y_metric = "MeanDischarges";
    let color = "black";
    let color_metric = "Charges";
    let opacity = 1;
    let section = "one";

    const x_scale = d3.scaleBand()
        .range([0, chart_width])
        .domain(data.map((d)=>d[x_metric]))
        .padding(0.1);

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([0,d3.max(data, (d)=>+d[y_metric])]);

    let color_scale = d3.scaleSequential(d3.interpolateBlues)
      .domain([d3.min(data, (d)=>+d[color_metric]),d3.median(data, (d)=>+d[color_metric]), d3.max(data, (d)=>+d[color_metric])]);



    const chart = parent.append("g")
    .attr("id", id)
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const bars = chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d)=>x_scale(d[x_metric]))
      .attr("y", d=>y_scale(d[y_metric]))
      .attr("width", x_scale.bandwidth())
      .attr("height", (d) => (chart_height - y_scale(d[y_metric])))
      .style("stroke", "darkgray")
      .style('fill', (d)=> color_scale(+d[color_metric]));

    chart.append('text')
      .attr("id", "x_label")
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${chart_width/2}, ${chart_height+3*margins.bottom/4})`)
      .attr("font-family","sans-serif")
      .attr("font-size", "14px")
      .text(x_metric);

    chart.append('text')
      .attr("id", "y_label")
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-3*margins.left/4}, ${chart_height/2}) rotate(-90)`)
      .attr("font-family","sans-serif")
      .attr("font-size", "14px")

    const x_axis = chart.append('g')
      .attr('transform', `translate(0, ${chart_height})`)
      .call(d3.axisBottom(x_scale));

    const y_axis = chart.append('g')
      .call(d3.axisLeft(y_scale));

    bars.on("mouseover", function(d) {
      const coordinates = [d3.event.pageX, d3.event.pageY]

      const info = d3.select("#tooltip");

      info.style("left", (coordinates[0]+25) + "px")
        .style("top", (coordinates[1]+25) + "px")
        .classed("hidden", false);

      info.select("#Charges").text(d["Charges"]);
      info.select("#Drg").text(d["Drg"]);
      info.select("#Hospitals").text(d["Hospitals"]);
    })
    .on("mouseout", function(d){
      d3.select("#tooltip")
        .classed("hidden", true)
    })

    const update_chart = function(){
        if(section === "one"){
          console.log("first color scale")
          color_scale = d3.scaleSequential(d3.interpolateBlues)
            .domain([d3.min(data, (d)=>+d[color_metric]),d3.median(data, (d)=>+d[color_metric]), d3.max(data, (d)=>+d[color_metric])]);
        }
        else if(section === "two"){
          console.log("second color scale")
          color_scale = d3.scaleOrdinal(d3.schemeSet3);
        }

        x_scale.domain(data.map((d)=>d[x_metric]))

        y_scale.domain([0, d3.max(data, (d)=>+d[y_metric])]);

        x_axis.call(d3.axisBottom(x_scale));
        y_axis.call(d3.axisLeft(y_scale));

        d3.select("#x_label").text(x_metric);
        d3.select("#y_label").text(y_metric);

        bars.transition()
        .duration(500)
        .attr("x", (d)=> x_scale(d[x_metric]))
        .attr("y", (d) => y_scale(d[y_metric]))
        .attr("height", (d) => (chart_height - y_scale(d[y_metric])))
        .style('fill', (d)=> color_scale(d[color_metric]))
        .style("opacity", 1);


    }

    update_chart.x_metric = (new_x_metric) => {
      console.log("new_x_metric: ", new_x_metric)
        if (new_x_metric){
            x_metric = new_x_metric;
            return update_chart;
        }else{
            return x_metric;
        }
    }

    update_chart.y_metric = (new_y_metric) => {
      console.log("new_y_metric: ", new_y_metric)
        if (new_y_metric){
            y_metric = new_y_metric;
            return update_chart;
        }else{
            return y_metric;
        }
    }

    update_chart.color_metric = (new_color_metric)=>{
      console.log("new_color_metric: ", new_color_metric)
        if (new_color_metric){
            color_metric = new_color_metric;
            return update_chart;
        }else{
            return color_metric;
        }

    }

    update_chart.section = (new_section)=>{
      console.log("new_section: ", new_section)
       if(section) {
         section = new_section;
         return update_chart;
       }else {
         return section;
       }
    }

    update_chart.opacity = (new_opacity)=>{
        if (new_opacity !==undefined){
            opacity = new_opacity;
            return update_chart;
        }else{
            return opacity;
        }

    }

    return update_chart;


}


function create_h_plot2(parent, width, height, d){
    let data = d;
    let x_metric = "Provider Id";
    let y_metric = " Total Discharges ";
    let color = "black";
    let opacity = 1;

    const margins = {top:10, bottom:50, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;

    const y_scale = d3.scaleLinear()
      .range([chart_height, 0])
      .domain([0, d3.max(data, (d)=>+d[y_metric])]);

    const x_scale = d3.scaleBand()
      .rangeRound([0, chart_width])
      .padding(0.1)
      .domain(data.map((d)=>d[x_metric]))

    const color_scale = d3.scaleSequential(d3.interpolateBlues)

    const chart = parent.append("g")
    .attr("id", "scatterplot2")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const x_axis = chart.append('g')
      .attr('transform', `translate(0, ${chart_height})`)
      .call(d3.axisBottom(x_scale));

    const y_axis = chart.append('g')
      .call(d3.axisLeft(y_scale));

    const plot = function() {
        x_scale.domain(data.map((d)=>d[x_metric]));
        y_scale.domain([0, d3.max(data, (d)=>+d[y_metric])]);

        x_axis.call(d3.axisBottom(x_scale));

        y_axis.call(d3.axisLeft(y_scale));

        color_scale.domain([d3.min(data, (d) =>+d[" Average Covered Charges "]), d3.median(data, (d)=>+d[" Average Covered Charges "]), d3.max(data, (d)=>+d[" Average Covered Charges "])]);

    /*
        chart
    */
        let dots = chart.selectAll(".dot")
          .data(data)

        dots.exit().remove()
        dots.exit().remove()
        const new_dots = dots.enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", (d,i)=> x_scale(d[x_metric]) )
          .attr("cy", (d,i)=> y_scale(d[y_metric]))
          .attr("r", 5)
          .style('fill', (d)=> color_scale(+d[" Average Covered Charges "]))
          .style("stroke", "black")

        dots = dots.merge(new_dots);
        dots.on("mouseover", function(d) {
          const coordinates = [d3.event.pageX, d3.event.pageY]

          const info = d3.select("#tooltip3");

          info.style("left", (coordinates[0]+25) + "px")
            .style("top", (coordinates[1]-50) + "px")
            .classed("hidden", false);

          info.select("#state2").text(d["Provider State"]);
          info.select("#ave").text(d[" Average Covered Charges "]);
          info.select("#hospital_name").text(d["Provider Name"]);
          info.select("#DRG").text(d["DRG Definition"]);
          info.select("#provider_id").text(d["Provider Id"]);
          info.select("#Total_Discharges2").text(d[" Total Discharges "]);


        })
        .on("mouseout", function(d){
          d3.select("#tooltip3")
            .classed("hidden", true)
        })
    }
/*
axes
*/
    chart.append('text')
      .attr("id", "x_label")
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${chart_width/2}, ${chart_height+3*margins.bottom/4})`)
      .attr("font-family","sans-serif")
      .attr("font-size", "14px")
      .text(x_metric);

    chart.append('text')
      .attr("id", "y_label")
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-3*margins.left/4}, ${chart_height/2}) rotate(-90)`)
      .attr("font-family","sans-serif")
      .attr("font-size", "14px")
      .text(y_metric);
    plot()

    const update_chart = function(){
        console.log("replot")
        x_scale.domain(data.map((d)=>d[x_metric]));
        y_scale.domain([0, d3.max(data, (d)=>+d[y_metric])]);
        x_axis.call(d3.axisBottom(x_scale));
        y_axis.call(d3.axisLeft(y_scale));
        color_scale.domain([d3.min(data, (d) =>+d[" Average Covered Charges "]), d3.median(data, (d)=>+d[" Average Covered Charges "]), d3.max(data, (d)=>+d[" Average Covered Charges "])]);
        dots = chart.selectAll(".dot")
          .data(data)
        dots.exit().remove()
        //dots = dots.merge(new_dots);
        dots.attr("cx", (d,i)=> x_scale(d[x_metric]) )
          .attr("cy", (d,i)=> y_scale(d[y_metric]))
          .style('fill', (d)=> color_scale(+d[" Average Covered Charges "]))
          .attr("class", "dot")
        const new_dots = dots.enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", (d,i)=> x_scale(d[x_metric]))
          .attr("cy", (d,i)=> y_scale(d[y_metric]))
          .attr("r", 5)
          .style('fill', (d)=> color_scale(+d[" Average Covered Charges "]))
          .style("stroke", "black")
        dots = dots.merge(new_dots);

        plot()
    }

    update_chart.data = (new_data)=>{
        console.log("update chart")
        data = new_data;
        console.log("new data: ", data)
        update_chart();

    }

      return update_chart;
}


function newdots(parent, width, height, dotData, id){
    let pop_data = [4874747, 739795, 7016270, 3004279, 39536653, 5607154, 3588184, 961939, 693972, 20984400, 10429379, 1427538, 1716943, 12802023, 6666818, 3145711, 2913123, 4454189, 4684333, 1335907, 6052177, 6859819, 9962311, 5576606, 2984100, 6113532, 1050493, 1920076, 2998039, 1342795, 9005644, 2088070, 19849399, 10273419, 755393, 11658609, 3930864, 4142776, 12805537, 1059639, 5024369, 869666, 6715984, 28304596, 3101833, 623657, 8470020, 7405743, 1815857, 5795483, 579315]
    let data = d3.nest()
      .key(function(d) { return d["Provider State"]; })
      .entries(dotData);

    data = data.map(d => ({
      State: d.key,
    }))
    let temp = data[25]
    data.splice(25,1)
    data.splice(43, 0, temp)
    for(let i = 0; i < data.length; i++) {
      data[i].Population = pop_data[i]
    }
    console.log("dot data", data)

    const margins = {top:10, bottom:50, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;

    let x_metric = "State";
    let y_metric = "Population";
    let color = "black";
    let color_metric = "Charges";
    let opacity = 1;

    const x_scale = d3.scaleBand()
        .range([0, chart_width])
        .domain(data.map((d)=>d[x_metric]))
        .padding(0.1);

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([0,d3.max(data, (d)=>+d[y_metric])]);

    const chart = parent.append("g")
    .attr("id", id)
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const circles = chart.selectAll(".circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", (d)=>x_scale(d[x_metric]))
      .attr("cy", d=>y_scale(d[y_metric]))
      .attr('transform', `translate(${6}, ${0})`)
      .attr("r", 3)
      .attr("stroke", "black")
      .style('fill', "white");

    const line = d3.line()
      .x((d)=> x_scale(d[x_metric]))
      .y((d)=>y_scale(d[y_metric]));

    console.log("line data", data)


    const lines = chart.selectAll(".path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "path")
      .attr('transform', `translate(${6}, ${0})`)
      .style("stroke", "darkgray")
      .attr("stroke-width", 1)
      .style("fill", "none")



    chart.append('text')
      .attr("id", "x_label")
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${chart_width/2}, ${chart_height+3*margins.bottom/4})`)
      .attr("font-family","sans-serif")
      .attr("font-size", "14px")
      .text(x_metric);

    const y_axis = chart.append('g')
      .attr('transform', `translate(${chart_width}, ${0})`)
      .call(d3.axisRight(y_scale));

    const update_chart = function(){
        console.log("updating line chart");
        lines.transition().attr("d", line(data)).duration(50000).delay((d,i)=>i*20)
    }

    return update_chart;

    /*bars.on("mouseover", function(d) {
      const coordinates = [d3.event.pageX, d3.event.pageY]

      const info = d3.select("#tooltip");

      info.style("left", (coordinates[0]+25) + "px")
        .style("top", (coordinates[1]+25) + "px")
        .classed("hidden", false);

      info.select("#Charges").text(d["Charges"]);
      info.select("#Drg").text(d["Drg"]);
    })
    .on("mouseout", function(d){
      d3.select("#tooltip")
        .classed("hidden", true)
    }) */


}
