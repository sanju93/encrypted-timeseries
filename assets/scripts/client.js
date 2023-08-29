var socket = io('http://localhost:8000');

let div = document.getElementById("container");


let encrypt;

socket.on("send",message => {
 
    socket.emit("send_back",{encrypt : message.encrypt});
})

socket.on("data",message => {

    let child = document.createElement('div');
    let name = document.createElement('p');
    name.innerHTML ="Name:" +  message.name;
    let city = document.createElement('p');
    city.innerHTML = "City:"+ message.city;
    let secret_key = document.createElement('p');
    secret_key.innerHTML = "Secret_Hash:"+ message.secret_key;

    child.appendChild(name);
    child.appendChild(city);
    child.appendChild(secret_key);
    div.appendChild(child);

    console.log(message);
})




