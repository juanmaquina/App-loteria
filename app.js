
// ========================
// NAVEGACIÓN A TECLADO
// ========================

const btnSiguiente = document.querySelector(".siguiente");
const pantallaLoterias = document.getElementById("pantalla-loterias");
const pantallaTeclado = document.getElementById("pantalla-teclado");



 // Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

  let apuestas = [];

  const display = document.getElementById("display");
  const ubicacion = document.getElementById("ubicacion");
  const importe = document.getElementById("importe");
  const tbody = document.getElementById("tabla-body");

const totalSpan = document.getElementById("total");
const resumenSpan = document.getElementById("resumen");



const botonesLoteria = document.querySelectorAll(".loteria");
const btnTodos = document.querySelector(".todos");





// Array de seleccionadas
let loteriasSeleccionadas = [];

// Toggle individual

function actualizarEstadoSiguiente() {
  const seleccionadas = document.querySelectorAll(".loteria.activa");
  btnSiguiente.disabled = seleccionadas.length === 0;
}

botonesLoteria.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("activa");
  });
});


function obtenerLoteriasSeleccionadas() {
  return Array.from(document.querySelectorAll(".loteria.activa"))
    .map(btn => btn.textContent.trim());
}

const seleccionadas = obtenerLoteriasSeleccionadas();
localStorage.setItem("loterias", JSON.stringify(seleccionadas));


// Botón TODOS

btnTodos.addEventListener("click", () => {

  const todasActivas = document.querySelectorAll(".loteria.activa").length === botonesLoteria.length;

  botonesLoteria.forEach(btn => {
    btn.classList.toggle("activa", !todasActivas);
  });
actualizarEstadoSiguiente();

});
 


if (btnSiguiente) {
  btnSiguiente.addEventListener("click", () => {
 

  // Guardar selección (opcional: localStorage para persistencia)
  //localStorage.setItem("loterias", JSON.stringify(loteriasSeleccionadas));

  // Cambiar pantalla
  pantallaLoterias.classList.add("hidden");
  pantallaTeclado.classList.remove("hidden");
  

});
}


  // ========================
  // FUNCIONES PRINCIPALES
  // ========================

  function proxApuesta() {
    const numero = display.value;

    if (numero.length === 0) {
      alert("Ingrese una apuesta");
      return;
    }

    if (!importe.value) {
      alert("Ingresá un importe");
      return;
    }

    apuestas.push({
      numero: numero,
      ubicacion: ubicacion.value,
      importe: importe.value
    });

    actualizarTabla();
    limpiarInputs();
  }

  function quitarApuesta() {
    apuestas.pop();
    actualizarTabla();
  }

  function enviarApuesta() {
    if (apuestas.length === 0) {
      alert("No hay apuestas");
      return;
    }



    console.log("Apuestas enviadas:", apuestas);
    alert("Apuestas enviadas correctamente");

    apuestas = [];
    actualizarTabla();
    limpiarInputs();
  }

  function actualizarTabla() {
  tbody.innerHTML = "";

  apuestas.forEach(apuesta => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${apuesta.numero}</td>
      <td>${apuesta.ubicacion}</td>
      <td>$${apuesta.importe}</td>
    `;

    tbody.appendChild(fila);
  });

  calcularTotal(); // 👈 clave
}

  function limpiarInputs() {
    display.value = "";
    importe.value = "";
  }
  

  // ========================
  // TECLADO NUMÉRICO
  // ========================

  function agregarNumero(num) {
    if (display.value.length < 4) {
      display.value += num;
    }
  }

  function borrar() {
    display.value = display.value.slice(0, -1);
  }

  function limpiar() {
    display.value = "";
  }

  // ========================
  // EVENTOS BOTONES
  // ========================


  // Números
  document.querySelectorAll(".teclado button").forEach(btn => {
    btn.addEventListener("click", () => {
      const valor = btn.textContent;

      if (valor === "←") {
        borrar();
      } else if (valor === "C") {
        limpiar();
      } else if (!isNaN(valor)) {
        agregarNumero(valor);
      }
    });
  });

  // Acciones
document.querySelector(".prox").addEventListener("click", proxApuesta);
document.querySelector(".quitar").addEventListener("click", quitarApuesta);
document.querySelector(".enviar-full").addEventListener("click", enviarApuesta);


function calcularTotal() {
  let total = 0;

  apuestas.forEach(apuesta => {
    total += Number(apuesta.importe);
  });

  totalSpan.textContent = formatearMoneda(total);

  const cantidad = apuestas.length;
  resumenSpan.textContent = `${cantidad} apuesta${cantidad !== 1 ? "s" : ""}`;

  // 🔥 Flash visual
  const container = document.querySelector(".total-container");
  container.classList.remove("flash");

  // Forzar reflow para reiniciar animación
  void container.offsetWidth;

  container.classList.add("flash");
}
});
function formatearMoneda(valor) {
  return valor.toLocaleString("es-AR");
}

