

const home =()=> {
    $('#register').hide();
    $('#projects').hide();
    $('#logout').hide();
    $('#login').show(500);
}

home();

$('#goToRegister').on('click', () => {
    $('#login').hide(500);
    $('#register').show(500);
});

$('#goToLogin').on('click', () => {
    $('#login').show(500);
    $('#register').hide(500);
})

const appendProject = (project) => {
    $('#tableData').append(`<tr>
            <th scope='row'>${'#'}</th>
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${project.date}</td>
            <td> <a href='/projects/edit/${project._id}' class='btn btn-warning'>Edit</a></td>
            <td> <a href='/projects/delete/${project._id}' class='btn btn-danger'>delete</a></td>    
          </tr>`);
}

const showErrors = (error) => {
    $(`<span class="alert alert-danger col-12" role="alert">${error}</span>`).insertAfter('#alerts');
    setTimeout(function(){ $('.alert').remove(); }, 3000);
}
const clearErrors = () => {
    $('#name').val('');
    $('#description').val('');
}

const succes=(message)=>{
 $(` <span class="alert alert-success col-12" role="alert"> ${message}</span>`).insertAfter('#alerts');  
  setTimeout(function(){ $('.alert').remove(); }, 2000);
}

const _getProjects = () => {
    $.ajax({
        url: '/projects'
    }).done(projects => {
        $('#tableData').html('')
        projects.forEach(project => appendProject(project));
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
        clearErrors();
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

const _postUserRegister = (name, email, password) => {
    $.ajax({
        method: 'POST',
        url: '/users/register',
        contentType: 'application/json',
        data: JSON.stringify({ userName: name, userEmail: email, userPassword: password })
    }).done(response => {
        succes(response.message)
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

const _postUserLogout=()=>{
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

$('#logout').on('click',()=>{
    _postUserLogout();
    home();
})