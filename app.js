
 // Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
const items = document.querySelectorAll(".menu-item");

// Abrir/cerrar menú
btnMenu.addEventListener("click", () => {
  menu.classList.toggle("activo");
});
// Abrir submenús
 items.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("activo");
  });
});
// ========================
  // ESTADO GLOBAL
  // ========================
  const ticket = {
    turno: null,
    loterias: [],
    apuestas: []
  };


apuestas = [];


const botonesLoteria = document.querySelectorAll(".loteria");
const btnTodos = document.querySelector(".todos");
const btnSiguiente = document.querySelector(".siguiente");
const pantallaLoterias = document.getElementById("pantalla-loterias");
const pantallaTeclado = document.getElementById("pantalla-teclado");
const loteriasSpan = document.getElementById("loterias-ticket");
const turnoSpan = document.getElementById("turno-ticket");
const fechaSpan = document.getElementById("fecha-ticket");

const display = document.getElementById("display");
const ubicacion = document.getElementById("ubicacion");
const importe = document.getElementById("importe");
const tbody = document.getElementById("tabla-body");
const totalSpan = document.getElementById("total");
const resumenSpan = document.getElementById("resumen");
const pantallaComprobante = document.getElementById("pantalla-comprobante");
const tablaResultados = document.getElementById("tabla-resultados");

// ========================
  // UTILIDADES
  // ========================

  function obtenerTurno() {
    const params = new URLSearchParams(window.location.search);
    return params.get("turno") || "-";
  }

  function obtenerFechaHora() {
    return new Date().toLocaleString("es-AR");
  }

  function obtenerLoteriasSeleccionadas() {
    return Array.from(document.querySelectorAll(".loteria.activa"))
      .map(btn => btn.textContent.trim());
  }

  function actualizarEstadoSiguiente() {
    const seleccionadas = document.querySelectorAll(".loteria.activa");
    btnSiguiente.disabled = seleccionadas.length === 0;
  }
  
  // ========================
  // SELECCIÓN LOTERÍAS
  // ========================
  botonesLoteria.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("activa");
      actualizarEstadoSiguiente();
    });
  });
  

  btnTodos.addEventListener("click", () => {
    const todasActivas = document.querySelectorAll(".loteria.activa").length === botonesLoteria.length;

    botonesLoteria.forEach(btn => {
      btn.classList.toggle("activa", !todasActivas);
    });

    actualizarEstadoSiguiente();
  });

   // ========================
  // PASAR A TECLADO
  // ========================
  btnSiguiente.addEventListener("click", () => {

    ticket.turno = obtenerTurno();
    ticket.loterias = obtenerLoteriasSeleccionadas();

    // Mostrar datos del ticket
    renderTicketInfo();

    pantallaLoterias.classList.add("hidden");
    pantallaTeclado.classList.remove("hidden");

  });

   // ========================
  // RENDER TICKET
  // ========================
  function renderTicketInfo() {
    turnoSpan.textContent = ticket.turno.replace("_", " ");
    fechaSpan.textContent = obtenerFechaHora();

    loteriasSpan.innerHTML = ticket.loterias
      .map(l => `<span class="loteria-chip">${l}</span>`)
      .join("");
  }

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
    ticket.apuestas.push({
    numero,
    ubicacion,
    importe:importe.value
    });

    actualizarTabla();
    limpiarInputs();
  }
  function quitarApuesta() {
    ticket.apuestas.pop();
    actualizarTabla();
  }
 //Generar comprobante
 
  function generarComprobante() {
  console.log("Generando comprobante...", ticket);

  const compTurno = document.getElementById("comp-turno");
  const compFecha = document.getElementById("comp-fecha");
  const compLoterias = document.getElementById("comp-loterias");
  const compTabla = document.getElementById("comp-tabla");
  const compTotal = document.getElementById("comp-total");

  if (!compTurno || !compTabla) {
    console.error("Faltan elementos del comprobante en el HTML");
    return;
  }

  // Turno
  compTurno.textContent = ticket.turno || "-";

  // Fecha
  compFecha.textContent = new Date().toLocaleString("es-AR");

  // Loterías
  compLoterias.innerHTML = ticket.loterias
    .map(l => `<span class="loteria-chip">${l}</span>`)
    .join("");

  // Tabla
  compTabla.innerHTML = "";

  ticket.apuestas.forEach(apuesta => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${apuesta.numero}</td>
      <td>${apuesta.ubicacion.value}</td>
      <td>$${formatearMoneda(apuesta.importe)}</td>
    `;

    compTabla.appendChild(fila);
  });

  // Total
  let total = 0;
  const cantLoterias = ticket.loterias.length || 1;

  ticket.apuestas.forEach(a => {
    total += Number(a.importe) * cantLoterias;
  });

  compTotal.textContent = formatearMoneda(total);
}
  function enviarApuesta() {
  if (ticket.apuestas.length === 0) {
    alert("No hay apuestas");
    return;
  }

  console.log("Ticket enviado:", ticket);

  // 🔥 1. Generar comprobante ANTES de limpiar
  generarComprobante();

  // Probar desde frontend --
  fetch("http://localhost:3000/guardar-ticket", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(ticket)
});

  // 🔄 2. Cambiar de pantalla
  pantallaTeclado.classList.add("hidden");
  pantallaComprobante.classList.remove("hidden");

  // 🧹 3. Limpiar después (opcional pero recomendado)
  //ticket.apuestas = [];

  actualizarTabla();
  calcularTotal();
}


  function actualizarTabla() {
       tbody.innerHTML = "";
    ticket.apuestas.forEach(apuesta => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${apuesta.numero}</td>
      <td>${apuesta.ubicacion.value}</td>
      <td>$${formatearMoneda(apuesta.importe)}</td>
    `;

    tbody.appendChild(fila);
  });
  calcularTotal(); // 👈 clave
}



    //  Calcular premios ---

    function calcularPremios(resultados) {

  let totalPremio = 0;
  const cantLoterias = ticket.loterias.length || 1;

  ticket.apuestas.forEach(apuesta => {

    resultados.forEach((numeroGanador, index) => {

      if (apuesta.numero === numeroGanador) {

        let premio = 0;

        // Escala básica (la podés ajustar después)
        if (index === 0) premio = apuesta.importe * 70;
        else if (index === 1) premio = apuesta.importe * 30;
        else if (index === 2) premio = apuesta.importe * 15;
        else premio = apuesta.importe * 5;

        premio = premio * cantLoterias;

        totalPremio += premio;

        console.log(`Ganó ${apuesta.numero} → $${premio}`);
      }

    });

  });

  mostrarPremio(totalPremio);
}

     // Mostrar premios en pantalla --

