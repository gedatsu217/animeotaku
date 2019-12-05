function draw_graph(dataset, p){
    var plotdata = dataset[get_idx[p.title]]["hits"];
    var graph_w = 600;
    var graph_h = 450;

    var maxnum=0;
    for(var y=2007; y<2020; y++){
      for(var m=1; m<13; m++){
        maxnum = Math.max(maxnum, plotdata[y+"-"+('00'+m).slice(-2)]);
      }
    }
    var timeScale = d3.scaleLinear().domain([0,(2020-2007)*12]).range([30,graph_w-10]);
    var plotScale = d3.scaleLinear().domain([0,maxnum - (maxnum%200) + 200]).range([graph_h-20,50]);

    var graphcanvas = d3.select("svg#graph");
    graphcanvas.select("text#graphtitle")
    .text(p.title)
    .on("click",function(){
      window.open("https://dic.pixiv.net/search?query="+p.title);
    })

    d3.selectAll(".ymemori")
      .remove();
    var interval;
    if(maxnum>8000){
      interval = 2000;
    }else if(maxnum>4000){
      interval = 1000;
    }else if(maxnum>2000){
      interval = 500;
    }else if(maxnum>800){
      interval = 200;
    }else{
      interval = 100;
    }

    d3.selectAll(".xmemori")
      .remove();
    d3.selectAll(".xlabel")
      .remove();
    for(var i=0; i<=156; i+=12){
      graphcanvas.append("line")
                .attr("class","xmemori")
                .attr("x1", timeScale(i))
                .attr("x2", timeScale(i))
                .attr("y1", plotScale(0))
                .attr("y2", plotScale(0)-10)
                .attr("stroke", "black");
      graphcanvas.append("text")
                .attr("class","xlabel")
                .text(function(){
                  if(i==0){
                    return 2007;
                  }else{
                    return "'"+String(i/12+2007).slice(-2);
                  }
                })
                .attr("x", timeScale(i))
                .attr("y", plotScale(0)+14)
                .attr("fill", "black")
                .attr("stroke","none");
    }
    
    d3.selectAll(".ymemori")
      .remove();
    d3.selectAll(".ylabel")
      .remove();
    for(var i=interval; i<maxnum; i+=interval){
      graphcanvas.append("line")
                .attr("class","ymemori")
                .attr("x1", timeScale(0))
                .attr("x2", timeScale(0)+10)
                .attr("y1", plotScale(i))
                .attr("y2", plotScale(i))
                .attr("stroke","black");
      graphcanvas.append("text")
                .attr("class", "ylabel")
                .text(i)
                .attr("x",timeScale(0)-30)
                .attr("y",plotScale(i))
                .attr("stroke","none")
                .attr("fill", "black")
                .attr("style", "font-size: 15px");
    }

    var xaxis = graphcanvas.append("line")
                        .attr("id", "xaxis")
                        .attr("x1",timeScale(0))
                        .attr("x2",timeScale(156)+10)
                        .attr("y1",plotScale(0))
                        .attr("y2",plotScale(0))
                        .attr("stroke","black");
    var yaxis = graphcanvas.append("line")
                        .attr("id", "yaxis")
                        .attr("x1",timeScale(0))
                        .attr("x2",timeScale(0))
                        .attr("y1",plotScale(maxnum)-10)
                        .attr("y2",plotScale(0))
                        .attr("stroke","black");


    graphcanvas.selectAll("circle.graphpoint")
              .remove();

    graphcanvas.selectAll("line.graphline")
              .remove();


    var prevx=-1;
    var prevy=-1;
    for(var y=2007; y<2020; y++){
      for(var m=1; m<13; m++){
        if(y==2019 && m==11){
          break;
        }
        var num = plotdata[y+"-"+('00'+m).slice(-2)];
        var tempx=timeScale((y-2007)*12+m-1);
        var tempy=plotScale(num);


        if(prevx>=0 && prevy >=0){
            graphcanvas.append("line")
                        .attr("class", "graphline")
                        .attr("x1", prevx)
                        .attr("y1", prevy)
                        .attr("x2", tempx)
                        .attr("y2", tempy)
                        .attr("stroke", "#ff0000")
                        .attr("fill", "none")
                        .attr("stroke-width",0)
                        .transition()
                        .delay(20*((y-2007)*12+m))
                        .duration(200)
                        .attr("stroke-width",1);
        }
                 
        prevx = tempx;
        prevy = tempy;
      }
    }


    for(var y=2007; y<2020; y++){
      for(var m=1; m<13; m++){
        if(y==2019 && m==11){
          break;
        }
        var temptime = y+"-"+(('00'+m).slice(-2));
        var num = plotdata[temptime];
        var tempx=timeScale((y-2007)*12+m-1);
        var tempy=plotScale(num);


        graphcanvas
        .append("circle")
        .attr("class", "graphpoint")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", function(){
          if(1<=m && m<=3){
            return "#cff5ff";
          }else if(4<=m && m<=6){
            return "#ffabee";
          }else if(7<=m && m<=9){
            return "#5cff67";
          }else{
            return "#ffe45c";
          }
        })
        .attr("cx",function(){
          return tempx;
        })
        .attr("cy", function(){
          return tempy;
        })
        .attr("r", 0)
        .on("mouseover", function(){
          d3.selectAll("circle.graphpoint")
            .attr("opacity", 0.5);
          d3.selectAll("line.graphline")
            .attr("opacity", 0.5);
          d3.select(this).attr("opacity", 1);

          var xval = Math.round(timeScale.invert(d3.select(this).attr("cx")));
          var yval = Math.round(plotScale.invert(d3.select(this).attr("cy")));

          graphcanvas.append("text")
                    .attr("id", "focusvalue")
                    .text(yval)
                    .attr("x", 60)
                    .attr("y", plotScale(yval))
                    .attr("style", "font-size: 20px;")
                    .attr("stroke", "none")
                    .attr("fill", "#a030ff");
          graphcanvas.append("text")
                    .attr("id", "focusmonth")
                    .text(('00'+(xval%12+1)).slice(-2))
                    .attr("x", timeScale(xval)-10)
                    .attr("y", plotScale(0)-10)
                    .attr("style", "font-size: 20px;")
                    .attr("stroke", "none")
                    .attr("fill", "#a030ff");
                  


          graphcanvas.append("line")
                    .attr("id", "xfocus-up")
                    .attr("x1", timeScale(xval))
                    .attr("x2", timeScale(xval))
                    .attr("y1", plotScale(0))
                    .attr("y2", plotScale(yval)+8)
                    .attr("stroke", "#6060ff");
          graphcanvas.append("line")
                    .attr("id", "xfocus-down")
                    .attr("x1", timeScale(xval))
                    .attr("x2", timeScale(xval))
                    .attr("y1", plotScale(yval)-8)
                    .attr("y2", plotScale(maxnum)-10)
                    .attr("stroke", "#6060ff");
          graphcanvas.append("line")
                    .attr("id", "yfocus-left")
                    .attr("x1", timeScale(0))
                    .attr("x2", timeScale(xval)-8)
                    .attr("y1", plotScale(yval))
                    .attr("y2", plotScale(yval))
                    .attr("stroke", "#6060ff");
          graphcanvas.append("line")
                    .attr("id", "yfocus-right")
                    .attr("x1", timeScale(xval)+8)
                    .attr("x2", timeScale(156))
                    .attr("y1", plotScale(yval))
                    .attr("y2", plotScale(yval))
                    .attr("stroke", "#6060ff");
          graphcanvas.append("line")
                    .attr("id", "yhalf")
                    .attr("x1", timeScale(0))
                    .attr("x2", timeScale(156))
                    .attr("y1", plotScale(yval/2))
                    .attr("y2", plotScale(yval/2))
                    .attr("stroke", "#babaff");

          d3.select(this).attr("r", 8);
        })
        .on("mouseout",function(){
          d3.select("text#focusvalue")
            .remove();
          d3.select("text#focusmonth")
            .remove();
          d3.select("line#xfocus-up")
            .remove();
          d3.select("line#xfocus-down")
            .remove();
          d3.select("line#yfocus-left")
            .remove();
          d3.select("line#yfocus-right")
            .remove();
          d3.select("line#yhalf")
            .remove();
          d3.selectAll("line.graphline")
            .attr("opacity",1);
          d3.selectAll("circle.graphpoint")
            .attr("opacity", 1);
          d3.select(this).attr("r",4);
        })
        .on("click", function(){
          var clickedtime = Math.round(timeScale.invert(d3.select(this).attr("cx")));
          var tempyear = 2007+(clickedtime-clickedtime%12)/12;
          var tempmonth = clickedtime%12 + 1;
          var startdate = tempyear + "-" + ('00'+tempmonth).slice(-2) + "-01";
          var enddate = tempyear + "-" +('00'+tempmonth).slice(-2) + "-" + ('00' + new Date(tempyear, tempmonth, 0).getDate()).slice(-2);
          window.open("https://www.pixiv.net/search.php?word="+p.title+"&scd="+startdate+"&ecd="+enddate);
        })
        .transition()
        .delay(20*((y-2007)*12+m))
        .duration(100)
        .attr("r", "4");
              
      }
    }


}