function refinedLevel(value){
  if(value<=20)return "Insufficiente";
   if(value>20&&value<=40)return "Sufficiente";
   if(value>40&&value<=60)return "Buono";
   if(value>60&&value<=80)return "Distinto";
   if(value>80&&value<=100)return "Ottimo";
  
}
$(document).ready(function(){

  var jobs = [];
  var form = new FormData();
  form.append("user", "4");

  var settings = {
    "url": "http://localhost:8000/api/match/raw?cacheless=true",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Accept":["application/json", "application/xml"]
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form,
    dataType: 'json',
  };
  
  $.ajax(settings).done(function (response) {
    response.data.sort(compare('match_percentage', 'desc'));
    console.log("response.data",response.data);
    response.data.forEach(element => {
      $.ajax({
        "url": "http://localhost:8000/api/jobs/"+element.job_id,
        "method": "GET",
        "async": false,
        "timeout": 0,
        dataType: 'json',
      }).done(function (responseget) {
       console.log("responseget",responseget);

        var formCache = new FormData();
        formCache.append("user", "4");
        formCache.append("job", element.job_id);
        formCache.append("max_high", "0");
        formCache.append("max_medium", "0");
        formCache.append("max_low", "0");
        formCache.append("selected_high", "0");
        formCache.append("selected_medium", "0");
        formCache.append("selected_low", "0");
        var  settingsRefined = {
        "url": "http://localhost:8000/api/match/refined?cacheless=false&cacheonly=true",
        "method": "POST",
        "async": false,
        "timeout": 0,
        "headers": {
          "Accept": ["application/json", "application/xml"]
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formCache
      };
        
        $.ajax(settingsRefined).done(function (responseRefined) {
          var jsonp=JSON.parse(responseRefined);
          jobs.push({ name: responseget.data[0].name, match_percentage: jsonp.data!=""?jsonp.data[0].match_percentage:element.match_percentage, job_id:element.job_id,isrefined:(jsonp.data!=""?1:0) });
          jobs.sort((compare('match_percentage', 'desc')));
          //console.log(jobs);
          //jobs.push(jsonp.data!=""?jsonp.data[0]:element);
          //jobs.sort((compare('match_percentage', 'desc')));
          //console.log(jobs);
          });
        });
      //jQuery.getJSON(url,data,success) → jqXHR
    });
    
    jobs.forEach(function (item, index, array) {
      
        $(".table-user-append").append("                            <tr>\n" +
"                                <td><img src=\"http://lorempixel.com/100/100/people/1\" alt=\"\" /></td>\n" +
"                                <td><a href='offerta.html?jobid="+item.job_id+"&userid=4'>"+item.name+"</a></td>\n" +
"                                <td>"+(item.isrefined===1?item.match_percentage+"%":refinedLevel(item.match_percentage)+"")+"</td>\n" +
"                            </tr>");
    });
    
    /*

  response.data.forEach(element => {
      console.log(element);
  });*/
  },"json");});


//Algoritmo per ordinare array di oggetti
'use strict';
const compare = (key, order = 'desc') => {
  return (a, b) => {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    let varA = (typeof a[key] === 'string') ? a[key].toLowerCase() : a[key];
    let varB = (typeof b[key] === 'string') ? b[key].toLowerCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    //console.log(comparison * -1);
    return ((order == 'desc') ? (comparison * -1) : comparison);
  }
};