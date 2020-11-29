// https://observablehq.com/@yousrakad/levolution-de-la-temperature-du-mois-de-janvier@126
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Classeur4.csv",new URL("./files/42f070b484b393796e01210d0502856f42f2841869289811a2c65a1fab84fa1e11122737b37f0d085c9af86584677bac8c108a4d4d35efde89abc382af8458a8",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# L'évolution de la température du mois de Janvier

Ce dashboard montre l'évolution de la température Moyenne du mois de Janvier qui est le mois le plus froid au Maroc entre l'an 2000 et 2016.
L'année ayant connu la plus basse température est 2004, et celle ayant connu la plus plus elevée est 2016 (c'est d'ailleurs,  Selon l'Organisation météorologique mondiale (OMM), une agence spécialisée des Nations unies, l'année 2016 est les plus chaudes jamais enregistrée. Durant cette période, le rythme du réchauffement planétaire a été « exceptionnel »
`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","data","x","y","z"], function(d3,width,height,xAxis,yAxis,data,x,y,z)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.value))
      .attr("fill", d => z(d.value))
      .attr("r", 2.5);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  const data = [];
  // https://data.giss.nasa.gov/gistemp/tabledata_v3/GLB.Ts+dSST.csv
  await d3.csvParse(await FileAttachment("Classeur4.csv").text(), (d, i, columns) => {
    for (let i = 1; i < 2; ++i) {
      data.push({
        date: new Date(Date.UTC(d.Year, i - 1, 1)),
        value: +d[columns[i]]
      });
    }
  });
  return data;
}
);
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.value)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("z")).define("z", ["d3","data"], function(d3,data)
{
  const max = d3.max(data, d => Math.abs(d.value));
  return d3.scaleSequential(d3.interpolateRdBu).domain([max, -max]);
}
);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","width"], function(margin,d3,y,width){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "+"))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .filter(d => d === 0)
      .clone()
        .attr("x2", width - margin.right - margin.left)
        .attr("stroke", "#ccc"))
    .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", margin.top)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Anomaly (°C)"))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
