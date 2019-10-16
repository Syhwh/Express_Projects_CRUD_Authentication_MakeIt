
const projects = () => {
    fetch('http://localhost:3000/info')
    .then(response => response.json())
    .then(data=>showData(data))

}
const showData = (data) => {  
    data.forEach((element, index) => {
        $('#tableData').append(`<tr>
        <th scope="row">${index+1}</th>
        <td>${element.title}</td>
        <td>${element.description}</td>    
      </tr>`)
    });

}

$(document).ready(() => {
    projects();
})


