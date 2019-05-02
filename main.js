// Variables
const loader = $('.bouncing-loader');
const server = 'https://prodziennik.azurewebsites.net/';

class User {

    constructor() {
        this._bearer = "";
        this._email = "";
        this._id = "";
        this._entityId = "";
        this._exist = 0;
        this._role = "";
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

    set exist(exist) {
        this._exist = exist;
    }

    set role(role) {
        this._role = role;
    }

    postAction(url, data, beforeSend, onSuccess, onError, isToken) {
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

    deleteAction(url, beforeSend, onSuccess, onError) {
        $.ajax({
            type: "DELETE",
            url: server + url,
            headers: {
                'Authorization': 'Bearer ' + user._bearer
            },
            beforeSend: function (xhr) {

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
        user.postAction('api/Account/Register', newAccount, function() {
            loader.css("display", "flex");
        }, function(data) {

            var logUser ={
                grant_type:'password',
                username: user._email,
                password: $(".password", this).val()
            };

            user.postAction('token', logUser, function() {
            }, function(data) {
                $('.registerForm2_Wrapper').slideToggle();
                $('.loginForm_Wrapper').slideToggle();
                $('.registerForm_Wrapper').slideToggle();
                $('.registerForm_Wrapper .validation').html('');
                //$('.registerForm_Wrapper').slideToggle();
                $('input.pesel').focus();
                user.bearer = data.access_token;
                user.email = data.userName;
                sessionStorage.setItem('loggedIn', user._bearer);
                user.getEntity();
            }, function() {}, false);

            $(this).find("input").val("");
            
            loader.hide();
        }, function(data) {
            if (data.responseJSON.ModelState) {
                if (data.responseJSON.ModelState["model.Password"] != undefined) {
                    $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.ModelState["model.Password"]["0"] + '</span>');
                }
                else {
                    $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.ModelState["model.Email"]["0"] + '</span>');
                }
            } else {
                $('.registerForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">Wystąpił błąd. Adres e-mail jest zajęty lub hasło jest niepoprawne (minimum 6 znaków, duża litera, liczba, znak specjalny).</span>');
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
                Email: user._email
            };
            user.postAction('api/Users', newUser, function() {
                $('.registerForm2_Wrapper .validation').html('<img src="success.svg" alt="Sukces!"><span class="validation-success"> Twoje konto zostało zarejestrowane. Możesz się zalogować.</span>');
                $('.registerForm2_Wrapper .validation').fadeIn();
                loader.css("display", "flex");
            }, function(data) {
                $(this).find("input").val("");
                $('progress').val(100);
                $('.registerForm2_Wrapper').slideToggle();
                $('.loginForm_Wrapper .validation').html('<img src="success.svg" alt="Sukces!"><span class="validation-success"> Twoje konto jest już gotowe. Możesz się zalogować.</span>');
                $('.loginForm_Wrapper .validation').fadeIn();
                $('.loginForm_Wrapper').slideToggle();
                $('input.email').focus();
                loader.hide();
            }, function(data) {
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
        
        user.postAction('token', logUser, function() {
            loader.css("display", "flex");
        }, function(data) {
            user.bearer = data.access_token;
            user.email = data.userName;
            sessionStorage.setItem('loggedIn', user._bearer);
            //user.whetherExist();
            // if (user._exist == 0) {
            //     console.log("zle");
            //     $('.registerForm2_Wrapper').slideToggle();
            //     $('.loginForm_Wrapper').slideToggle();
            //     $('.registerForm_Wrapper').slideToggle();
            //     $('input.pesel').focus();
            // } else {
                $('input.email').focus();
                loggedIn();
                $("#loginForm input.email, #loginForm input.password").val("");
                $('.loginForm_Wrapper .validation').fadeIn();
            //}
            loader.hide();
        }, function(data) {
            $('.loginForm_Wrapper .validation').html('<img src="error.svg" alt="Błąd!"><span class="validation-error">' + data.responseJSON.error_description + '</span>');
            $('.loginForm_Wrapper .validation').fadeIn();
            loader.hide();
        }, false);


    });
}

whetherExist() {
    user.getAction('api/Users/WhetherExist', function() {
        loader.css("display", "flex");
    }, function(data) {
        user.exist = data;
        if (!user._exist) {
            $('.forms').slideToggle();
            $('.registerForm2_Wrapper').slideToggle();
        }
        loader.hide();
    }, function(data) {
    });    
}

// ** Logout
logout() {
    $(".logout").click(function (e) { 
        e.preventDefault();
        user.postAction('api/Account/Logout', function() {
            loader.css("display", "flex");
        }, function(data) {
            sessionStorage.removeItem('loggedIn');
            $("#forms").fadeIn();
            $(".logout").fadeOut();
            $(".admin").hide();
            $("#loggedSection").fadeOut();
            $('.loginForm_Wrapper .validation').hide();
            loader.hide();
        }, function(data) {

        }, true);
    });
}


getEntity() {

    user.getAction('api/Users/EntityId', function() {
        loader.css("display", "flex");
    }, function(data) {
        user.entityId = data;
        loader.hide();
    }, function(data) {
        
    });

    // user.getAction('api/Users/WhetherExist', function() {
    //     loader.css("display", "flex");
    // }, function(data) {
    //     user.exist = data;
    //     loader.hide();
        
    // }, function(data) {
    //     console.log("blad whether");
    // });    

}

getUserInfo(callback) {
    user.getAction('api/Users/UserInfo', function() {
        loader.css("display", "flex");
    }, function(data) {
        user.id = data.UserId;
        user.email = data.Email;
        user.role = data.RoleName;
        $('#students').append('<pre>' + JSON.stringify(data) + '</pre>' );
        $(".email-data a").html(data.Email).attr("href", "mailto:" + data.Email)
        $(".pesel-data").html(data.Pesel);
        $(".rola-data").html(data.RoleName);
        $(".name-data").html(data.FirstName);
        $(".surname-data").html(data.SurName);
        loader.hide();
        typeof callback == 'function' && callback();
    }, function(data) {
        loader.hide();
    });
}



    
}

var user = new User();


function getContent() 
{

    if (user._role == "Admin") {
        $(".admin").show();
        $(".student").hide();
        $(".teacher").hide();
        $(".actual-grades").empty();
        adminPanel();
    }

    if (user._role == "Teacher") {
        $(".actual-grades").empty();
        $(".student").hide();
        $(".teacher").show();
    }

    if (user._role == "Student") {
        $(".actual-grades").empty();
        $(".student").show();
        $(".teacher").hide();
    }

    user.getAction('api/Classes/ClassesByUserId/' + user._id, function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz klasę'>Wybierz klasę</option>";
        $.each(data, function (index, classData) { 
            content += "<option value='" + classData.ClassId + "'>" + classData.Name + " - " +  classData.Year + "</option>";
        });
        $('.grades .select-class select').html(content);
        loader.hide();
    }, function(data) {
        loader.hide();
    });

    getClasses();
    getClasses2();

    getUsers();

    getTeachers();

    getStudents();

    getAllSubjects();
	
}




function getGrades() {
    $('.select-class select').on('change', function() {
        user.getAction('api/Grades/ThisGrades/' + user._id + '/' + this.value, function() {
            loader.css("display", "flex");
        }, function(data) {
            // console.log(data);
            // let content = "";
            // content += "<h2>Przedmiot</h2>";
            // content += "<h2>Oceny cząstkowe</h2>";
            // content += "<h2>Średnia ocen</h2>";
            // let subject = "";
            // let subjects = [];
            // $.each(data, function (index, grade) { 
            //     if ( subjects.indexOf(grade.SubjectId) == -1 ) {
            //         subjects.push(grade.SubjectId);
            //     }
                 
            // });

            // console.log(subjects);

            // $.each(data, function (index, grade) { 
            //    // if ( subjects.includes() ) {
            //         content += "<div class='subject'>";
            //         content += "<span>" + grade.SubjectName + "</span>";
            //         $.each(data, function (index, grade2) { 
            //            // if ( subjects.indexOf(grade2.SubjectId) != -1 ) {
            //                 content += "<div class='grade' id='" + grade2.GradeId + "'>";
            //                 content += "<span grade='" + grade2.ThisGrade + "'>" + grade2.ThisGrade + "</span>";
            //                 content += "<div class='grade-info'> Nauczyciel: " + grade2.TeacherName + " Data dodania: " + grade.Date + " Lekcja: "  + grade.LessonNumber + "</div>";
            //                 content += "</div>";
            //           //  }
            //         });
            //         content += "<span class='average' subjectId='" +  grade.SubjectId + "'>" + + "</span>";
            //         getAverage($('.select-class select').val(), grade.SubjectId, 1);
            //         content += "</div>";
            //  //   }
                 
            // });

            let content = "";
            content += "<h2>Przedmiot</h2>";
            content += "<h2>Oceny cząstkowe: </h2>";
          //  content += "<h2>Średnia ocen</h2>";
            let subject = "";
            $.each(data, function (index, grade) { 
                if (subject != grade.SubjectName) {
                    subject = grade.SubjectName;
                    content += "<div class='subject'>";
                    content += "<span>" + grade.SubjectName + "</span>";
                    $.each(data, function (index, grade) { 
                        if (subject == grade.SubjectName) {
                            content += "<div class='grade' id='" + grade.GradeId + "'>";
                            content += "<span grade='" + grade.ThisGrade + "'>" + grade.ThisGrade + "</span>";
                            content += "<div class='grade-info'> Nauczyciel: " + grade.TeacherName + " <br> Data dodania: " + grade.Date + " <br> Nr lekcji: "  + grade.LessonNumber + "</div>";
                            content += "</div>";
                        }
                    });
                    getAverage($('.select-class select').val(), grade.SubjectId, 1);
                   // content += "<span class='average' subjectId='" +  grade.SubjectId + "'>" + + "</span>";
                    content += "</div>";
                }
                 
            });

            $('.actual-grades').html(content);
            loader.hide();
        }, function(data) {
            loader.hide();
        });
      })
}

function getAverage(classId, subjectId, numberOfSemester) {
    user.getAction('api/UsersClasses/Average/' + classId + '/' + subjectId + '/' + numberOfSemester, function() {
        loader.css("display", "flex");
    }, function(data) {
        $(".average").last().html(data);
        loader.hide();
    }, function(data) {
        loader.hide();
    });
}


function getUsers() {
        user.getAction('api/Users', function() {
            loader.css("display", "flex");
        }, function(data) {
            let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz użytkownika'>Wybierz użytkownika</option>";
        $.each(data, function (index, userData) { 
            content += "<option value='" + userData.Id + "'>" + userData.FirstName + " " +  userData.SurName + " - " + userData.Email + "</option>";
        });
        $('#users').html(content);
            loader.hide();
        }, function(data) {
            loader.hide();
        });
}


function changeRole() {
    $("#roleForm").submit(function (e) { 
        e.preventDefault();
        var userId = $("#users", this).val();
        var role = $("#roles", this).val();
            user.getAction('api/Users/ChangeRole/' + userId + '/' + role, function() {
                loader.css("display", "flex");
            }, function(data) {
                loader.hide();
            }, function(data) {
                loader.hide();
            }, true);
       
        
    });
}

function changeClass() {
    

    $("#teacherForm").submit(function (e) { 
        e.preventDefault();
        var change = {
            teacherId: $("#teachers", this).val(),
            ClassId: $("#classes1", this).val(),
            SubjectId: $("#subjects", this).val(),
        };
            user.postAction('api/TeachersClasses/', change, function() {
                loader.css("display", "flex");
            }, function(data) {
                loader.hide();
            }, function(data) {
                loader.hide();
            }, true);
       
        
    });
}

function changeClass2() {
    

    $("#studentForm").submit(function (e) { 
        e.preventDefault();
        var change = {
            UserId: $("#students", this).val(),
            ClassId: $("#classes2", this).val(),
        };
            user.postAction('api/UsersClasses/', change, function() {
                loader.css("display", "flex");
            }, function(data) {
                console.log(data);
                console.log("Zmienione klase ucznia ");
                loader.hide();
            }, function(data) {
                console.log("nie dziala");
                console.log(data);
                loader.hide();
            }, true);
       
        
    });
}



function getTeacherSubjects() {
    $('.select-class-teacher select').on('change', function() {
        var classId = $(".select-class-teacher select").val();
            user.getAction('api/TeachersClasses/TeachersClass4/' + classId + '/' + user._id, function() {
                loader.css("display", "flex");
            }, function(data) {
                let content = "";
                content += "<option selected='true' disabled='disabled' value='Wybierz przedmiot'>Wybierz przedmiot</option>";
                $.each(data, function (index, subjectData) { 
                    content += "<option value='" + subjectData.SubjectName + "'>" + subjectData.SubjectName + "</option>";
                });
                $('.grades .select-teacher-subjects select').html(content);
                loader.hide();
            }, function(data) {
                loader.hide();
            }, true);
       
        
    });
}

function getUsersByClass(refresh) {
    if (refresh) {
        $( ".actual-grades" ).html('');
        let classId = $(".select-class-teacher select").val();
                user.getAction('api/UsersClasses/UsersClassByClassId/' + classId, function() {
                    loader.css("display", "flex");
                }, function(data) {
                    let content = "";
                    content += "<ul>";
                    $.each(data, function (index, studentData) { 
                        content += "<div id='thisGrades" + studentData.UserId + "' class='thisGrades'><li>" + studentData.UserFirstName + "</li></div>";
                        let classId = $(".select-class-teacher select").val();
                        getGradesByUser(studentData.UserId, classId);
                        content += "<input type='hidden' class='userId' value='" + studentData.UserId + "'/>"
                    });
                    content += "</ul>";
                    $('.grades .select-class-user').html(content);
                    loader.hide();
                }, function(data) {
                    loader.hide();
                }, true);
    
    } else {
        $('.select-teacher-subjects select').on('change', function() {
            $( ".actual-grades" ).html('');
            let classId = $(".select-class-teacher select").val();
                user.getAction('api/UsersClasses/UsersClassByClassId/' + classId, function() {
                    loader.css("display", "flex");
                }, function(data) {
                    let content = "";
                    content += "<ul>";
                    $.each(data, function (index, studentData) { 
                        content += "<div id='thisGrades" + studentData.UserId + "' class='thisGrades'><li>" + studentData.UserFirstName + "</li></div>";
                        let classId = $(".select-class-teacher select").val();
                        getGradesByUser(studentData.UserId, classId);
                        content += "<input type='hidden' class='userId' value='" + studentData.UserId + "'/>"
                    });
                    content += "</ul>";
                    $('.grades .select-class-user').html(content);
                    loader.hide();
                }, function(data) {
                    loader.hide();
                }, true);
           
            
        });
    }
    
}

function getGradesByUser(userId, classId) {
            user.getAction('api/Grades/ThisGrades/' + userId + '/' + classId, function() {
                loader.css("display", "flex");
            }, function(data) {
                console.log(data);
                let subjectName = $(".select-teacher-subjects select").val();
                let content = "";
                content += "<h2>Oceny cząstkowe</h2>";
                        $.each(data, function (index, grade) { 
                            if (subjectName == grade.SubjectName) {
                                content += "<div class='grade' id='" + grade.GradeId + "'>";
                                content += "<span grade='" + grade.ThisGrade + "'><a href='#' class='deleteGrade' grade='" + grade.GradeId + "'>" + grade.ThisGrade + "</a></span>";
                                content += "<div class='grade-info'> Nauczyciel: " + grade.TeacherName + " <br> Data dodania: " + grade.Date + " <br> Nr lekcji: "  + grade.LessonNumber + "</div>";
                                content += "</div>";
                            }
                        });
                content += "<form action='#' class='addGrades' method='post' id='addGrades" + userId + "'><p>Wybierz ocenę: </p><label><input type='radio' name='grade' class='currentGrade' value='1'>1</label>";
                content += "<label><input type='radio' name='grade' class='currentGrade' value='2'>2</label>";
                content += "<label><input type='radio' name='grade' class='currentGrade' value='3'>3</label>";
                content += "<label><input type='radio' name='grade' class='currentGrade' value='4'>4</label>";
                content += "<label><input type='radio' name='grade' class='currentGrade' value='5'>5</label>";
                content += "<p>Wybierz nr lekcji: </p><label><input type='radio' name='lesson' class='currentLesson' value='1'>1</label>";
                content += "<label><input type='radio' name='lesson' class='currentLesson' value='2'>2</label>";
                content += "<label><input type='radio' name='lesson' class='currentLesson' value='3'>3</label>";
                content += "<label><input type='radio' name='lesson' class='currentLesson' value='4'>4</label>";
                content += "<label><input type='radio' name='lesson' class='currentLesson' value='5'>5</label>";
                content += "<label><input type='radio' name='lesson' class='currentLesson' value='6'>6</label>";
                content += "<input type='submit' value='Dodaj ocenę'><input type='hidden' class='userClassId' value='' />";
                content += "<input type='hidden' class='subjectId' value=''/>";
                content += "</form>";
                $( "#thisGrades" + userId ).append( content );
                //$('.grades .actual-grades').html(content);
                let UsersId = userId;
                let ClassId = classId;
                getSubjects(subjectName);
                getUserClassId(UsersId, ClassId, userId);
                modal();
                addGrades(userId);
                loader.hide();
            }, function(data) {
                console.log("nie dziala");
                console.log(data);
                loader.hide();
            }, true);

}


function deleteGrades(gradeId) {
    console.log("ocenka: " + gradeId);
            user.deleteAction('api/Grades?id=' + gradeId, function() {
                loader.css("display", "flex");
            }, function(data) {
                console.log(data);
                let refresh = true;
                getUsersByClass(refresh);
                loader.hide();
            }, function(data) {
                console.log("nie dziala");
                console.log(data);
                let refresh = true;
                getUsersByClass(refresh);
                loader.hide();
            }, true);
}

function getUserClassId(userId, classId, form) {
    user.getAction('api/UsersClasses/UsersClassIdByUserIdAndClassId/' + userId + "/" + classId, function() {
        loader.css("display", "flex");
    }, function(data) {
        $("#addGrades" + form + " .userClassId").val(data);
        loader.hide();
    }, function(data) {
        loader.hide();
    }, true);
}

function getSubjects(subjectName) {
    var sName = subjectName;
    user.getAction('api/Subjects', function() {
        loader.css("display", "flex");
    }, function(data) {
        $.each(data, function (index, subject) { 
            if (sName == subject.Name) {
                $('.subjectId').val(subject.Id);
            }
        });
        loader.hide();
    }, function(data) {
        console.log("nie dziala");
        console.log(data);
        loader.hide();
    }, true);
}

function getAllSubjects(subjectName) {
    user.getAction('api/Subjects', function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz przedmiot'>Wybierz przedmiot</option>";
        $.each(data, function (index, subject) { 
            content += "<option value='" + subject.Id + "'>" + subject.Name + "</option>";
        });
        $('#subjects').html(content);
        loader.hide();
    }, function(data) {
        loader.hide();
    }, true);
}

function addGrades(form) {
    $("#addGrades" + form).bind('submit', function(e) { 
        e.preventDefault();
        //$('input[name=radioName]:checked', '#myForm').val()
        var grade = {
            UserClassId: $(".userClassId").val(),
            ClassId: $(".select-class-teacher select").val(),
            SubjectId: $(".subjectId").val(),
            TeacherId: user._id,
            ThisGrade: $('input[name=grade]:checked', this).val(),
            LessonNumber: $('input[name=lesson]:checked', this).val(),
        };
        console.log(grade);
        user.postAction('api/Grades', grade, function() {
            loader.css("display", "flex");
        }, function(data) {
            let refresh = true;
            console.log("dwa razy");
            getUsersByClass(refresh);
            loader.hide();
        }, function(data) {
            //let refresh = true;
           // getUsersByClass(refresh);
            loader.hide();
        }, true);
    });
}

function getTeachers() {
    user.getAction('api/Users/AllUsersByRole?roleName=' + 'Teacher', function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz nauczyciela'>Wybierz nauczyciela</option>";
        $.each(data, function (index, teacher) { 
            content += "<option value='" + teacher.UserId + "'>" + teacher.FirstName + " " +  teacher.SurName + " - " + teacher.Email + "</option>";
        });
        $('#teachers').html(content);
        loader.hide();
    }, function(data) {
        loader.hide();
    }, true);
}

function getStudents() {
    user.getAction('api/Users/AllUsersByRole?roleName=' + 'Student', function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz nauczyciela'>Wybierz studenta</option>";
        $.each(data, function (index, student) { 
            content += "<option value='" + student.UserId + "'>" + student.FirstName + " " +  student.SurName + " - " + student.Email + "</option>";
        });
        $('#students').html(content);
        loader.hide();
    }, function(data) {
        loader.hide();
    }, true);
}

function getClasses2() {
    user.getAction('api/Classes/', function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz klasę'>Wybierz klasę</option>";
        $.each(data, function (index, classData) { 
            content += "<option value='" + classData.Id + "'>" + classData.Name + " - " +  classData.Year + "</option>";
        });
        $('#classes1').html(content);
        $('#classes2').html(content);
        loader.hide();
    }, function(data) {
        
    });
}

