
//funcion de inicio de secion 
document.getElementById("botonIniciarSesion").addEventListener('click', function () {
  var usuario = document.getElementById("campoUsuario").value;
  var password = document.getElementById("campoPassword").value;
  var tipo = document.getElementById("campoTipo").value;

  ejecutarPHP(`servicios/login.php?usuario=${usuario}&password=${password}&tipo=${tipo}`,
    function (data) {
      if (data.resultado == "ok") {
        window.location.href = 'home.html?id=' + data.id_usuario;
      } else {
        var alert = `
                <div class="alert alert-danger" role="alert">
                    Usuario/Contraseña incorrecto.
                </div>`
        document.getElementById("contenedorAlertas").innerHTML = alert
      }
    })

});

function ejecutarPHP(url, callback) {
  console.log(url);
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("error! Status:" + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      callback(data);
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
}