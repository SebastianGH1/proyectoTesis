document.addEventListener('DOMContentLoaded', function() {
  var botonIniciarSesion = document.getElementById("botonIniciarSesion");
  var campoUsuario = document.getElementById("campoUsuario");
  var campoPassword = document.getElementById("campoPassword");
  var campoTipo = document.getElementById("campoTipo");
  var contenedorAlertas = document.getElementById("contenedorAlertas");

  if (botonIniciarSesion && campoUsuario && campoPassword && campoTipo && contenedorAlertas) {
      botonIniciarSesion.addEventListener('click', function() {
          var usuario = campoUsuario.value;
          var password = campoPassword.value;
          var tipo = campoTipo.value;

          ejecutarPHP(`servicios/login.php?usuario=${usuario}&password=${password}&tipo=${tipo}`, function(data) {
              if (data.resultado == "ok") {
                  window.location.href = 'home.html?id=' + data.id_usuario;
              } else {
                  var alert = `
                      <div class="alert alert-danger" role="alert">
                          Usuario/Contraseña incorrecto.
                      </div>`;
                  contenedorAlertas.innerHTML = alert;
              }
          });
      });
  } else {
      console.error('Uno o más elementos no fueron encontrados en el DOM.');
  }
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
