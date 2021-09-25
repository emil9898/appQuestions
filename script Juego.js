let contadorPreguntas = 0;

let segundosEsperar_cuandoResponda = 3 * 1000;
let BotonesFuncionales = true;

let saldoJugador = 0
document.getElementById("saldoJugador").innerHTML = "Dinero ganado: " + saldoJugador.formatMoney()

Ranking = JSON.parse(localStorage.getItem("Ranking"))

if (Ranking == null) {
  Ranking = []
  let html = ""
  html += `
    <tr>
      <td>No hay Historial aún</td>
    </tr>
    `
  document.getElementById("tablaRanking").innerHTML = html
} else {
  actualizarTablaHistorial()
}


function actualizarTablaHistorial() {
  let html = ""
  for (const r of Ranking) {
    html += `
    <tr>
      <td>${r.nombre}</td>
      <td>${r.puntaje}</td>
    </tr>
    `
  }
  document.getElementById("tablaRanking").innerHTML = html
}

function borrarSaldo() {
  saldoJugador = 0

  document.getElementById("saldoJugador").innerHTML = "Dinero ganado: " + saldoJugador.formatMoney()
}

function cambiarPantalla(pantalla) {
  document.getElementById("Juego").style.display = "none"
  document.getElementById("Presentación").style.display = "none"
  document.getElementById("ranking").style.display = "none"

  switch (pantalla) {
    case "juego":
      document.getElementById("Juego").style.display = "inline-block"
      break
    case "presentación":
      document.getElementById("Presentación").style.display = "inline-block"
      if (Ranking) {
        document.getElementById("ranking").style.display = "inline-block"
      }
      break
    case "ranking":
      document.getElementById("ranking").style.display = "inline-block"
      break
  }
}

botonesHTML = [
  document.getElementById("btn1"),
  document.getElementById("btn2"),
  document.getElementById("btn3"),
  document.getElementById("btn4"),
];

let preguntaSeleccionada;

function escogerPregunta(n) {
  console.log("n: " + n)
  let acumuladoPreguntas = 0;
  for (const i in categorias) {
    if (n >= acumuladoPreguntas + categorias[i].length) {
      acumuladoPreguntas += categorias[i].length;
      continue;
    }
    console.log("index seleccionado: " + (n - acumuladoPreguntas))
    preguntaSeleccionada = categorias[i][n - acumuladoPreguntas];
    console.log("Pregunta seleccionada: ")
    console.log(preguntaSeleccionada)
    break;
  }
  document.getElementById("categoria").innerHTML = preguntaSeleccionada.categoria;
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

async function validarRespuesta(i) {
  if (!BotonesFuncionales) {
    return
  }
  BotonesFuncionales = false;
  if (botonesHTML[i].innerHTML == preguntaSeleccionada.respuesta) {
    //respondió correctamente
    botonesHTML[i].style.background = "rgba(0,255,0,0.5)";
    setTimeout(() => {
      for (let i = 0; i < botonesHTML.length; i++) {
        const boton = botonesHTML[i];
        botonesHTML[i].style.background = "";
      }
      saldoJugador += (contadorPreguntas + 1) * 1000
      document.getElementById("saldoJugador").innerHTML = "Dinero ganado: " + saldoJugador.formatMoney()
      contadorPreguntas++
      if (contadorPreguntas == cantidadPreguntas) {
        swal.fire("Felicidades, terminaste el juego",
          "Tu saldo es de: " + saldoJugador.formatMoney(),
          "success"
        )
        terminarJuego()
      } else {
        BotonesFuncionales = true;
        escogerPregunta(contadorPreguntas);
      }
    }, segundosEsperar_cuandoResponda);
  } else {
    //respondió incorrectamente
    botonesHTML[i].style.background = "rgba(255,0,0,0.5)";
    await swal.fire(
      "El juego ha finalizado",
      "Tu saldo es de: " + saldoJugador.formatMoney(),
      "error"
    )
    terminarJuego()
    for (let i = 0; i < botonesHTML.length; i++) {
      const boton = botonesHTML[i];
      botonesHTML[i].style.background = "";
    }
  }
}

async function terminarJuegoVoluntario() {
  await swal.fire(
    "Suspención voluntaria",
    "Tu saldo es de: " + saldoJugador.formatMoney(),
    "success"
  )
  terminarJuego()
}

async function terminarJuego() {
  BotonesFuncionales = false;
  let { value: nombre } = await swal.fire({
    input: "text",
    title: "Escriba su nombre"
  })
  Ranking.push(new RegistroHistorico(nombre, saldoJugador.formatMoney()))
  if (Ranking.length > 10) {
    Ranking.shift()
  }
  localStorage.setItem("Ranking", JSON.stringify(Ranking))
  actualizarTablaHistorial()
  cambiarPantalla("presentación")
}

function RegistroHistorico(nombre, puntaje) {
  this.nombre = nombre
  this.puntaje = puntaje
}