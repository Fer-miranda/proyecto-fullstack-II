// Arreglos para almacenar usuarios y productos
let usuarios = [];
let productos = [];
let usuarioId = 1;
let productoId = 1;

// === Productos iniciales de ejemplo ===
productos = [
  { id: productoId++, tipo:"Teléfono", marca:"Apple",   modelo:"iPhone 13",      anio:2021, precio:550000, numeroSerie:"APL12345", robado:false, venta:true, historialPropietarios:[] },
  { id: productoId++, tipo:"Teléfono", marca:"Samsung", modelo:"Galaxy S22",     anio:2022, precio:480000, numeroSerie:"SMS56789", robado:true, venta:false, historialPropietarios:[] },
  { id: productoId++, tipo:"Computador", marca:"Dell",  modelo:"XPS 13",         anio:2020, precio:600000, numeroSerie:"DLL24680", robado:false, venta:true, historialPropietarios:[] },
  { id: productoId++, tipo:"Computador", marca:"Apple", modelo:"MacBook Air M1", anio:2021, precio:750000, numeroSerie:"APL97531", robado:false, venta:true, historialPropietarios:[] }
];

// ---------------- Funciones auxiliares ----------------
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorDiv = document.getElementById(inputId + 'Error');
  if (!input || !errorDiv) return;
  input.classList.add('error');
  input.classList.remove('success');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function showSuccess(inputId) {
  const input = document.getElementById(inputId);
  const errorDiv = document.getElementById(inputId + 'Error');
  if (!input || !errorDiv) return;
  input.classList.remove('error');
  input.classList.add('success');
  errorDiv.style.display = 'none';
}

function clearValidation(inputId) {
  const input = document.getElementById(inputId);
  const errorDiv = document.getElementById(inputId + 'Error');
  if (!input || !errorDiv) return;
  input.classList.remove('error', 'success');
  errorDiv.style.display = 'none';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validateName(name) {
  return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim());
}
function validatePassword(password) {
  return password.length >= 8;
}
function validateYear(year) {
  const currentYear = new Date().getFullYear();
  const numYear = parseInt(year);
  return numYear >= 2000 && numYear <= currentYear;
}
function validatePrice(price) {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0;
}

// ---------------- Validación formularios ----------------
// Solo corre si estamos en la página que SÍ tiene los formularios

