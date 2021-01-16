/****** Global Variables ******/ 
var downloads = null, selections = null, inSel = null, tags = null, newSel={}, newTag={} ;
var cityColor = '#ddbb9d', carrierColor = '#D1E8E2', chipsColor =['#acddea','#c2bae1','#bac6e1', '#c4e4b8']


/****** Data Setting ******/ 
 queue()
  .defer(d3.json, "data/input_data.json")
  .await(boot);

/****** Start Here ******/  
function boot(error, data){
    if (error){
        alert("Error while loading data");
        return;
    }
    prepareData(data)
    createLegend();
}

/********** set the data & overall layout */
function prepareData(data){
    downloads = data[0].downloads
    //Changing name values to lowercase in case user enters different case
    downloads.forEach(function(d){
        d.tags.forEach(function(t){
            t.name = t.name.toLowerCase();
            t.value = t.value.toLowerCase();
        })
    })

    inSel = data[0].selections
    inSel.forEach(function(d){
        d.forEach(function(t){
            t.name = t.name.toLowerCase();
            t.value = t.value.toLowerCase();
        })
    })
    selections = computeSummary(inSel)
    createSelectionPanel ()
    createTagsSection ()
}

/******** Function to create the layout of the Selection Panel */
function createSelectionPanel(flag, dSel){
    var sContainer = d3.select("#selections_container")
    var sHeader = sContainer.append("div").attr("class", "selection_header")
    sHeader.append("h3").attr("class", "floatLeft").text("Selections")
    sHeader.append("button")
           .attr('class', 'fa icon_btn edit_buttons floatRight')
           .text("\uf055")
           .style("color", "white")
           .on("click",function(d){

            let dv =  d3.select(this.parentNode.parentNode).select(".selsC")
            if(dv.select(".new_sel")[0][0]===null) {
                addSelection(this)
            }
            else
                alert("Complete the opened form")
               
           }); 

    var selC = sContainer.append("div").attr("class", "selsC").selectAll("selections")
                               .data(selections)
                               .enter()
                               .append("div")
                               .attr("class", "selections")
                               .on("mouseover", function(d){
                                //    console.log("Hi", d)
                                   d3.select(this).style("border-color", "lightgrey")
                                   highlightTags(d)
                               })
                               .on ("mouseout", function(){
                                   d3.select(this).style("border-color", "white")
                                   d3.selectAll(".tag_groups").classed("highlight",false)
                               })

    createSel(selC,'iData', '')
    displaySelSummary(selC)
}

/********* Function to compute the title of the Selection based on the tags inside it */
function searchTagsTitle(d){
    var len =0, sel= null; 
    sel = d.selections[0]
    len =d.selections[0].length;
    //  console.log( len)
    var selNames=''
    
    for(let i=0; i<len;i++){
        if (i===0){
            selNames =   selNames +  sel[i].name + " = "  + sel[i].value 
        }
        if (len===1){
            return selNames
        }
        else if (i > 0) {
            selNames = selNames +  ' or ' +  sel[i].name + " = "  + sel[i].value + ' ' ;
            return selNames
        }
    }
}

// **** Add a new selection ***** //
function addSelection(cont){
    var  tagOption=null, div=null;
    var sel =  d3.select(".selsC")
    var nSel = sel.insert("div",":first-child")
                  .attr("class", "new_sel")

    newForm(nSel,'sel')
    addSelFormButtons(nSel)
}
//******* Once done, remov the form */
function removeAddSelForm(div){
    d3.select(div).remove()
}


function newForm(div, flag){
    // / *********     Drop Down for Tag Type ****** ///
    var select = div.append("select")
                     .attr("class", "new-tag-items")
                     .on("change", function(d){
                        var selectedIndex = select.property('selectedIndex'),
                        data = options[0][selectedIndex].__data__;
                        newTag.name = this.value
                     })
            
    var options = select.selectAll("option")
                        .attr("class", "new-tag-items")
                        .data(d3.map(tags, function(d,i){ if(i===0)newTag.name =newSel.name= d.name;return d.name;}).keys())
                        .enter()
                        .append("option")
                        .attr("value",function(d){  return d;})
                        .text(function(d){return toTitleCase(d);})

    div.append("input")
       .attr('type', 'textbox')
       .on("change", function(d){
        if(flag==='tag')
            newTag.value = this.value.toLowerCase();
        else if(flag==='sel')
            newSel.value= this.value.toLowerCase()
             
        })
}

