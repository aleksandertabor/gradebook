var sdata="";
var bearer ="";

if (Cookies.get('loggedIn') ) {
    bearer = Cookies.get('loggedIn');
}


//! Functions

// ** Register a new user
function registerUser() {
    $("#registerForm").submit(function (e) { 
        e.preventDefault();
        var newUser = {
            Email: $(".email", this).val(),
            Password: $(".password", this).val(),
            ConfirmPassword: $(".password", this).val()
        };
        console.log(newUser);
        var response = "";
        $.ajax({
            type: "POST",
            url: "http://gradebook.somee.com/api/Account/Register",
            data: newUser,
            beforeSend: function () {
                $(".bouncing-loader").css("display", "flex");
            },
            success: function (data) {
                console.log(data);
                response = JSON.parse(JSON.stringify(data));
                console.log("Registered ");
                $(this).find("input").val("");
                $(".bouncing-loader").hide();
            },
            failure: function (response) {
                console.log("failure");
                alert(response);
            },
            error: function (response) {
                sResponse = JSON.parse(JSON.stringify(response));
                console.log("error");
                $('.registerForm_Wrapper .validation-error').html('<img src="error.svg" alt="Błąd!">' + sResponse.responseJSON.ModelState[""]["0"]);
                $('.registerForm_Wrapper .validation-error').fadeIn();
                console.table(sResponse);
                $(".bouncing-loader").hide();
            }
        });
    });
}

// ** Login user
function loginUser() {
    $("#loginForm").submit(function (e) { 
        e.preventDefault();
        var user ={
            grant_type:'password',
            username: $(".email", this).val(),
            password: $(".password", this).val()
        };
        console.log(user);
        var response = "";
        $.ajax({
            type: "POST",
            url: "http://gradebook.somee.com/token",
            data: user,
            beforeSend: function () {
                $(".bouncing-loader").css("display", "flex");
            },
            success: function (data) {
                console.log(data);
                response = JSON.parse(JSON.stringify(data));
                console.log("Logged in ");
                bearer = JSON.parse(JSON.stringify(data));
                bearer = bearer.access_token;
                var SixtyMinutes = new Date(new Date().getTime() + 60 * 60 * 1000);
                Cookies.set('loggedIn', bearer, { expires: SixtyMinutes });
                loggedIn();
                getStudents();
                $(".bouncing-loader").hide();
                $("#loginForm input.email, #loginForm input.password").val("");
            },
            failure: function (response) {
                console.log(JSON.stringify(response));
                console.log("failure");
                $('.loginForm_Wrapper').append('<p>' + response + '</p>');
                alert(response);
                $(".bouncing-loader").hide();
            },
            error: function (response) {
                sResponse = JSON.parse(JSON.stringify(response));
                console.log("error");
                $('.loginForm_Wrapper .validation-error').html('<img src="error.svg" alt="Błąd!">' + sResponse.responseJSON.error_description);
                $('.loginForm_Wrapper .validation-error').fadeIn();
                console.table(sResponse);
                $(".bouncing-loader").hide();
            }
        });
    });
}

// ** Logout
function logout() {
    $(".logout").click(function (e) { 
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://gradebook.somee.com/api/Account/Logout",
            headers: {
                'Authorization': 'Bearer ' + bearer
            },
            //data: newUser,
            beforeSend: function () {
                $(".bouncing-loader").css("display", "flex");
            },
            success: function (data) {
                console.log(data);
                response = JSON.parse(JSON.stringify(data));
                console.log("Wylogowano ");
                $("#forms").fadeIn();
                $(".logout").fadeOut();
                $("#loggedSection").fadeOut();
                $(".bouncing-loader").hide();
            },
            failure: function (response) {
                console.log("failure");
                alert(response);
            },
            error: function (response) {
                sResponse = JSON.parse(JSON.stringify(response));
                console.log("error");
                console.table(sResponse);
                $(".bouncing-loader").hide();
            }
        });
    });
}