// === Usuario ===
if (document.getElementById('formUsuario')) {
  document.getElementById('nombreUsuario').addEventListener('input', function() {
    const nombre = this.value.trim();
    if (nombre === '') {
      clearValidation('nombreUsuario');
    } else if (!validateName(nombre)) {
      showError('nombreUsuario', 'El nombre debe tener al menos 2 caracteres y solo contener letras');
    } else {
      showSuccess('nombreUsuario');
    }
  });

  document.getElementById('correoUsuario').addEventListener('input', function() {
    const correo = this.value.trim();
    if (correo === '') {
      clearValidation('correoUsuario');
    } else if (!validateEmail(correo)) {
      showError('correoUsuario', 'Ingrese un correo electrónico válido');
    } else if (usuarios.some(u => u.correo === correo)) {
      showError('correoUsuario', 'Este correo ya está registrado');
    } else {
      showSuccess('correoUsuario');
    }
  });

  document.getElementById('passUsuario').addEventListener('input', function() {
    const password = this.value;
    if (password === '') {
      clearValidation('passUsuario');
    } else if (!validatePassword(password)) {
      showError('passUsuario', 'La contraseña debe tener al menos 8 caracteres');
    } else {
      showSuccess('passUsuario');
    }
    const confirmPassword = document.getElementById('confirmPassUsuario').value;
    if (confirmPassword !== '') {
      if (confirmPassword !== password) {
        showError('confirmPassUsuario', 'Las contraseñas no coinciden');
      } else {
        showSuccess('confirmPassUsuario');
      }
    }
  });

  document.getElementById('confirmPassUsuario').addEventListener('input', function() {
    const confirmPassword = this.value;
    const password = document.getElementById('passUsuario').value;
    if (confirmPassword === '') {
      clearValidation('confirmPassUsuario');
    } else if (confirmPassword !== password) {
      showError('confirmPassUsuario', 'Las contraseñas no coinciden');
    } else {
      showSuccess('confirmPassUsuario');
    }
  });

  // Submit usuario
  document.getElementById("formUsuario").addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const correo = document.getElementById("correoUsuario").value.trim();
    const pass = document.getElementById("passUsuario").value;
    const confirmPass = document.getElementById("confirmPassUsuario").value;

    let isValid = true;

    if (nombre === "") { showError('nombreUsuario', 'El nombre es obligatorio'); isValid = false; }
    else if (!validateName(nombre)) { showError('nombreUsuario', 'El nombre debe tener al menos 2 caracteres y solo contener letras'); isValid = false; }

    if (correo === "") { showError('correoUsuario', 'El correo es obligatorio'); isValid = false; }
    else if (!validateEmail(correo)) { showError('correoUsuario', 'Ingrese un correo electrónico válido'); isValid = false; }
    else if (usuarios.some(u => u.correo === correo)) { showError('correoUsuario', 'Este correo ya está registrado'); isValid = false; }

    if (pass === "") { showError('passUsuario', 'La contraseña es obligatoria'); isValid = false; }
    else if (!validatePassword(pass)) { showError('passUsuario', 'La contraseña debe tener al menos 8 caracteres'); isValid = false; }

    if (confirmPass === "") { showError('confirmPassUsuario', 'Confirme su contraseña'); isValid = false; }
    else if (confirmPass !== pass) { showError('confirmPassUsuario', 'Las contraseñas no coinciden'); isValid = false; }

    if (isValid) {
      usuarios.push({id: usuarioId++, nombre, correo, pass});

      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
      alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        <strong>¡Éxito!</strong> Usuario registrado correctamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      this.appendChild(alertDiv);

      this.reset();
      ['nombreUsuario','correoUsuario','passUsuario','confirmPassUsuario'].forEach(clearValidation);
      setTimeout(() => alertDiv.parentNode && alertDiv.remove(), 5000);
    }
  });
}