/******* Function to create buttons for Selection Creation form */
function addSelFormButtons(div){
    div.append("button")
       .attr("class", "new-tag-items") 
       .text( "Add Tag to Selection")
       .on("click",function(d){
                if(newSel.name && newSel.value){
                    var text =  newSel.name + " =" + " " + newSel.value 
                     let sel = d3.select(this.parentNode.parentNode)
                                  .append("div").attr("class", "selections")
                     d3.select("#add_sel_btn").style("display", "block")
                     createSel(sel, 'nData', text )
                     d3.select(this).attr("disabled", true)
                }
                else
                 alert("Please enter the data to proceed!")  
       })

       div.append("button")
       .attr("class", "new-tag-items") 
       .attr("id","add_sel_btn")
       .text("Add Selection")
       .style("display", "none")
       .on("click",function(d){
               inSel.push([{"name":newSel.name, "value": newSel.value}])
               updateData(inSel)
               highlightTags({"name":newSel.name, "value": newSel.value}, 'newSel')
       })
       
       div.append("button")
       .attr("class", "new-tag-items") 
       .text("Cancel")
       .on("click",function(d){
           d3.select(this.parentNode).remove()
       })

       
}
//******** Function to create the UI of each selection */
function createSel(div, flag, text){
    var bDiv = div.append("div")
                  .attr("class","sel_header")

      bDiv.append("div").attr("class","floatLeft").append("p")
       .text(function(d,e){
            if(flag==="iData"){
                    return toTitleCase(searchTagsTitle(d))
            }
            else if (flag==="nData"){
                    return toTitleCase(text)
            }
        })

    // Create the deletebutton on the Selection
   var x = bDiv.append("div").attr('class', 'floatRight')
    x.append("button")
        .attr('class', 'fa icon_btn tag_btn')
        .text("\uf1f8")
        .on("click", function(d){
                deleteSelection(this)
        })
}

//******** create the summary part of the Selection 
function displaySelSummary(div){
    var sumD = div.append("div").attr("class","sel_Summary")

    var chipsDiv   =  sumD.selectAll("selections")
                        .data(function(d){
                            return d.summary;
                        })
                        .enter()
                        .append("div")

     chipsDiv.append("span")
             .attr("class","floatLeft")
             .text(function(d,i){
                if (i===0) return "Count:"
                if (i===1) return "Avg Size: ";
                if (i===2) return 'Avg Time: ';
                if (i===3) return 'Avg Speed: ';
              })
              .style("margin-right", "5px")
    
    
    var sChips = chipsDiv.append("div")
                         .attr("class", "floatRight chips sel_chips")
                         .style("background-color", function(d,i){
                            if(!isNaN(d) && Number(d) !== 0){
                                return chipsColor[i]
                            } 
                            else {
                                return "lightgrey"
                            }
                          })

    sChips.html(function (d){
                if(!isNaN(d))
                    return d;
                else{
                    return "None"
                }
            })
}
/******** Function to connect selections with downloads and compute summary within each selection */
function computeSummary(inputSel){
    var data=[], summaryData={}; 
    summaryData.selections = [],summaryData.downloads=[]; 
    inputSel.forEach(function(selection,i){
            summaryData.selections.push(selection)
            var summaryTime=0,  summarySize=0, count=0;
            selection.forEach(function(sel){
                downloads.forEach(function(dwd, d_i){
                    dwd.tags.forEach(function(tag){
                        if (sel.value.toLowerCase() === tag.value.toLowerCase()){
                            if (summaryData.downloads.length === 0 ){
                                summaryData.downloads.push(dwd)
                                summaryTime=summaryTime + dwd.time;
                                summarySize=summarySize + dwd.size;
                                count = count+1
                              }
                            else if(summaryData.downloads.length > 0 && !summaryData.downloads.includes(dwd)){
                                summaryData.downloads.push(dwd)
                                summaryTime=summaryTime + dwd.time;
                                summarySize=summarySize + dwd.size;
                                count = count+1
                            }
                        } //end if
                    })//dwd
                })//downloads
            }) //selection
            summaryData.summary=[count, Number((summarySize/count).toFixed(2)), Number((summaryTime/count).toFixed(2)), Number((summarySize/summaryTime).toFixed(2))];
            data.push(summaryData)
            summaryData= {},summaryData.selections = [],summaryData.downloads=[]; 
        })//selections
    return data
}

