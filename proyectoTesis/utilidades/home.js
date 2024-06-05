const ALUMNO = 1;
const MAESTRO = 0;
function obtenerParametroId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

//Obetner los datos del usuario mediante su id
const id = obtenerParametroId()
ejecutarPHP(`servicios/obtenerDatosUsuario.php?id=${id}`, function (data) {
    if (data.resultado === "ok") {
        document.getElementById("labelNombre")
            .textContent = data.datos.nombre + " " + data.datos.apellidos;

        if (parseInt(data.datos.tipo) === ALUMNO) {
            obtenerCalificaciones(id, ALUMNO)
        } else if (parseInt(data.datos.tipo) === MAESTRO) {
            obtenerAlumnos()
        }
    }
});

function obtenerCalificaciones(_id, _tipo) {
    //Aqui se llenan las calificaciones
    ejecutarPHP(`servicios/obtenerCalificaciones.php?id=${_id}`, function (data) {
        if (data.resultado == 'ok' && data.kardex && data.kardex.length > 0) {
            var contenedorKardex = document.getElementById("contenedorKardex")
            var filas = ""
            JSON.parse(data.kardex).forEach(function (elemento) {
                var fila = `
                <tr>
                    <th scope="row">${elemento.materia}</td>
                    <td>
                        <input class="form-control txtCalificacion" type="text" value="${elemento.calificacion}" aria-label="${elemento.materia}" disabled>
                    </td>
                </tr>`;
                filas += fila;
            });
            console.log(_tipo)
            var tabla = ``;
            if(_tipo === MAESTRO){
                tabla = `
                <div class="container text-center">
                    <div class="row align-items-center">
                      <div class="col text-start">
                        <h5 class="m-3"><strong>Kardex</strong></h5>
                      </div>
                      <div class="col">
                        <button type="button" class="btn btn-outline-warning btn-sm px-5" id="botonEditar">Editar</button>
                      </div>
                    </div>
                  </div>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="">
                            <th scope="col">Materia</th>
                            <th scope="col">Calificacion </th>
                        </tr>
                    </thead>
                    <tbody id="contenedorCalificaciones">
                    ${filas}
                    </tbody>
                </table>
                <button type="button" class="btn btn-outline-success btn-sm px-5" id="botonGuardar">Guardar Cambios</button>
                `;
            }else if(_tipo === ALUMNO){
                tabla = `
                <div class="container text-center">
                    <div class="row align-items-center">
                      <div class="col text-start">
                        <h5 class="m-3"><strong>Kardex</strong></h5>
                      </div>
                    </div>
                  </div>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="">
                            <th scope="col">Materia</th>
                            <th scope="col">Calificacion </th>
                        </tr>
                    </thead>
                    <tbody id="contenedorCalificaciones">
                    ${filas}
                    </tbody>
                </table>
                `;
            }

            contenedorKardex.innerHTML = tabla;


            if(_tipo === MAESTRO){
                document.getElementById('botonEditar').addEventListener('click', function() {
                    console.log("editar")
                    var inputs = document.getElementsByClassName('txtCalificacion')
                    for (let i = 0; i < inputs.length; i++) {
                        const txt = inputs[i];
                        txt.disabled = false
                    }
                    
                })
    
                document.getElementById('botonGuardar').addEventListener('click', function() {
                    var inputs = document.getElementsByClassName('txtCalificacion')
                    for (let i = 0; i < inputs.length; i++) {
                        const txt = inputs[i];
                        txt.disabled = true
                    }
                    
                    guardarCalificaciones(_id, data.kardex)
    
                })
            }
        } else {
            var contenedorKardex = document.getElementById("contenedorKardex")
            var alert = `
                <div class="alert alert-warning" role="alert">
                    Kardex no encontrado
                </div>`
            contenedorKardex.innerHTML = alert
        }
    });
    //Aqui se llenan las calificaciones
}

function obtenerAlumnos() {
    //Aqui se obtienen los alumnos para que el maestro los vea
    ejecutarPHP("servicios/consultaAlumnos.php", function (data) {
        if (data.resultado == 'ok' && data.alumnos && data.alumnos.length > 0) {
            var contenedorAlumnos = document.getElementById("contenedorAlumnos");
            var filas = "";
            data.alumnos.forEach(function (elemento) {
                var fila = `
                <div class="row m-1">
                    <div class="col">
                        ${elemento.nombre} ${elemento.apellidos}
                    </div>
                    <div class="col">
                        <button type="button" class="btn btn-outline-secondary btn-sm botonVer" data-id="${elemento.id}">Ver calificaciones</button>
                    </div>
                </div>`
                filas += fila;
            })

            var tabla = `
            <h5 class="m-3"><strong>Alumnos</strong></h5>
            ${filas}`;

            contenedorAlumnos.innerHTML = tabla

            var botones = document.getElementsByClassName('botonVer');

            for (let i = 0; i < botones.length; i++) {
                const botonVer = botones[i];
                botonVer.addEventListener("click", function() {
                    var alumnoId = botonVer.getAttribute('data-id');
                    obtenerCalificaciones(alumnoId, MAESTRO);
                })
            }
        }
    });
}

function guardarCalificaciones(id_alumno, kardex) {
    var calificaciones = JSON.parse(kardex);

    var inputs = document.getElementsByClassName('txtCalificacion')

    for (let i = 0; i < inputs.length; i++) {
        const elemento = inputs[i];
        var calf = parseInt(elemento.value, 10);
        var materia = elemento.getAttribute('aria-label');
        var materiaIndex = calificaciones.findIndex(nodo=> nodo.materia === materia);

        if(materiaIndex !== -1){
            calificaciones[materiaIndex].calificacion = calf
        }
    }
    console.log(calificaciones)
    ejecutarPHP(`servicios/actualizarCalificacion.php?id=${id_alumno}&calificaciones=${JSON.stringify(calificaciones)}`,
        function (data) {
        
        });
}


var botonSalir = document.getElementById('botonSalir');
botonSalir.onclick = function () {
    window.location.href = 'index.html'
}


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