function mostrarPremio(total) {
  const el = document.getElementById("premio-total");
  el.textContent = "Premio: $" + total.toLocaleString("es-AR");

  // efecto visual
  el.classList.add("flash");

  setTimeout(() => {
    el.classList.remove("flash");
  }, 500);
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

  function limpiarInputs() {
  display.value = "";
  importe.value = "";
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

  const cantidadLoterias = ticket.loterias.length || 1;

  ticket.apuestas.forEach(apuesta => {
    total += Number(apuesta.importe) * cantidadLoterias;
  });

  totalSpan.textContent = formatearMoneda(total);

  const cantidad = ticket.apuestas.length;
  resumenSpan.textContent = `${cantidad} apuesta${cantidad !== 1 ? "s" : ""}`;  
}
function formatearMoneda(valor) {
  return valor.toLocaleString("es-AR");
}

function volverInicio() {

  // Reset
  ticket.apuestas = [];
  ticket.loterias = [];
  ticket.turno = null;

  // Volver a pantalla inicial


  pantallaComprobante.classList.add("hidden");
  pantallaLoterias.classList.remove("hidden");
}
  document.querySelector(".btn-volver")
   .addEventListener("click", volverInicio);



   
    // Configuración de loterías por turno
const configLoterias = {
  previa: ["provincia", "ciudad", "loteria3", "loteria4", "loteria5"],
  primera: ["provincia", "ciudad", "loteria3", "loteria4", "loteria5"],
  matutina: ["provincia", "ciudad", "loteria3", "loteria4", "loteria5", "montevideo"],
  vespertina: ["provincia", "ciudad", "loteria3", "loteria4", "loteria5"],
  nocturna: ["provincia", "ciudad", "loteria3", "loteria4", "loteria5", "montevideo"]
};
  // Generar input dinamicamente --
const contenedor = document.getElementById("contenedor-loterias");

function renderInputs(turno) {

  contenedor.innerHTML = "";

  const loterias = configLoterias[turno];

  loterias.forEach(lot => {

    const div = document.createElement("div");

    div.innerHTML = `
      <label>${lot.toUpperCase()}</label>
      <input type="text" maxlength="4" data-loteria="${lot}" placeholder="0000">
    `;

    contenedor.appendChild(div);
  });
}

// Mostrar resultados en tabla --
function renderResultados(turno, resultados) {

  tablaResultados.innerHTML = "";

  Object.entries(resultados).forEach(([loteria, numero]) => {

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${loteria}</td>
      <td>${numero}</td>
    `;

    tablaResultados.appendChild(fila);
  });
}

    // Conectar botones de turno --
botonesTurno.forEach(btn => {
  btn.addEventListener("click", () => {

    botonesTurno.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    const turno = btn.dataset.turno;

    renderInputs(turno);
  });
});


  // Gardar Resultados --
document.getElementById("btn-guardar-resultados")
  .addEventListener("click", async () => {

    const turnoActivo = document.querySelector(".btn-turno.activo");

    if (!turnoActivo) {
      alert("Seleccioná un turno");
      return;
    }

    const turno = turnoActivo.dataset.turno;

    const inputs = document.querySelectorAll("#contenedor-loterias input");

    let resultados = {};

    inputs.forEach(input => {
      const loteria = input.dataset.loteria;
      const valor = input.value.trim();

      if (valor.length === 4) {
        resultados[loteria] = valor;
      }
    });

    try {
      await fetch("http://localhost:3000/guardar-resultados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          turno,
          resultados
        })
      });

      alert("Resultados guardados correctamente");

    } catch (error) {
      console.error(error);
    }

});

// Obtener resultados --


async function obtenerResultados(turno) {
  try {
    const res = await fetch(`http://localhost:3000/resultados/${turno}`);
    const data = await res.json();

    console.log("Resultados:", data);

    renderResultados(turno, data);
    calcularPremios(data);

  } catch (error) {
    console.error("Error al traer resultados:", error);
  }
}
     // Conectar botones de turno --
botonesTurno.forEach(btn => {
  btn.addEventListener("click", () => {

    botonesTurno.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    const turno = btn.dataset.turno;

    obtenerResultados(turno); // 🔥 ahora viene del backend
  });
});

// Logica para cargar resultados

let resultadosTemp = [];

const inputResultado = document.getElementById("input-resultado");
const btnAgregar = document.getElementById("btn-agregar-resultado");
const btnGuardar = document.getElementById("btn-guardar-resultados");

btnAgregar.addEventListener("click", () => {

  const numero = inputResultado.value.trim();

  if (numero.length !== 4) {
    alert("Debe ser un número de 4 cifras");
    return;
  }

  resultadosTemp.push(numero);

  inputResultado.value = "";

  renderResultados(null, resultadosTemp); // reutilizamos tabla
});

// Enviar resultados al backend --
 
btnGuardar.addEventListener("click", async () => {

  if (resultadosTemp.length === 0) {
    alert("No hay resultados");
    return;
  }

  const turnoActivo = document.querySelector(".btn-turno.activo");

  if (!turnoActivo) {
    alert("Seleccioná un turno");
    return;
  }

  const turno = turnoActivo.dataset.turno;

  try {

    await fetch("http://localhost:3000/guardar-resultados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        turno,
        numeros: resultadosTemp
      })
    });

    alert("Resultados guardados");

    resultadosTemp = [];

  } catch (error) {
    console.error(error);
  }

});
  // render de resultados 
function renderResultados(turno, resultados) {
  tablaResultados.innerHTML = "";

  resultados.forEach((numero, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${numero}</td>
    `;

    tablaResultados.appendChild(fila);
  });
}


});