/******* deletes a selection and finds and removes its data */
function deleteSelection(btn){
    var dSelData = d3.select(btn.parentNode.parentNode)[0][0].__data__;
    d3.select(btn.parentNode.parentNode.parentNode).remove()

    if(dSelData!==undefined && dSelData!== null){
        var delSel = dSelData.selections[0]
        inSel.forEach(function(sel, selI){
            var flag = false, ind=null;
                    if(delSel.length===sel.length){
                        sel.forEach(function(s,i){
                               if(s ===delSel[i])
                        flag=true;
                        else flag=false
                        })
                    }
               
                if(flag){
                    inSel.splice(selI,1)
                }
        })
    }
        
}

//****** data of the current selection : find the tags in the download and highlight them */
function highlightTags(data, flag){
    d3.selectAll(".tag_groups").classed("highlight", function(d, e){
        if(flag!=='newSel'){
            var len =data.selections[0].length;
            var sel = data.selections[0]
                for(let i=0; i<len;i++){
                   if(d.tags.find(element => element.value ===sel[i].value))
                        return true
                }
        }
        else if (flag==='newSel'){
            if(d.tags.find(element => element.value ===data.value))
                return true
        }
    })
}
/******************* Tags Zone  ******************/
function createTagsSection(){
    var tContainer = d3.select("#tags_container")

    var tHeader = tContainer.append("div").attr("class", "selection_header tag_header ")

    tHeader.append("h3").attr("class", "floatLeft").text("Tagged Download Sessions")
    
    var dwdContainer = tContainer.selectAll("tag_groups")
                             .data(downloads)
                             .enter()
                             .append("div")
                             .attr("class", "tag_groups")

    dwdContainer.append("button")
                .attr('class', 'fa icon_btn edit_buttons')
                .text("\uf055")
                .on("click",function(d){
                    // only if the form is not open already, create a new form
                    let dv =  d3.select(this.parentNode)
                    if(dv.select(".new_tag_ct")[0][0]===null) {
                        var div = dv.select(".session_tags")
                                    .append("div")
                                    .attr("class","new_tag_ct")

                        newForm(div,'tag')
                        addTagForm(div); 
                    }  
                })

    var sessionTags = dwdContainer.append("div").attr("class","session_tags")

    var tagDivs = sessionTags.selectAll("tags")
                             .data(function(d,i){tags = d.tags; ; return d.tags;})
                             .enter()
                             .append("div")
                             .attr("class", "tags")

    createTag(tagDivs, downloads, "dTags")
    var dwdSession = dwdContainer.append("div").attr("class","tag_details")
    createChips(dwdSession)
} 

/********** Function to display the intake form to add a new tag */
function addTagForm(div){
    // Readonly Flag
    var flag = div.append("div").attr("class", "new-tag-items labelFont").append("span").text("Read Only").style("font-size", "")

    flag.append("input")
        .attr('type', 'checkbox')
        .attr("value", function(){ newTag.readOnly = false; return false;})
        .on("change", function(){
            newTag.readOnly= d3.select(this).property("checked")
        })

    div.append("button")
       .attr("class", "new-tag-items") 
       .text("Add")
       .on("click",function(d){
           if(newTag.name && newTag.value){
                createTag (d3.select(this.parentNode.parentNode), newTag, 'nTags')
                d.tags.push(newTag)
                d3.select(this.parentNode).remove()
                updateData(inSel)
           }
           else alert("Please enter the data to proceed!")
       })

       div.append("button")
       .attr("class", "new-tag-items") 
       .text("Cancel")
       .on("click",function(d){
           d3.select(this.parentNode).remove()
       })
       
}

