
// ========================
// NAVEGACIÓN A TECLADO
// ========================

const btnSiguiente = document.querySelector(".siguiente");
const pantallaLoterias = document.getElementById("pantalla-loterias");
const pantallaTeclado = document.getElementById("pantalla-teclado");

if (btnSiguiente) {
  btnSiguiente.addEventListener("click", () => {
    pantallaLoterias.classList.add("hidden");
    pantallaTeclado.classList.remove("hidden");
  });
}

 // Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

  let apuestas = [];

  const display = document.getElementById("display");
  const ubicacion = document.getElementById("ubicacion");
  const importe = document.getElementById("importe");
  const tbody = document.getElementById("tabla-body");
  const totalSpan = document.getElementById("total");



  // ========================
  // FUNCIONES PRINCIPALES
  // ========================

  function proxApuesta() {
    const numero = display.value;

    if (numero.length !== 4) {
      alert("El número debe tener 4 cifras");
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

  totalSpan.textContent = total;
}

});


