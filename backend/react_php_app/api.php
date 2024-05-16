<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration settings
$serverName = "localhost";
$userName = "marcoyc";
$password = "r8W24BHI";
$dbName = "S224DB_marcoyc";

$conn = new mysqli($serverName, $userName, $password, $dbName);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$table = $_GET['table'] ?? '';
$id = $_GET['id'] ?? 0;

$validTables = [
    "comentario",
    "ejercicio",
    "meta",
    "planificarejercicio",
    "planificarrutina",
    "programa",
    "programacontienerutina",
    "rutina",
    "rutinacontieneejercicio",
    "seguirprograma",
    "sesión",
    "usuario"
];

$validAttributes = [
    "comentario" => ["ComentarioID", "SesiónID", "Texto", "Fecha"],
    "ejercicio" => ["EjercicioID", "Nombre", "Descripción", "Sets", "Repeticiones", "Peso", "Equipamiento", "Duración", "Distancia", "TipoEstiramiento", "isEntrenamientoDeFuerza", "isCardio_Circuitos", "isCore_Estabilidad", "isPliométricos", "isFlexibilidad_Movilidad"],
    "meta" => ["MetaID", "UserID", "FechaLímite", "Completado", "Descripción"],
    "planificarejercicio" => ["UserID", "EjercicioID"],
    "planificarrutina" => ["UserID", "RutinaID"],
    "programa" => ["ProgramaID", "Nombre", "Descripción", "FechaInicio", "FechaFin"],
    "programacontienerutina" => ["ProgramaID", "RutinaID"],
    "rutina" => ["RutinaID", "SesiónID", "Nombre", "Descripción"],
    "rutinacontieneejercicio" => ["RutinaID", "EjercicioID"],
    "seguirprograma" => ["UserID", "ProgramaID"],
    "sesión" => ["SesiónID", "UserID", "Fecha", "Duración"],
    "usuario" => ["UserID", "Nombre", "Correo", "Contraseña"]
];

if (!in_array($table, $validTables)) {
    echo json_encode(['error' => 'Invalid table name']);
    exit;
}

if (!isset($validAttributes[$table])) {
    echo json_encode(['error' => 'Table attributes not defined']);
    exit;
}

switch ($requestMethod) {
    case 'GET':
        handleGet($conn, $table, $id, $validAttributes[$table]);
        break;
    case 'POST':
        handlePost($conn, $table, $validAttributes[$table]);
        break;
    case 'PUT':
        handlePut($conn, $table, $id, $validAttributes[$table]);
        break;
    case 'DELETE':
        handleDelete($conn, $table, $id, $validAttributes[$table]);
        break;
    default:
        echo json_encode(['error' => 'Invalid request']);
        break;
}

$conn->close();

function handleGet($conn, $table, $id, $attributes) {
    $primaryKey = $attributes[0];
    $sql = $id ? "SELECT * FROM `$table` WHERE $primaryKey = $id" : "SELECT * FROM `$table`";
    $result = $conn->query($sql);
    if ($result) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

function handlePost($conn, $table, $attributes) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        echo json_encode(['error' => 'Invalid input']);
        return;
    }

    $columns = [];
    $values = [];
    foreach ($data as $key => $value) {
        if (in_array($key, $attributes)) {
            $columns[] = "`$key`";
            $values[] = is_numeric($value) ? $value : "'" . $conn->real_escape_string($value) . "'";
        }
    }

    $columns = implode(", ", $columns);
    $values = implode(", ", $values);
    $sql = "INSERT INTO `$table` ($columns) VALUES ($values)";
    
    if ($conn->query($sql)) {
        echo json_encode(['id' => $conn->insert_id]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

function handlePut($conn, $table, $id, $attributes) {
    $primaryKey = $attributes[0];
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !$id) {
        echo json_encode(['error' => 'Invalid input']);
        return;
    }

    $updates = [];
    foreach ($data as $key => $value) {
        if (in_array($key, $attributes)) {
            $updates[] = "`$key` = " . (is_numeric($value) ? $value : "'" . $conn->real_escape_string($value) . "'");
        }
    }

    $updates = implode(", ", $updates);
    $sql = "UPDATE `$table` SET $updates WHERE $primaryKey = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => $conn->affected_rows]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

function handleDelete($conn, $table, $id, $attributes) {
    $primaryKey = $attributes[0];
    if (!$id) {
        echo json_encode(['error' => 'Invalid input']);
        return;
    }
    $sql = "DELETE FROM `$table` WHERE $primaryKey = $id";
    if ($conn->query($sql)) {
        echo json_encode(['success' => $conn->affected_rows]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>