/************ Function to delete a tag from the Tags Panel  ***/
function deleteTag(btn){
    var dSession = d3.select(btn.parentNode.parentNode.parentNode)[0][0].__data__;
    var sessionC = d3.select(btn.parentNode.parentNode.parentNode.parentNode)
    var dTag = d3.select(btn.parentNode.parentNode)[0][0].__data__;
    d3.select(btn.parentNode.parentNode).remove()
    
    // Find the data in the downloads to remove the data
    downloads.forEach(function(dw){
            if(dw.tags === dSession.tags  ){
                var ind = dw.tags.findIndex(x => x.value ===dTag.value)
                if(ind >=0 ){
                    dw.tags.splice (ind, 1)
                    // if all tags in a session are deleted, remove the session from UI
                    if(dw.tags.length ===0){
                        sessionC.remove()
                    }
                }
            }
    })
    // Update the Selection Panel
    updateData(inSel)
}

function updateData(data){
    d3.selectAll('#selections_container > *').remove()
    selections = computeSummary(data)
    createSelectionPanel (selections)
}

/************ Function to prepare the layout of Tags     *************
                 div is the parent div, to add tag to
                data is different for a new vs data-based tag, 
                flag shows if its a newly created tag or tag from the data ***/

function createTag(div, data, flag){
    var tDiv=null, bDiv=null;

    if (flag==='nTags'){
        tDiv = div.append("div").attr("class","tags").data([data])
        tDiv.append("div").attr("class","floatLeft").append("p").text(function(d){ return toTitleCase(d.value)})
        bDiv =  tDiv.append("div").attr('class', 'floatRight')
    }
    else {
        tDiv = div.append("div").attr("class","floatLeft")
        tDiv.append("p").text(function(d){return toTitleCase(d.value)})
        var bDiv =  div.append("div").attr('class', 'floatRight')
    }  
    // Delete button           
    bDiv.append("button")
        .attr('class', 'fa icon_btn tag_btn')
        .style("cursor",function(d){
            if(d.readOnly) return "not-allowed"
            else return "pointer"
        })
        .text("\uf1f8")
        .style("color", function(d){
            if(d.readOnly) return 'grey'
        })
        .on("click", function(d,i){
            if(!d.readOnly)
                deleteTag(this)
        })
    d3.selectAll(".tags").style("background-color", function(d){
        if (d.name==='city') return cityColor
        else if(d.name==='carrier') return carrierColor
    })
}

/*/////////////                                     /////////////  
                        General Helper Functions        
///////////////                                     ///////////*/
/****** Change the case of the cities and careers */
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

//****** To create the color legend on top of the UI */
function createLegend(){
    data = ['City', 'Carrier','Count', 'Size (MB)', 'Time (s)', 'Speed (MBps)']
    dColor = [cityColor,carrierColor].concat(chipsColor);
    var lDiv = d3.select("#legend")
    
    lDiv.append("span").text("Legend: ").style("font-weight","bold")

    var sumD = lDiv.append("div")

    var chipsDiv   =  sumD.selectAll(".legDiv")
                        .data(data)
                        .enter()
                        .append("div")
                        .attr("class","legDiv")
                     
      chipsDiv.append("span")
             .attr("class","floatLeft")
             .text(function(d,i){
                    return d
              })
              .style("margin-right", "5px")
    
    
    var sChips = chipsDiv.append("div")
                         .attr("class", "floatRight chips leg_chips")
                         .style("background-color", function(d,i){
                                return dColor[i]
                          })
}

/******* To create the chips for Tags */
function createChips(div){
    var data=null;
    // var keySpans =['Size', 'Time', 'Speed']

    // div = div.selectAll()
    var chipDivs   =  div.selectAll("chipDivs")
                         .data(function(d,i){
                            d.speed = (d.size/d.time).toFixed(2);
                            data = [];
                            Object.keys(d).forEach(function eachKey(key) { 
                                if(key!=='tags'){
                                    data.push({[key]:d[key]})
                                }
                            });
                            return data  
                        })
                        .enter()
                        .append("div")


    chipDivs.append("span")
            .text(function(d,i){
                 return  Object.keys(d)
              })
              .style("margin-right", "5px")
    
    
    var sChips = chipDivs.append("div")
                         .attr("class",  "chips tag_chips")
                         .style("background-color", function(d,i){
                                return chipsColor[i+1]
                          })

    sChips.html(function (d, i){
             return d[Object.keys(d)]
          })
}