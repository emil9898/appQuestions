let urlBaseDeDatos = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoGiw-I5HUad_kO4A_eVg4DAlwqepk0AWZZc-wJn_WlCpohxf4sTYcBtzINhkpGA/pub?gid=1367924162&single=true&output=tsv";

let texto = readLocalStorage(urlBaseDeDatos)

if (texto == null) {
    if (!window.navigator.onLine) {
        swal.fire("Cuidado", "EL navegador no está en linea, la base de datos no se podrá descargar de Google sheets", "warning")
    }
    actualizarBaseDeDatos()
} else {
    interpretadorBaseDatos(texto)
    actualizarBaseDeDatos()
}

function interpretadorBaseDatos(data) {
    let renglones = data.split("\n");
    cantidadPreguntas = renglones.length
    categorias = [];
    for (const renglon of renglones) {
        let arr = renglon.split("\t");
        if (!categorias[arr[0]]) {
            categorias[arr[0]] = [];
        }
        categorias[arr[0]].push(new pregunta(arr));
    }
    for (const i in categorias) {
        categorias[i].sort(() => Math.random() - 0.5)
    }
    escogerPregunta(contadorPreguntas);
    cambiarPantalla("juego")
}

function readLocalStorage(nombre) {
    let data = localStorage.getItem(nombre);
    if (data == null) {
        return null;
    }
    return data;
}

function actualizarBaseDeDatos() {
    $.ajax({
        url: urlBaseDeDatos,
        success: function (data) {
            localStorage.setItem(urlBaseDeDatos, data);
            actualizarBaseDeDatos(data)
        }
    });
}

function pregunta(arr) {
    this.categoria = arr[0];
    this.pregunta = arr[1];
    this.respuesta = arr[2];
    this.distractor1 = arr[3];
    this.distractor2 = arr[4];
    this.distractor3 = arr[5];
}