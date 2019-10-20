
const home = () => {
    $('#register').hide();
    $('#projects').hide();
    $('#logout').hide();
    $('#login').show(500);
}

$('#goToRegister').on('click', () => {
    $('#login').hide(500);
    $('#register').show(500);
});

$('#goToLogin').on('click', () => {
    $('#login').show(500);
    $('#register').hide(500);
})

const appendProject = (project) => {
    $('#tableData').append(`<tr id=${project._id}>
            <th scope='row'>${'#'}</th>
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${project.date}</td>
            <td><select>
            <option value="Not Started">Not Started</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </select></td>
            <td><a href='#' class='btn btn-warning editProject'>Edit</a>
            <a href='#' class='btn btn-danger deleteProject'>delete</a></td>
          </tr>`);
}
const sideBarData = (totalProjects) => {
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


const _getProjects = () => {
    $.ajax({
        url: '/projects'
    }).done(response => {
        console.log(response)
        $('#tableData').html('')
        response.projects.forEach(project =>
            appendProject(project));
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
       // console.log(response)
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
        $('#login').hide();
        $('#logout').show(100);
        $('#newProject').show();
        $('#projects').show();

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
    }).fail(err => console.log(err))
}

//



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
    home();
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

})