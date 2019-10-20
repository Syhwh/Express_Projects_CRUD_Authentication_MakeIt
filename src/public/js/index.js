
const _getProjects = () => {
    $.ajax({
        url: '/projects'
    }).done(response => {
        console.log(response)
        $('#tableData').html('')
        response.projects.forEach((project, index) =>
            appendProject(project, index));

        sideBarData(response.countProjects);
    }).fail(err => {
        console.log('Error', err)
    });
}


const _postProjects = (name, description) => {
    console.log(`name-> ${name} and description ${description}`);
    $.ajax({
        method: 'POST',
        url: '/projects/add',
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle: name, projectDescription: description })
    }).done(project => {
        appendProject(project);
        $('#newProject').show();
        $('#createProject').hide();
        $('#projects').show();
    }).fail(err => {
        if (err.status === 422) {
            const errors = err.responseJSON.errors;
            if (errors.name) {
                showErrors(errors.name);
            }
        } else {
            console.log('Error: ', err);
        }
    });
}


const _getEditProject = (id) => {
    $.ajax({
        url: `/projects/edit/${id}`
    }).done(project => {
        editForm(project);
    }).fail(err => {
        console.log('Error', err)
    });
}

const _patchProject = (id, name, description) => {
    $.ajax({
        method: 'PATCH',
        url: `/projects/edit/${id}`,
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle: name, projectDescription: description })
    }).done(response => {
        succes(response.message);
        $('#editProject').hide();
        $('#projects').show();
        $('#newProject').show();
    }
    ).fail(err => {
        console.log('Error', err);
    });
}

const _deleteProject = (id) => {
    $.ajax({
        method: 'DELETE',
        url: `/projects/delete/${id}`,
    }).done(response => {
        succes(response.message);
    }
    ).fail(err => {
        console.log('Error', err);
    });
}


const _patchStatus = (id, status) => {
    $.ajax({
        method: 'PATCH',
        url: `/projects/edit/status/${id}`,
        contentType: 'application/json',
        data: JSON.stringify({ status })
    }).done(response => {
        sideBarData(response.response.countProjects);

    }
    ).fail(err => {
        console.log('Error', err);
    });
}


////////////////**************USERS*************************\\\\\\\\\\\\\\\\\\\\\\


const _postUserRegister = (name, email, password) => {
    $.ajax({
        method: 'POST',
        url: '/users/register',
        contentType: 'application/json',
        data: JSON.stringify({ userName: name, userEmail: email, userPassword: password })
    }).done(response => {
        succes(response.message);
        $('#register').hide(500);
        $('#login').show();
    }).fail(err => {
        if (err.status === 422) {
            const errors = err.responseJSON.errors;
            if (errors.name) {
                showErrors(errors.name);
            }
        } else {
            console.log('Error: ', err);
        }
    });
}

const _postUserLogin = (email, password) => {
    $.ajax({
        method: 'POST',
        url: '/users/login',
        contentType: 'application/json',
        data: JSON.stringify({ email, password })
    }).done(response => {
        succes(response.message)
        mainHomeDisplay()
        _getProjects()
    }).fail(err => {
        const errors = err.responseJSON.error;
        if (err.status === 422) {
            if (errors.name) {
                showErrors(errors.name);
            }
        } else {
            showErrors(errors);
            console.log('Error: ', errors);
        }
    });
}

const _postUserLogout = () => {
    $.ajax({
        method: 'POST',
        url: '/users/logout'
    }).done(response => {
        succes(response.message)
        homeLogin()
    }).fail(err => console.log(err))
}

//




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\
const homeLogin = () => {
    $('#register').hide();
    $('#projects').hide();
    $('#sidebar').hide();
    $('#logout').hide();
    $('#login').show(500);
}
const mainHomeDisplay = () => {
    $('#login').hide();
    $('#logout').show(100);
    $('#newProject').show();
    $('#projects').show();
    $('#sidebar').show();
}

$('#goToRegister').on('click', () => {
    $('#login').hide(500);
    $('#register').show(500);
});

$('#goToLogin').on('click', () => {
    $('#login').show(500);
    $('#register').hide(500);
});

