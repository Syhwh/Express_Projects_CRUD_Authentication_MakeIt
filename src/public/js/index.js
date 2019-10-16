

const projects = () => {
    return fetch('http://localhost:3000/info')
        .then(response => response.json())
        

}


window.onload = function () {
    const data = projects();
    console.log('Projects on the client side' + data);
};