function getClasses() {
    user.getAction('api/TeachersClasses/TeachersClassReturnClass/' + user._id, function() {
        loader.css("display", "flex");
    }, function(data) {
        let content = "";
        content += "<option selected='true' disabled='disabled' value='Wybierz klasę'>Wybierz klasę</option>";
        $.each(data, function (index, classData) { 
            content += "<option value='" + classData.Id + "'>" + classData.Name + " - " +  classData.Year + "</option>";
        });
        $('.grades .select-class-teacher select').html(content);
        loader.hide();
    }, function(data) {
        
    });
}

function loggedIn() {
    // console.log("to jest to: " + user._exist);
    // if (user._exist == 0) {
    //     console.log("Jesteś niezalogowany!");
    //     user.getUserInfo( () => {
    //         user.getAction('api/Users/EntityId', function() {
    //             loader.css("display", "flex");
    //         }, function(data) {
    //             user.entityId = data;
    //             console.log(data);
    //             loader.hide();
    //         }, function(data) {
                
    //         });
    //     });
    //     $('.registerForm2_Wrapper').slideToggle();
    //     $('.loginForm_Wrapper').slideToggle();
    //     $('.registerForm_Wrapper').slideToggle();
    //     $('input.pesel').focus();
    // } else { 
            console.log("Jesteś zalogowany!");
        user.getUserInfo( () => {
            getContent();
        });        
        $("#forms").fadeOut();
        $(".logout").fadeIn();
        $("#loggedSection").show(500, () => $("body").fadeIn());
        
        
   //}

        
}

