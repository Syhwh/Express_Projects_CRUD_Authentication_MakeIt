
$('#register').hide();
$('#projects').hide();

$('#goToRegister').on('click',()=>{
    $('#login').hide(500);
    $('#register').show(500);
});

$('#goToLogin').on('click',()=>{
    $('#login').show(500);
    $('#register').hide(500);
})

const appendProject = (project) => {   
    $('#tableData').append(`<tr>
            <th scope='row'>${'#'}</th>
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${project.date}</td>
            <td> <a href='/edit/${project._id}' class='btn btn-warning'>Edit</a></td>
            <td> <a href='/delete/${project._id}' class='btn btn-danger'>delete</a></td>    
          </tr>`);
}

const showErrors = (error) => {
    $(`<span class='error'>${error.name.message}</span>`).insertAfter('#name');
}
const clearErrors = () => {
    $('#name').val('');
    $('#description').val('');
}

const _getProjects = () => {
    // cargar los proyectos
    $.ajax({
        url: '/projects'
    }).done(projects => {
        $('#tableData').html('')
        projects.forEach(project => appendProject(project));
    }).fail(err => {
        // si es un err.status 401 mostar el formulario de login
        console.log('Error', err)
    });
}


const _postProjects = (name,description) => {
    console.log(`name-> ${name} and description ${description}`);
    $.ajax({
        method: 'POST',
        url: '/projects/add',
        contentType: 'application/json',
        data: JSON.stringify({ projectTitle:name, projectDescription: description })
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

const _postUserRegister = (name, email,password) => {
    $.ajax({
        method: 'POST',
        url: '/users/register',
        contentType: 'application/json',
        data: JSON.stringify({ userName:name, userEmail:email, userPassword:password })
    }).done(project => {
        alert('user created')

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

const _postUserLogin = (email,password) => {
    $.ajax({
        method: 'POST',
        url: '/users/login',
        contentType: 'application/json',
        data: JSON.stringify({ email, password })
    }).done(user => {
        $('#login').hide(500);
        $('#projects').show();
        _getProjects()
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









_getProjects();


//
$('#createProject').on('submit', e => {
    e.preventDefault();
    // limpiar los errores
    $('span.error').remove();
    const name = $('#projectName').val();
    console.log(name)
    const description = $('#projectDescription').val();
    console.log(description);    
    _postProjects(name,description);
    _getProjects();
});


$('#registerUser').on('submit',e=>{
e.preventDefault();
const name=$('#userName').val();
const email=$('#userEmail').val();
const password=$('#userPassword').val();
_postUserRegister(name,email,password);

});

$('#loginUser').on('submit',e=>{
    e.preventDefault();    
    const email=$('#loginUserEmail').val();
    const password=$('#loginUserPassword').val();
    if (_postUserLogin(email,password))
    {
        alert ('User Logged');
    }
    
    })