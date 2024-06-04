<?php
$conexion = new mysqli('localhost', 'root', '', 'proyecto');

if ($conexion->connect_error) {
    die('Error al conectar a la base de datos ' . $conexion->connect_error);
}

$usuario = $_GET['usuario'];
$password = $_GET['password'];
$tipo = $_GET['tipo'];

$query = "SELECT * FROM usuarios WHERE usuario='$usuario' AND tipo=$tipo";

$resultado = $conexion->query($query);

$respuesta = array();

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc(); 
    if ($fila['password'] == $password) {
        $respuesta['resultado'] = 'ok';
        $respuesta['mensaje'] = 'Usuario autenticado correctamente';
        $respuesta['id_usuario'] = $fila['id']; 
    } else {
        $respuesta['resultado'] = 'error';
        $respuesta['mensaje'] = 'Contraseña incorrecta';
    }
} else {
    $respuesta['resultado'] = 'error';
    $respuesta['mensaje'] = 'Usuario no encontrado';
}

$conexion->close();

header('Content-Type: application/json');
echo json_encode($respuesta);
?>