// === Producto ===
if (document.getElementById('formProducto')) {
  document.getElementById('tipoProducto').addEventListener('change', function() {
    if (this.value === '') showError('tipoProducto', 'Seleccione un tipo de dispositivo'); else showSuccess('tipoProducto');
  });

  document.getElementById('marcaProducto').addEventListener('input', function() {
    const marca = this.value.trim();
    if (marca === '') clearValidation('marcaProducto');
    else if (marca.length < 2) showError('marcaProducto', 'La marca debe tener al menos 2 caracteres');
    else showSuccess('marcaProducto');
  });

  document.getElementById('modeloProducto').addEventListener('input', function() {
    const modelo = this.value.trim();
    if (modelo === '') clearValidation('modeloProducto');
    else if (modelo.length < 2) showError('modeloProducto', 'El modelo debe tener al menos 2 caracteres');
    else showSuccess('modeloProducto');
  });

  document.getElementById('anioProducto').addEventListener('input', function() {
    const anio = this.value;
    if (anio === '') clearValidation('anioProducto');
    else if (!validateYear(anio)) showError('anioProducto', 'Ingrese un año válido entre 2000 y el año actual');
    else showSuccess('anioProducto');
  });

  document.getElementById('precioProducto').addEventListener('input', function() {
    const precio = this.value;
    if (precio === '') clearValidation('precioProducto');
    else if (!validatePrice(precio)) showError('precioProducto', 'Ingrese un precio válido (mayor o igual a 0)');
    else showSuccess('precioProducto');
  });

  document.getElementById('serieProducto').addEventListener('input', function() {
    const serie = this.value.trim();
    if (serie === '') clearValidation('serieProducto');
    else if (serie.length < 5) showError('serieProducto', 'El número de serie debe tener al menos 5 caracteres');
    else if (productos.some(p => p.numeroSerie === serie)) showError('serieProducto', 'Este número de serie ya está registrado');
    else showSuccess('serieProducto');
  });

  // Submit producto
  document.getElementById("formProducto").addEventListener("submit", function(e) {
    e.preventDefault();
    const tipo = document.getElementById("tipoProducto").value;
    const marca = document.getElementById("marcaProducto").value.trim();
    const modelo = document.getElementById("modeloProducto").value.trim();
    const anio = document.getElementById("anioProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const numeroSerie = document.getElementById("serieProducto").value.trim();
    const robado = document.getElementById("robadoProducto").checked;
    const venta = document.getElementById("ventaProducto").checked;

    let isValid = true;

    if (tipo === "") { showError('tipoProducto', 'Seleccione un tipo de dispositivo'); isValid = false; }
    if (marca === "") { showError('marcaProducto', 'La marca es obligatoria'); isValid = false; }
    else if (marca.length < 2) { showError('marcaProducto', 'La marca debe tener al menos 2 caracteres'); isValid = false; }

    if (modelo === "") { showError('modeloProducto', 'El modelo es obligatorio'); isValid = false; }
    else if (modelo.length < 2) { showError('modeloProducto', 'El modelo debe tener al menos 2 caracteres'); isValid = false; }

    if (anio === "") { showError('anioProducto', 'El año es obligatorio'); isValid = false; }
    else if (!validateYear(anio)) { showError('anioProducto', 'Ingrese un año válido entre 2000 y el año actual'); isValid = false; }

    if (precio === "") { showError('precioProducto', 'El precio es obligatorio'); isValid = false; }
    else if (!validatePrice(precio)) { showError('precioProducto', 'Ingrese un precio válido (mayor o igual a 0)'); isValid = false; }

    if (numeroSerie === "") { showError('serieProducto', 'El número de serie es obligatorio'); isValid = false; }
    else if (numeroSerie.length < 5) { showError('serieProducto', 'El número de serie debe tener al menos 5 caracteres'); isValid = false; }
    else if (productos.some(p => p.numeroSerie === numeroSerie)) { showError('serieProducto', 'Este número de serie ya está registrado'); isValid = false; }

    if (isValid) {
      productos.push({
        id: productoId++,
        tipo, marca, modelo,
        anio: parseInt(anio),
        precio: parseFloat(precio),
        numeroSerie, robado, venta,
        historialPropietarios: []
      });

      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
      alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        <strong>¡Éxito!</strong> Dispositivo registrado correctamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      this.appendChild(alertDiv);

      this.reset();
      ['tipoProducto','marcaProducto','modeloProducto','anioProducto','precioProducto','serieProducto'].forEach(clearValidation);

      // Si esta página incluye listado, lo refrescamos (no hace daño si no existe)
      if (document.getElementById('resultadosContainer')) {
        mostrarResultados(productos);
        document.getElementById('resultadosContainer').style.display = 'block';
      }

      setTimeout(() => alertDiv.parentNode && alertDiv.remove(), 5000);
    }
  });
}

// ---------------- Mostrar resultados ----------------
function mostrarResultados(listado) {
  const contenedor = document.getElementById("resultadosBusqueda");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (listado.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">No se encontraron dispositivos</h4>
        <p class="text-muted">Intenta con otros criterios de búsqueda</p>
      </div>`;
    return;
  }

  listado.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("col-lg-4","col-md-6","mb-4");

    const statusBadges = [];
    if (p.robado) statusBadges.push('<span class="badge bg-danger"><i class="bi bi-exclamation-triangle"></i> Robado</span>');
    if (p.venta)  statusBadges.push('<span class="badge bg-success"><i class="bi bi-tag"></i> En venta</span>');

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-header bg-light">
          <h5 class="card-title mb-0">
            <i class="bi bi-${p.tipo === 'Teléfono' ? 'phone' : 'laptop'} me-2 text-primary"></i>${p.tipo}
          </h5>
        </div>
        <div class="card-body">
          <h6 class="fw-bold">${p.marca} ${p.modelo}</h6>
          <div class="mb-2">${statusBadges.join(' ')}</div>
          <ul class="list-unstyled">
            <li><strong>Año:</strong> ${p.anio}</li>
            <li><strong>Precio:</strong> ${p.precio.toLocaleString('es-CL')}</li>
            <li><strong>Serie:</strong> <code>${p.numeroSerie}</code></li>
          </ul>
        </div>
        <div class="card-footer bg-light text-muted small">
          <i class="bi bi-calendar me-1"></i> Registrado: ${new Date().toLocaleDateString('es-CL')}
        </div>
      </div>`;
    contenedor.appendChild(card);
  });
}

