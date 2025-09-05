// Arreglos para almacenar usuarios y productos
let usuarios = [];
let productos = [];
let usuarioId = 1;
let productoId = 1;

// Registro de usuario con validación
document.getElementById("formUsuario").addEventListener("submit", function(e){
  e.preventDefault();
  const nombre = document.getElementById("nombreUsuario").value.trim();
  const correo = document.getElementById("correoUsuario").value.trim();
  const pass = document.getElementById("passUsuario").value.trim();

  if(nombre === "" || correo === "" || pass === ""){
    alert("Todos los campos son obligatorios.");
    return;
  }

  if(!correo.includes("@")){
    alert("Ingrese un correo válido.");
    return;
  }

  usuarios.push({id: usuarioId++, nombre, correo, pass});
  alert("Usuario registrado con éxito");
  this.reset();
});

// Registro de producto con validación
document.getElementById("formProducto").addEventListener("submit", function(e){
  e.preventDefault();
  const tipo = document.getElementById("tipoProducto").value;
  const marca = document.getElementById("marcaProducto").value.trim();
  const modelo = document.getElementById("modeloProducto").value.trim();
  const anio = document.getElementById("anioProducto").value.trim();
  const precio = document.getElementById("precioProducto").value.trim();
  const numeroSerie = document.getElementById("serieProducto").value.trim();
  const robado = document.getElementById("robadoProducto").checked;
  const venta = document.getElementById("ventaProducto").checked;

  if(tipo === "" || marca === "" || modelo === "" || anio === "" || precio === "" || numeroSerie === ""){
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Validar número de serie único
  if(productos.some(p => p.numeroSerie === numeroSerie)){
    alert("Número de serie ya registrado.");
    return;
  }

  productos.push({
    id: productoId++,
    tipo,
    marca,
    modelo,
    anio: parseInt(anio),
    precio: parseFloat(precio),
    numeroSerie,
    robado,
    venta,
    historialPropietarios: [] // Por ahora vacío, luego se puede vincular a usuario
  });

  alert("Producto registrado con éxito");
  this.reset();
  mostrarResultados(productos);
});

// Función para mostrar resultados de búsqueda
function mostrarResultados(listado){
  const contenedor = document.getElementById("resultadosBusqueda");
  contenedor.innerHTML = "";

  listado.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("col-md-4");
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${p.tipo} - ${p.marca} ${p.modelo}</h5>
          <p class="card-text">Año: ${p.anio} <br> Precio: $${p.precio} <br> Serie: ${p.numeroSerie} <br> Robado: ${p.robado} <br> Disponible venta: ${p.venta}</p>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Filtros de búsqueda
document.getElementById("filtroMarca").addEventListener("input", filtrarProductos);
document.getElementById("filtroModelo").addEventListener("input", filtrarProductos);
document.getElementById("filtroTipo").addEventListener("change", filtrarProductos);

function filtrarProductos(){
  const marca = document.getElementById("filtroMarca").value.toLowerCase();
  const modelo = document.getElementById("filtroModelo").value.toLowerCase();
  const tipo = document.getElementById("filtroTipo").value;

  const filtrados = productos.filter(p => 
    p.marca.toLowerCase().includes(marca) &&
    p.modelo.toLowerCase().includes(modelo) &&
    (tipo === "" || p.tipo === tipo)
  );

  mostrarResultados(filtrados);
}