function modal() {
        // Get the modal
    var modal = jQuery("#myModal");
    var modaljs = document.getElementById('myModal');

    var btn = jQuery(".grade");

    var span = jQuery(".close");

    var cancel = jQuery("#cancel");

    var accept = jQuery("#accept");


    jQuery(btn).click(function (e) { 
        e.preventDefault();
        var grade = jQuery("span a", this).attr( "grade" );

    console.log( "test" + grade);

    jQuery("#gradeId").attr( "value", grade);
        modal.show();
    });

    jQuery(span).click(function (e) { 
        e.preventDefault();
        modal.hide();
    });

    jQuery(cancel).click(function (e) {
        modal.hide();
    });

    jQuery(accept).click(function (e) {
        var gradeId =  jQuery("#gradeId").val();
        deleteGrades(gradeId);
        modal.hide();
    });

    window.onclick = function(event) {
        if (event.target == modaljs) {
            modaljs.style.display = "none";
        }
    }
}

function adminPanel() {
    var modal = jQuery("#admin-panel");
    var modaljs = document.getElementById('admin-panel');

    var btn = $('.admin');

    var span = jQuery(".close");

    var cancel = jQuery("#cancel");

    var accept = jQuery("#accept");


    jQuery(btn).click(function (e) { 
        e.preventDefault();
        modal.fadeIn();
    });

    jQuery(span).click(function (e) { 
        e.preventDefault();
        modal.fadeOut();
    });

    window.onclick = function(event) {
        if (event.target == modaljs) {
            modaljs.style.display = "none";
        }
    }
}


//! Ready start -- INIT

$(document).ready(function()
{


    user.registerAccount();
    user.registerUser();
    user.loginUser();
    user.logout();

    changeRole();

    changeClass();

    changeClass2();

    getGrades();

    getUsersByClass();

    getTeacherSubjects();

    modal();


    if (sessionStorage.getItem('loggedIn') ) {
        user.bearer = sessionStorage.getItem('loggedIn');
        //user.whetherExist();        
        loggedIn();
    } else {
        $("body").fadeIn();
    }

    tabs();

    //TODO need function for this

    $("#printStudents").click(function (e) { 
        e.preventDefault();
        PrintElem();
    });

    

 

    //!TODO VIEWS FOR EVERY ROLE!

    //TODO AFTER 1 HOUR USE RELOGIN INFO

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