// ---------------- Buscador (home) ----------------
(function() {
  const form = document.getElementById('searchForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const serie  = (document.getElementById('searchSerie')?.value || '').trim();
    const marca  = (document.getElementById('searchMarca')?.value || '').trim();
    const modelo = (document.getElementById('searchModelo')?.value || '').trim();
    const tipo   = document.getElementById('searchTipo')?.value || '';

    if (!serie && !marca && !modelo && !tipo) {
      showError('searchSerie', 'Ingrese al menos un criterio de búsqueda');
      return;
    } else {
      clearValidation('searchSerie');
    }

    const filtrados = productos.filter(p => {
      const matchSerie  = !serie  || p.numeroSerie.toLowerCase().includes(serie.toLowerCase());
      const matchMarca  = !marca  || p.marca.toLowerCase().includes(marca.toLowerCase());
      const matchModelo = !modelo || p.modelo.toLowerCase().includes(modelo.toLowerCase());
      const matchTipo   = !tipo   || p.tipo === tipo;
      return matchSerie && matchMarca && matchModelo && matchTipo;
    });

    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (filtrados.length === 0) {
      resultsContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No se encontraron dispositivos que coincidan con los criterios de búsqueda.
        </div>`;
    } else {
      resultsContainer.innerHTML = `
        <div class="alert alert-success">
          <i class="bi bi-check-circle me-2"></i>
          Se encontraron <strong>${filtrados.length}</strong> dispositivos.
          <a href="#resultadosContainer" class="alert-link">Ver resultados completos</a>
        </div>`;
      mostrarResultados(filtrados);
      const rc = document.getElementById('resultadosContainer');
      if (rc) {
        rc.style.display = 'block';
        rc.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
})();

// ---------------- Vitrina En venta (home) ----------------
function renderEnVenta() {
  const grid = document.getElementById('gridEnVenta');
  if (!grid) return;
  grid.innerHTML = '';

  const enVenta = productos.filter(p => p.venta === true);
  if (enVenta.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-shop display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">Aún no hay dispositivos publicados para venta</h4>
        <p class="text-muted">Sé el primero en <a href="register-product.html">publicar un dispositivo</a>.</p>
      </div>`;
    return;
  }

  enVenta.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-header bg-light">
          <h5 class="card-title mb-0">
            <i class="bi bi-${p.tipo === 'Teléfono' ? 'phone' : 'laptop'} me-2 text-primary"></i>
            ${p.marca} ${p.modelo}
          </h5>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mb-3">
            <li><strong>Tipo:</strong> ${p.tipo}</li>
            <li><strong>Año:</strong> ${p.anio}</li>
            <li><strong>Serie:</strong> <code>${p.numeroSerie}</code></li>
          </ul>
          <div class="d-flex align-items-center justify-content-between">
            <span class="badge bg-success"><i class="bi bi-tag me-1"></i> En venta</span>
            <span class="fw-bold">$ ${p.precio.toLocaleString('es-CL')}</span>
          </div>
        </div>
        <div class="card-footer bg-light text-muted small">
          <i class="bi bi-calendar me-1"></i> Publicado: ${new Date().toLocaleDateString('es-CL')}
        </div>
      </div>`;
    grid.appendChild(col);
  });
}

// Al cargar la página (home)
document.addEventListener('DOMContentLoaded', renderEnVenta);
