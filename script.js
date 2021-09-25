contadorPreguntas = 0;

$.ajax({
  url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoGiw-I5HUad_kO4A_eVg4DAlwqepk0AWZZc-wJn_WlCpohxf4sTYcBtzINhkpGA/pub?gid=1367924162&single=true&output=tsv",
  success: function (data) {
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
    escogerPregunta(Math.floor(Math.random() * cantidadPreguntas));
  },
});

function pregunta(arr) {
  this.pregunta = arr[1];
  this.respuesta = arr[2];
  this.distractor1 = arr[3];
  this.distractor2 = arr[4];
  this.distractor3 = arr[5];
}

botonesHTML = [
  document.getElementById("btn1"),
  document.getElementById("btn2"),
  document.getElementById("btn3"),
  document.getElementById("btn4"),
];

let preguntaSeleccionada;

function escogerPregunta(n) {
  let acumuladoPreguntas = 0;
  for (const i in categorias) {
    if (n > acumuladoPreguntas+categorias[i].length) {
      acumuladoPreguntas += categorias[i].length;
      continue;
    }
    preguntaSeleccionada = categorias[i][n - acumuladoPreguntas];
    break;
  }
  document.getElementById("pregunta").innerHTML = preguntaSeleccionada.pregunta;
  let opciones = [
    preguntaSeleccionada.respuesta,
    preguntaSeleccionada.distractor1,
    preguntaSeleccionada.distractor2,
    preguntaSeleccionada.distractor3,
  ];
  opciones.sort(() => Math.random() - 0.5);
  for (let i = 0; i < botonesHTML.length; i++) {
    botonesHTML[i].innerHTML = opciones[i];
  }
}

function validarRespuesta(i) {
  if (botonesHTML[i].innerHTML == preguntaSeleccionada.respuesta) {
    botonesHTML[i].style.background = "rgba(0,255,0,0.5)";
  } else {
    botonesHTML[i].style.background = "rgba(255,0,0,0.5)";
  }
}
