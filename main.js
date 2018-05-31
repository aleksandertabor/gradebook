var sdata="";
var bearer ="";

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
            url: "https://gradebook.somee.com/api/Account/Register",
            data: newUser,
            success: function (data) {
                console.log(data);
                response = JSON.parse(JSON.stringify(data));
                console.log("Registered ");
            },
            failure: function (response) {
                console.log("failure");
                alert(response);
            },
            error: function (response) {
                console.log("error");
                alert(response);
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
            url: "https://gradebook.somee.com/token",
            data: user,
            dataType: "json",
            success: function (data) {
                console.log(data);
                response = JSON.parse(JSON.stringify(data));
                console.log("Logged in ");
                bearer = JSON.parse(JSON.stringify(data));
                bearer = bearer.access_token;
                Cookies.set('loggedIn', "cokolwiek", { expires: 7 });
                loggedIn();
            },
            failure: function (response) {
                console.log("failure");
                alert(response);
            },
            error: function (response) {
                console.log("error");
                alert(response);
            }
        });
    });
    loggedIn();
}


function loggedIn() {
    // TODO verification of token from API, not from cookies
    if (Cookies.get('loggedIn')) {
        console.log("Jesteś zalogowany!");
        $("#forms").hide();
        $("#loggedSection").show();
    }
}


//! Ready start -- INIT

$(document).ready(function()
{

    registerUser();
    loginUser();
    loggedIn();
	// $.ajax({
	// 	type: "POST",
	// 	url: "http://gradebook.somee.com/token",
	// 	data:user,
	// 	contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	// 	dataType: "json",
	// 	success: function (data) {
	// 		bearer = JSON.parse(JSON.stringify(data));
	// 		bearer = bearer.access_token;
	// 		//console.log("\nSuccess get token\n");
	// 		//console.log("Bearer " + bearer + "\n");
	// 	},
	// 	failure: function (response) {
	// 		alert(response.responseText);
	// 	},
	// 	error: function (response) {
	// 		alert(response.responseText);
	// 	}
    // });
    



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
		success: function (data) {
		sdata = JSON.parse(JSON.stringify(data));
		//alert(JSON.stringify(data))
		//alert(sdata);
		console.log("\nSuccess GetById(), result:\n");

		mySection.innerText += "\n";
		mySection.innerText += sdata + "\n";
		console.log(sdata + "\n");

		},
		failure: function (response) {
			alert(response.responseText);
		},
		error: function (response) {
			alert(response.responseText);
		}
    });
	
}



	
