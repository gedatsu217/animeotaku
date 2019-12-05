function draw_node(p){
    tag_data=[]
    connections=[]
    tag_data.push({title: p.title})
    for(let i=0; i<p.tag.length;i++){
        tag_data.push({title: p.tag[i]})
        connections.push({source: p.title, target: p.tag[i]})
    }


    d3.selectAll(".taglabel")
      .remove();
    d3.selectAll(".tagcircle")
      .remove();
    d3.selectAll(".links")
        .remove();

    var nodecanvas = d3.select("svg#node");
    nodecanvas.select("text#nodetitle")
    .text(p.title);

    var links = nodecanvas
            .selectAll("line")
            .data(connections).enter()
            .append("line")
            .attr("class", "links")
            .attr("stroke", "black")
            .attr("stroke-width",1);

    var tagcircle = nodecanvas
        .selectAll("circle")
        .data(tag_data)
        .enter()
        .append("circle")
        .attr("class","tagcircle")
        .attr("stroke", "black")
        .attr("fill", tag_color)
        .attr("r", tag_r)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .on("click", circleclicked);

    var taglabel = nodecanvas.selectAll("text.taglabel")
                      .data(tag_data)
                      .enter()
                      .append("text")
                      .attr("class","taglabel")
                      .attr("x", function(d){
                        return tag_data.x;
                      })
                      .attr("y", function(d){
                        return tag_data.y;
                      })
                      .attr("font-size", function(d){
                        return 1;
                      })
                      .attr("text-anchor", "middle")
                      .text(function(d){
                        return d.title;
                      });



    var node_simulation = d3.forceSimulation()
                  .force("collide",
                    d3.forceCollide()
                    .radius(60)
                    .strength(1.0)
                    .iterations(16))
                  .force("charge", d3.forceManyBody().strength(5))
                  .force("center",d3.forceCenter(300, 200))
                  .force("link", d3.forceLink().id(function(d){ return d.title;}))

    node_simulation.nodes(tag_data)
            .on("tick", ticked);

    node_simulation.force("link")
          .links(connections).distance(100);

    function ticked() {
    tagcircle
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    links
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    taglabel
      .attr("x", function(d){return d.x;})
      .attr("y", function(d){return d.y;})
      .attr("font-size", function(d){
        return Math.max(9,d.r/3.5);
      })

    }

    function dragstarted(d) {
    if(!d3.event.active) node_simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }
 
    function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    }
 
    function dragended(d) {
    if(!d3.event.active) node_simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }

    function circleclicked(d){
        window.open('https://www.pixiv.net/search.php?s_mode=s_tag&word='+p.title+" "+d.title, '_blank'); // 新しいタブを開き、ページを表示
    }

    function tag_color(d){
        if(d.title==p.title) return "#F0E3E3"
        else return "#F7C9CE"
    }

    function tag_r(d){
        if(d.title==p.title) return 60;
        else return 40;
    }


}