function getStudents() 
{
        $.ajax({
            type: "GET",
            url: "http://gradebook.somee.com/api/Students",
            headers: {
                'Authorization': 'Bearer ' + bearer
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $(".bouncing-loader").css("display", "flex");
            },
            success: function (data) {
            sdata = JSON.parse(JSON.stringify(data));
            console.table(sdata);
            $.each(sdata, function (index, student) { 
                $('#students').append('<div class="row">');
                $('#students').append('PESEL: ' + student.Pesel);
                $('#students').append('Imię: ' + student.FirstName);
                $('#students').append('Nazwisko: ' + student.SurName);
                $('#students').append('</div>');
                 console.log(student.FirstName);
            });
    
            $(".bouncing-loader").hide();
    
            },
            failure: function (response) {
                alert(response.responseText);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
	
}


function loggedIn() {
    // TODO verification of token from API, not from cookies
    if (Cookies.get('loggedIn')) {
        console.log("Jesteś zalogowany!");
        $("#forms").fadeOut();
        $(".logout").fadeIn();
        $("#loggedSection").fadeIn();
    }
}

/*** Printing grades */

function PrintElem()
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + ' - Lista studentów</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + ' - Lista studentów</h1>');
    mywindow.document.write(document.getElementById("students").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus(); 

    mywindow.print();
    mywindow.close();

    return true;
}


//! Ready start -- INIT

$(document).ready(function()
{

    registerUser();
    loginUser();
    loggedIn();
    logout();

    //TODO need function for this

    $("#printStudents").click(function (e) { 
        e.preventDefault();
        PrintElem();
    });


    //TODO need function for this

    $('.tab-list').each(function(){
        var $this = $(this);
        var $tab = $this.find('li.active');
        var $link = $tab.find('a'); 
        var $panel = $($link.attr('href'));
      
        $this.on('click', '.tab-control', function(e) { 
          e.preventDefault();
          var $link = $(this), 
              id = this.hash; 
      
          if (id && !$link.is('.active')) { 
            $panel.removeClass('active'); 
            $tab.removeClass('active'); 
      
            $panel = $(id).addClass('active');
            $tab = $link.parent().addClass('active'); 
          }
        });
      });


}) //! end ready

	
function GetAll(s_url) 
{
	$.ajax({
		type: "GET",
		url: s_url,
		headers: {
			'Authorization': 'Bearer ' + bearer
		},
		contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $(".bouncing-loader").css("display", "flex");
        },
		success: function (data) {
        sdata = JSON.parse(JSON.stringify(data));
        console.log(sdata);
		//alert(JSON.stringify(data))
		//alert(sdata);
		console.log("\nSuccess GetAll(), result:\n");

		mySection.innerText += "\n";
		for (var i = 0; i < data.length; i++) {
			mySection.innerText += data[i] + "\n";
			console.log(data[i] + "\n");
        }
        $(".bouncing-loader").hide();

		},
		failure: function (response) {
			alert(response.responseText);
		},
		error: function (response) {
			alert(response.responseText);
		}
	});
}



function GetById(s_url, id) 
{
	s_url += "/" + id;
	
	$.ajax({
		type: "GET",
		url: s_url,
		headers: {
			'Authorization': 'Bearer ' + bearer
		},
		contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $(".bouncing-loader").css("display", "flex");
        },
		success: function (data) {
		sdata = JSON.parse(JSON.stringify(data));
		//alert(JSON.stringify(data))
		//alert(sdata);
		console.log("\nSuccess GetById(), result:\n");

		mySection.innerText += "\n";
		mySection.innerText += sdata + "\n";
		console.log(sdata + "\n");
        $(".bouncing-loader").hide();

		},
		failure: function (response) {
			alert(response.responseText);
		},
		error: function (response) {
			alert(response.responseText);
		}
    });
	
}



	
