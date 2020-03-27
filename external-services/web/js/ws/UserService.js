$(document).ready(function(){
    
    var settings = {
        "url": "http://localhost:8000/api/users/4",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Accept": "application/json"
        },
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        console.log(response.data[0].name);
        console.log(response.data[0].surname);
        console.log(response.data[0].username);
        console.log(response.data[0].bio);
        console.log(response.data[0].skills);
        /*
          Struttura item 
          {
            "data": [
                  {
                    "name": "Pietro",
                    "surname": "Ciammaricone",
                    "student_id": 1234566,
                    "email": "tizio@caiio.com",
                    "skills": "salutare",
                    "phone_number": 1244567890,
                    "username": "nazgot",
                    "password": "123456sdf",
                    "bio": "qualcosa di accattivante",
                    "is_recruiter": 0,
                    "secondaryskills": null,
                    "domain": 1
                    }
                    ],
                    "errors": "",
                    "meta": ""
                }
        */
        
        $(".name").append(response.data[0].name+" "+response.data[0].surname);
            //" (Student ID:<i>"+response.data[0].student_id+"</i>)<br><span class='grayname'>@"+response.data[0].username+"</span>"+(response.data[0].is_recruiter==1?" Recruiter":""));
         $(".username").append("@"+response.data[0].username+ "&nbsp;&nbsp;&nbsp;Student ID:&nbsp;" + response.data[0].student_id);
        $(".bio").append(response.data[0].bio);
        //$("#profileinfo #avatarwrapper").append("<img style='width:100px; heigth:100px;'src='http://localhost:8000/api/users/4/avatar'/>");
        var settingsDomain = {
            "url": "http://localhost:8000/api/domains/"+response.data[0].domain,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Accept": "application/json"
              },
          };
          
          $.ajax(settingsDomain).done(function (responseDomain) {
              console.log(responseDomain);
              $(".domain").append(responseDomain.data[0].name);
            //$("#profileinfo #domain").append("<span class='capitalize'>"+responseDomain.data[0].name);
          });
        
        //$("#profileinfo #skillwrapper").append(response.data[0].skills);
          response.data[0].skills.split(",").forEach(function (item, index, array) {
              console.log("split", item);
              $(".skills").append("<a href=\"#\">#"+item+"</a>");
          });

        $(".contacts").append("Email:&nbsp;"+response.data[0].email+"&nbsp;&nbsp;&nbsp; Phone number:&nbsp;"+response.data[0].phone_number);

      });
});