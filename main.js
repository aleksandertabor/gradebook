var sdata="";
var bearer ="";


// Variables
const loader = $('.bouncing-loader');




const server = 'http://gradebookx.azurewebsites.net/';


class User {

    constructor(bearer) {
        this._bearer = bearer;
    }

    get bearer() {
        return this._bearer;
    }

    set bearer(bearer) {
        this._bearer = bearer;
    }

    postAction(url, data, beforeSend, onSuccess, onError) {
        console.log(data);
        $.ajax({
            type: "POST",
            url: server + url,
            data: data,
            beforeSend: function () {
                beforeSend();
            },
            success: function (data) {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                onSuccess(data);
            },
            failure: function (data) {
                console.log("failure");
                alert(response);
            },
            error: function (data) {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                onError(data);
            }
        });

    }

    getAction(url, beforeSend, onSuccess, onError) {
        $.ajax({
            type: "GET",
            url: server + url,
            headers: {
                'Authorization': 'Bearer ' + this._bearer
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                beforeSend();
            },
            success: function (data) {
            data = JSON.parse(JSON.stringify(data));
    
            onSuccess(data);
    
            },
            failure: function (data) {
                alert(response.responseText);
            },
            error: function (data) {
                onError(data);
            }
        });
    }
    
}


var user = new User();



if (sessionStorage.getItem('loggedIn') ) {
    bearer = sessionStorage.getItem('loggedIn');
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
        user.postAction('api/Account/Register', newUser, function() {
            loader.css("display", "flex");
        }, function() {
            $(this).find("input").val("");
            console.log("Registered ");
            $('.registerForm_Wrapper').slideToggle();
            $('.loginForm_Wrapper .validation').html('<img src="success.svg" alt="Sukces!"><span class="validation-success"> Twoje konto zostało zarejestrowane. Możesz się zalogować.</span>');
            $('.loginForm_Wrapper .validation').fadeIn();
            $('input.email').focus();
            loader.hide();
        }, function(data) {
            console.log("nie dziala");
            $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.ModelState[""]["0"] + '</span>');
            $('.registerForm_Wrapper .validation').fadeIn();
        });
        
    });
}

// ** Login user
function loginUser() {
    $("#loginForm").submit(function (e) { 
        e.preventDefault();
        var logUser ={
            grant_type:'password',
            username: $(".email", this).val(),
            password: $(".password", this).val()
        };
        console.log(logUser);
        user.postAction('token', logUser, function() {
            loader.css("display", "flex");
        }, function(data) {
            user._bearer = data.bearer;
            sessionStorage.setItem('loggedIn', user._bearer);
            loggedIn();
            getStudents();
            $("#loginForm input.email, #loginForm input.password").val("");
            $('.loginForm_Wrapper .validation').fadeIn();
            loader.hide();
        }, function() {
            console.log("nie dziala");
        });
        
    });
}

// ** Logout
function logout() {
    $(".logout").click(function (e) { 
        e.preventDefault();
        user.postAction('api/Account/Logout', "", function() {
            loader.css("display", "flex");
        }, function() {
            $("#forms").fadeIn();
            $(".logout").fadeOut();
            console.log("Wylogowano ");
            $("#loggedSection").fadeOut();
            sessionStorage.removeItem('loggedIn');
            loader.hide();
        }, function() {
            console.log("nie dziala");
        });
    });
}

function getStudents() 
{
    user.getAction('api/Users', function() {
        loader.css("display", "flex");
    }, function(data) {
        $.each(data, function (index, student) { 
            $('#students').append('<div class="row">');
            $('#students').append('PESEL: ' + student.Pesel);
            $('#students').append('Imię: ' + student.FirstName);
            $('#students').append('Nazwisko: ' + student.SurName);
            $('#students').append('</div>');
             console.log(student.FirstName);
        });
    }, function(data) {
        
    });
	
}

function loggedIn() {
    // TODO verification of token from API, not from cookies
    if (sessionStorage.getItem('loggedIn')) {
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



	
