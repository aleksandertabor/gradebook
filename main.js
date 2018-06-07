// Variables
const loader = $('.bouncing-loader');
const server = 'http://gradebookx.azurewebsites.net/';


class User {

    constructor() {
        this._bearer = "";
        this._email = "";
        this._id = "";
        this._entityId = "";
    }

    get bearer() {
        return this._bearer;
    }

    set bearer(bearer) {
        this._bearer = bearer;
    }

    set email(email) {
        this._email = email;
    }

    set id(id) {
        this._id = id;
    }

    set entityId(entityId) {
        this._entityId = entityId;
    }

    postAction(url, data, beforeSend, onSuccess, onError, isToken) {
        console.log(data);
        $.ajax({
            type: "POST",
            url: server + url,
            data: data,
            beforeSend: function (xhr) {
                if (isToken) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + user._bearer);
                }
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
                'Authorization': 'Bearer ' + user._bearer
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

    // ** Register an new account
    registerAccount() {
    $("#registerForm").submit(function (e) { 
        e.preventDefault();
        user.email = $(".email", this).val();
        var newAccount = {
            Email: $(".email", this).val(),
            Password: $(".password", this).val(),
            ConfirmPassword: $(".password", this).val()
        };
        console.log(newAccount);
        user.postAction('api/Account/Register', newAccount, function() {
            loader.css("display", "flex");
        }, function(data) {
            $(this).find("input").val("");
            console.log("Registered ");
            $('.registerForm_Wrapper').slideToggle();
            if (!user.whetherExist()) {
                $('.registerForm2_Wrapper').slideToggle();
                $('.loginForm_Wrapper').slideToggle();
                $('input.pesel').focus();
            } else {
                $('input.email').focus();
            }
            
            loader.hide();
        }, function(data) {
            console.log("nie dziala");
            if (data.responseJSON.ModelState["model.Password"] != undefined) {
                $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.ModelState["model.Password"]["0"] + '</span>');
            }
            else {
                $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.ModelState[""]["0"] + '</span>');
            }
            $('.registerForm_Wrapper .validation').fadeIn();
            loader.hide();
        }, false);
        
    });
    }

    // ** Register a new user
registerUser() {
    $("#registerForm2").submit(function (e) { 
        e.preventDefault();

            var newUser = {
                EntityId: user._entityId,
                Pesel: $(".pesel", this).val(),
                FirstName: $(".firstname", this).val(),
                SurName: $(".surname", this).val(),
                Email: user._email,
                RoleId: 1
            };
            console.log(newUser);
            user.postAction('api/Users', newUser, function() {
                $('.registerForm2_Wrapper .validation').html('<img src="success.svg" alt="Sukces!"><span class="validation-success"> Twoje konto zostało zarejestrowane. Musisz jeszcze dokończyć rejestrację.</span>');
                $('.registerForm2_Wrapper .validation').fadeIn();
                loader.css("display", "flex");
            }, function(data) {
                $(this).find("input").val("");
                console.log("Drugi etap udany ");
                $('.registerForm2_Wrapper').slideToggle();
                $('.loginForm_Wrapper .validation').html('<img src="success.svg" alt="Sukces!"><span class="validation-success"> Twoje konto jest już gotowe. Możesz się zalogować.</span>');
                $('.loginForm_Wrapper .validation').fadeIn();
                $('.loginForm_Wrapper').slideToggle();
                $('input.email').focus();
                loader.hide();
            }, function(data) {
                console.log("nie dziala");
                loader.hide();
            }, true);
       
        
    });
}

// ** Login user
loginUser() {
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
            user.bearer = data.access_token;
            user.email = data.userName;
            sessionStorage.setItem('loggedIn', user._bearer);
            loggedIn();
            $("#loginForm input.email, #loginForm input.password").val("");
            $('.loginForm_Wrapper .validation').fadeIn();
            loader.hide();
        }, function(data) {
            $('.loginForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.error_description + '</span>');
            $('.loginForm_Wrapper .validation').fadeIn();
            loader.hide();
            console.log("nie dziala");
        }, false);


    });
}

