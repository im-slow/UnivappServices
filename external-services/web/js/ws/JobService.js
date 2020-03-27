var highchecked=0;
var mediumchecked=0;
var lowchecked=0;
var highmax=0;
var midmax=0;
var lowmax=0;
function sender(user,job){
  var form = new FormData();
  form.append("user", user);
  form.append("job", job);
  form.append("max_high", highmax);
  form.append("max_medium", midmax);
  form.append("max_low", lowmax);
  form.append("selected_high", highchecked);
  form.append("selected_medium", mediumchecked);
  form.append("selected_low", lowchecked);

  var settingsCache = {
    "url": "http://localhost:8000/api/match/refined?cacheless=true&cacheonly=false",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Accept": ["application/json", "application/xml"]
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form,
    datatype:'json',
  };
  $.ajax(settingsCache).done(function (response) {
    var jsonp= JSON.parse(response);
    $("#matched").html("");
    $("#matched").append("Il tuo punteggio per questa offerta è:&nbsp;"+jsonp.data[0].match_percentage+"%");
  });
  }
function checkSkillEvent(checkbox){
    
  var incrementvalue=$(checkbox).is(':checked')?1:-1;
  console.log($(checkbox).attr('class').split(" ")[1].toLowerCase());
  switch($(checkbox).attr('class').split(" ")[1].toLowerCase()){
    case("high"):
        highchecked+=incrementvalue;
        console.log("HIGH "+highchecked);
      break;
      case("medium"):
        mediumchecked+=incrementvalue;
        console.log("MiD "+mediumchecked);
      break;
      case("low"):
        lowchecked+=incrementvalue;
        console.log("LOW "+lowchecked);
      break;
  }
}
$(document).ready(function(){
  var sPageURL = window.location.href;
  var url = new URL(sPageURL);
  var job = url.searchParams.get("jobid");
  var userid = url.searchParams.get("userid");
  console.log(job+" "+userid);
  var settingsjob = {
    "url": "http://localhost:8000/api/jobs/"+job,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Accept": "application/json"
    },
  };
  $.ajax(settingsjob).done(function (response) {
    console.log(response.data[0]);
    $("#submitter").append("<button class=\"button is-warning is-rounded is-size-5 is-family-sans-serif\" onClick=\"sender("+userid+","+job+")\">Calcola</button>")
    highpriosplit=response.data[0].high_prio_skills.split(",");
    mediumpriosplit=response.data[0].medium_prio_skills.split(",");
    lowpriosplit=response.data[0].low_prio_skills.split(",");
    $("#wrapper").append("<div class='is-size-1 is-family-sans-serif has-text-centered firstTitle'>"+response.data[0].name+"</div><br><div style='padding-left: 100px;padding-right: 100px;'>"+response.data[0].descr+"</div>" );
    highpriosplit.forEach(element => {
      if(element!=""){
      $(".hard").append("<input type='checkbox' class='radiofloatleft high' onClick='checkSkillEvent(this);'>"+element+"</input></br>");  
      highmax++;
      }
    });
    mediumpriosplit.forEach(element => {
      if(element!=""){
      $(".medium").append("<input type='checkbox' class='radiofloatleft medium' onClick='checkSkillEvent(this);'>"+element+"</input></br>");  
      midmax++;
      }
    });
    lowpriosplit.forEach(element => {
      if(element!=""){
      $(".low").append("<input type='checkbox' class='radiofloatleft low' onClick='checkSkillEvent(this);'>"+element+"</input></br>");  
      lowmax++;
      }
    });
   
  });
});