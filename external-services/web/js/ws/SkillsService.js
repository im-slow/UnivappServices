var checklist=[ ];
function skillRequest(pagenumber = 1){
  var settings = {
    "url": "http://localhost:8000/api/skills?p="+pagenumber+"&pl=30",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Accept":["application/json", "application/xml"]
      },
      dataType: 'json',
  }; 
  $.ajax(settings).done(function (response) {
    console.log(response);
    $("#skilllist").html("");
      response.data.forEach(element => {
        console.log(element);
        $("#skilllist").append(
            "<input type='checkbox'  value='"+element.id+"'onClick='idListUpdate("+element.id+",this)'"+(checklist.includes(element.id)?"checked":"")+"><span class='textcheckbox'>"+element.name+"</span></input><br>"
        );
      });      
      $("#skilllist").append("<button class='buttonskilllist button' onClick='skillRequest("+((pagenumber>1)?pagenumber-1:pagenumber)+");return false;'>Previous</button>"+"<button class='buttonskilllist button' onClick='skillRequest("+((pagenumber<Math.ceil((response.meta.total_elements)/response.meta.page_length))?pagenumber+1:pagenumber)+");return false;'>Next</button>");
  });
}
function getDomain(pageNumber){
  var settings = {
    "url": "http://localhost:8000/api/domains?p="+pageNumber+"&pl=10",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Accept":["application/json", "application/xml"]
    },
    dataType: 'json',
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
    $("#domainList").html("");
    response.data.forEach(element => {
     // console.log(element);
      $("#domainList").append(
          "<option value='"+element.id+"'>"+element.id+": "+element.name.substr(0,1).toUpperCase()+element.name.substr(1)+"</option>"
      );
    });
  });
}
function sender( send ){

  
  var myObject = new Object();
  myObject.high=[];
  myObject.medium=[];
  myObject.low=[];
  //console.log($(sender).serializeArray());
  $(".secSkill").each(function(response){
    /*console.log( elem+": "+ $(this).find(".secSkillInput").attr("name") );*/
    //console.log( elem+": "+ $(this).find(".skillTier").val() );
    switch($(this).find(".skillTier").val()){
      case "alto":
        myObject.high.push($(this).find(".secSkillInput").val());
        break;
      case "medio":
        myObject.medium.push($(this).find(".secSkillInput").val());
        break;
      case "basso":
        myObject.low.push($(this).find(".secSkillInput").val());
        break;
    }
  });
  var title= $(send).find("#title").val();
  var description= $(send).find("#description").val();
  var domain= $(send).find("#domainList").val();
  var highToSend=myObject.high.toString();
  var mediumToSend=myObject.medium.toString();
  var lowToSend=myObject.low.toString();
  //console.log(domain);
  
  var form = new FormData();
  form.append("name", title);
  form.append("descr", description);
  form.append("domain", domain);
  form.append("high_prio_skills", highToSend);
  form.append("medium_prio_skills", mediumToSend);
  form.append("low_prio_skills", lowToSend);
  form.append("user_id", 4);
  
  var settingsForm = {
    "url": "http://localhost:8000/api/jobs",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form,
    "headers": {
      "Accept":["application/json", "application/xml"]
    },
    dataType: 'json',
  };
  
  $.ajax(settingsForm).done(function (response) {
    var jobId=response.data.insertId;
    var formDefSkill = new FormData();
    checklist.forEach(element => {
      formDefSkill.append("skills", element);
    });
   // console.log(formDefSkill.get("skills"));
   
  var settingsDefSkill = {
      
      "url": "http://localhost:8000/api/jobs/"+jobId+"/skills",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Accept": ["application/json", "application/json"]
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": formDefSkill,
      dataType: 'json',
    };

    $.ajax(settingsDefSkill).done(function (responseSkill) {
      alert("inserimento effettuato");
      window.location.replace("../views/offerta.html?jobid="+jobId+"&userid=4");//4 va rimpiazzato
    });
  });
  return false;

  
}
/**************UTILITY****************/

function idListUpdate(id,elem){
  if(elem.checked){
    checklist.push(id);
  }else{
    checklist.splice( checklist.indexOf(id), 1 ); 
  } 
}
/*exec*/
$(document).ready(function(){
  skillRequest(1);
  getDomain(1);
});