// ** Logout
logout() {
    $(".logout").click(function (e) { 
        e.preventDefault();
        user.postAction('api/Account/Logout', function() {
            loader.css("display", "flex");
        }, function(data) {
            $("#forms").fadeIn();
            $(".logout").fadeOut();
            console.log("Wylogowano ");
            $("#loggedSection").fadeOut();
            sessionStorage.removeItem('loggedIn');
            loader.hide();
        }, function(data) {
            console.log("nie dziala");
        }, true);
    });
}


whetherExist() {

    var logUser ={
        grant_type:'password',
        username: $("#registerForm .email").val(),
        password: $("#registerForm .password").val()
    };
    console.log(logUser);
    user.postAction('token', logUser, function() {
        loader.css("display", "flex");
    }, function(data) {
        user.bearer = data.access_token;
        user.email = data.userName;
        sessionStorage.setItem('loggedIn', user._bearer);
        loader.hide();
        user.getAction('api/Users/WhetherExist', function() {
            loader.css("display", "flex");
        }, function(data) {
            loader.hide();
            return data;
        }, function(data) {
            
        });
        user.getAction('api/Users/EntityId', function() {
            loader.css("display", "flex");
        }, function(data) {
            user.entityId = data;
            console.log(data);
            loader.hide();
        }, function(data) {
            
        });
    }, function(data) {
        loader.hide();
    });

    
}

getUserInfo(callback) {
    user.getAction('api/Users/UserInfo', function() {
        loader.css("display", "flex");
    }, function(data) {
        user.id = data.UserId;
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        $(".email-data a").html(data.Email).attr("href", "mailto:" + data.Email)
        $(".pesel-data").html(data.Pesel);
        $(".rola-data").html(data.RoleName);
        loader.hide();
        callback();
    }, function(data) {
        loader.hide();
    });
}



    
}


var user = new User();



function getContent() 
{
    user.getAction('api/Grades', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Presences', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Roles', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });


    user.getAction('api/EducatorClasses', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });


    user.getAction('api/TeachersClasses', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });


    user.getAction('api/UsersClasses', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Users/WhetherExist', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append("<h1>NOWE FUNKCJE</h1>");
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Subjects', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Classes', function() {
        loader.css("display", "flex");
    }, function(data) {
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        loader.hide();
    }, function(data) {
        
    });

    user.getAction('api/Classes/ClassesByUserId/' + user._id, function() {
        console.log(user._id);
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option value='Wybierz klasę'>Wybierz klasę</option>";
        $.each(data, function (index, classData) { 
            content += "<option value='" + classData.ClassId + "'>" + classData.Name + " - " +  classData.Year + "</option>";
        });
        $('.grades .select-class select').html(content);
        loader.hide();
    }, function(data) {
        loader.hide();
    });

	
}

function getGrades() {
    $('.select-class select').on('change', function() {
        user.getAction('api/Grades/ThisGrades/' + user._id + '/' + this.value, function() {
            loader.css("display", "flex");
        }, function(data) {
            let content = "";
            content += "<h2>Przedmiot</h2>";
            content += "<h2>Oceny</h2>";
            $.each(data, function (index, grade) { 
                 content += "<div class='grade' id='" + grade.GradeId + "'>";
                 content += "<span>" + grade.SubjectName + "</span>";
                 content += "<span>" + grade.ThisGrade + "</span>";
                 content += "<div class='grade-info'>" + grade.TeacherName + " " + grade.Date + " "  + grade.LessonNumber + "</div>";
                 content += "</div>";
            });
            $('.actual-grades').html(content);
            loader.hide();
        }, function(data) {
            loader.hide();
        });
      })
}


function loggedIn() {
        user.getUserInfo(function() {
            getContent();
        });
        console.log("Jesteś zalogowany!");
        $("#forms").fadeOut();
        $(".logout").fadeIn();
        $("#loggedSection").fadeIn();
}


//! Ready start -- INIT

$(document).ready(function()
{


    user.registerAccount();
    user.registerUser();
    user.loginUser();
    user.logout();

    getGrades();

    if (sessionStorage.getItem('loggedIn') ) {
        user.bearer = sessionStorage.getItem('loggedIn');
        loggedIn();
    }

    tabs();

    //TODO need function for this

    $("#printStudents").click(function (e) { 
        e.preventDefault();
        PrintElem();
    });
 


}) //! end ready


// Content
	
function tabs() {
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