const appendProject = (project, index) => {
    $('#tableData').append(`<tr id=${project._id}>
            <th scope='row'>${index + 1}</th>
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${moment(project.date).format("DD/ MM / YYYY")}</td>
            <td><select id='statusSelect'>            
            <option id='optNotStarted' value="Not Started"  ${project.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
            <option id='optInProgess'  value="In Progress"  ${project.status === 'In progress' ? 'selected' : ''} >In Progress</option>
            <option id='optDone'       value="Done"         ${project.status === 'Done' ? 'selected' : ''}>Done</option>
          </select></td>
            <td class='projectActions'>
            <a href='#' class='btn btn-success btn-sm detailsProject'><i class="fas fa-file-alt"></i></a>
            <a href='#' class='btn btn-warning btn-sm editProject'><i class="fas fa-edit"></i></a>
            <a href='#' class='btn btn-danger btn-sm deleteProject'><i class="fas fa-trash-alt"></i></a>
            </td>
          </tr>`);


}

const sideBarData = (totalProjects) => {
    $('#sbUserName').text(totalProjects.user)
    $('#sbTotalProjects').text(totalProjects.total);
    $('#sbNotStarted').text(totalProjects.notStarted);
    $('#sbInProgress').text(totalProjects.inProgress);
    $('#sbDone').text(totalProjects.done);
}

const editForm = (data) => {
    $('#editProjectName').val(data.title);
    $('#editProjectDescription').val(data.description);
    $('.editButton').attr('id', `${data._id}`);

}
const showErrors = (error) => {
    $(`<span class="alert alert-danger col-12" role="alert">${error}</span>`).insertAfter('#alerts');
    setTimeout(function () { $('.alert').remove(); }, 3000);
}
const clearErrors = () => {
    $('#name').val('');
    $('#description').val('');
}

const succes = (message) => {
    $(` <span class="alert alert-success col-12" role="alert"> ${message}</span>`).insertAfter('#alerts');
    setTimeout(function () { $('.alert').remove(); }, 2000);
}




$('#registerUser').on('submit', e => {
    e.preventDefault();
    const name = $('#userName').val();
    const email = $('#userEmail').val();
    const password = $('#userPassword').val();
    _postUserRegister(name, email, password);

});

$('#loginUser').on('submit', e => {
    e.preventDefault();
    const email = $('#loginUserEmail').val();
    const password = $('#loginUserPassword').val();
    _postUserLogin(email, password);
    $('#loginUserEmail').val('');
    $('#loginUserPassword').val('');
})

$('#createProject').on('submit', e => {
    e.preventDefault();
    // limpiar los errores
    const name = $('#projectName').val();
    const description = $('#projectDescription').val();
    _postProjects(name, description);
    _getProjects();
    $('#projectName').val('');
    $('#projectDescription').val('');

});

$('#logout').on('click', () => {
    _postUserLogout();
    homeLogin();
});

$('#tableData').on('click', '.editProject', (e) => {
    const id = $(e.currentTarget).parent().parent().attr('id');
    $('#projects').hide(50);
    $('#editProject').show(100);
    _getEditProject(id)
});

$('#editProject').on('click', '.editButton', e => {
    e.preventDefault();
    const id = $(e.currentTarget).attr('id');
    const name = $('#editProjectName').val();
    const description = $('#editProjectDescription').val();
    _patchProject(id, name, description);
    _getProjects();
    $('#editProjectName').val('');
    $('#editProjectDescription').val('');
});

$('#editProject').on('click', '#cancelEdit', e => {
    $('#projects').show(50);
    $('#editProject').hide();
});

$('#createProject').on('click', '#cancelCreate', e => {
    $('#projects').show(50);
    $('#newProject').show();
    $('#createProject').hide();
})

$('#tableData').on('click', '.deleteProject', (e) => {
    const id = $(e.currentTarget).parent().parent().attr('id');
    $('.deleteProject').attr('id', id)
    $("#deleteProjectModal").modal('show');

    // 
});

$('.deleteProject').on('click', () => {
    const id = $('.deleteProject').attr('id')
    _deleteProject(id);
    _getProjects();
    $("#deleteProjectModal").modal('hide');
})

$('#newProject').on('click', () => {
    $('#projects').hide(50);
    $('#createProject').show();
    $('#newProject').hide();

});

$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

$('#tableData').on('change', 'select', (e) => {
    const status = $(e.currentTarget).val();
    const id = $(e.currentTarget).parent().parent().attr('id');
    _patchStatus(id, status);

});

$('#datePicker').daterangepicker({},
    function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
$('#editDatePicker').daterangepicker({},
    function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });

// $('#picker').daterangepicker({
//     singleDatePicker:true,
//     showDropdowns:true,
//     opens:'right',
//     drops:'down'
// })

///Search project
$("#searchProjectInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableProjects tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});