// Arreglos para almacenar usuarios y productos
let usuarios = []; // Arreglo en memoria para guardar objetos de usuarios registrados
let productos = []; // Arreglo en memoria para guardar objetos de productos/dispositivos
let usuarioId = 1; // Contador autoincremental para asignar ID único a cada usuario
let productoId = 1; // Contador autoincremental para asignar ID único a cada producto

// === Productos iniciales de ejemplo ===
productos = [ // Sobrescribe el arreglo productos con datos de ejemplo (semilla)
  { id: productoId++, tipo:"Teléfono", marca:"Apple",   modelo:"iPhone 13",      anio:2021, precio:550000, numeroSerie:"APL12345", robado:false, venta:true, historialPropietarios:[] }, // Crea producto y asigna id actual, luego incrementa productoId
  { id: productoId++, tipo:"Teléfono", marca:"Samsung", modelo:"Galaxy S22",     anio:2022, precio:480000, numeroSerie:"SMS56789", robado:false, venta:true, historialPropietarios:[] }, // Campos usados en UI (tipo/marca/modelo/año/precio/serie/flags/Historial)
  { id: productoId++, tipo:"Computador", marca:"Dell",  modelo:"XPS 13",         anio:2020, precio:600000, numeroSerie:"DLL24680", robado:false, venta:true, historialPropietarios:[] }, // robado/venta controlan badges y vistas
  { id: productoId++, tipo:"Computador", marca:"Apple", modelo:"MacBook Air M1", anio:2021, precio:750000, numeroSerie:"APL97531", robado:false, venta:true, historialPropietarios:[] } // historialPropietarios reservado para futuras funcionalidades
];

// ---------------- Funciones auxiliares ----------------
function showError(inputId, message) { // Muestra error visual y texto para un input específico
  const input = document.getElementById(inputId); // Obtiene el input por su id
  const errorDiv = document.getElementById(inputId + 'Error'); // Obtiene el div de error asociado (convención: id + 'Error')
  if (!input || !errorDiv) return; // Si no existen, sale silenciosamente para no romper
  input.classList.add('error'); // Añade clase CSS 'error' (borde rojo, etc.)
  input.classList.remove('success'); // Quita la clase de éxito si la tuviera
  errorDiv.textContent = message; // Escribe el mensaje de error visible para el usuario
  errorDiv.style.display = 'block'; // Muestra el contenedor del mensaje de error
}

function showSuccess(inputId) { // Marca un input como válido (éxito) y oculta su error
  const input = document.getElementById(inputId); // Obtiene el input objetivo
  const errorDiv = document.getElementById(inputId + 'Error'); // Obtiene el contenedor de error asociado
  if (!input || !errorDiv) return; // Salida segura si falta algo en el DOM
  input.classList.remove('error'); // Quita marca de error si estaba
  input.classList.add('success'); // Añade marca de éxito (borde verde, etc.)
  errorDiv.style.display = 'none'; // Oculta el mensaje de error
}

function clearValidation(inputId) { // Limpia cualquier estado de validación del input (ni error ni éxito)
  const input = document.getElementById(inputId); // Selecciona input
  const errorDiv = document.getElementById(inputId + 'Error'); // Selecciona contenedor de error
  if (!input || !errorDiv) return; // Salida segura
  input.classList.remove('error', 'success'); // Quita ambas clases de estado
  errorDiv.style.display = 'none'; // Oculta el mensaje de error
}

function validateEmail(email) { // Valida formato general de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular simple: algo@algo.algo
  return emailRegex.test(email); // Retorna true si coincide, false si no
}
function validateName(name) { // Valida nombre: mínimo 2 caracteres, solo letras/espacios (incluye acentos/ñ)
  return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim()); // trim para evitar espacios extra
}
function validatePassword(password) { // Valida contraseña: longitud mínima
  return password.length >= 8; // Requisito: 8 o más caracteres
}
function validateYear(year) { // Valida año de producto
  const currentYear = new Date().getFullYear(); // Obtiene año actual del sistema
  const numYear = parseInt(year); // Convierte a entero
  return numYear >= 2000 && numYear <= currentYear; // Acepta desde 2000 hasta el año actual
}
function validatePrice(price) { // Valida precio numérico
  const numPrice = parseFloat(price); // Convierte a número de punto flotante
  return !isNaN(numPrice) && numPrice >= 0; // Debe ser número válido y no negativo
}

// ---------------- Validación formularios ----------------
// Solo corre si estamos en la página que SÍ tiene los formularios

// === Usuario ===
if (document.getElementById('formUsuario')) { // Verifica que el formulario de usuario exista en el DOM (para no ejecutar en otras páginas)
  document.getElementById('nombreUsuario').addEventListener('input', function() { // Listener en tiempo real para validar nombre a medida que escribe
    const nombre = this.value.trim(); // Lee y recorta espacios del valor actual
    if (nombre === '') { // Si está vacío
      clearValidation('nombreUsuario'); // Quita estados de validación (ni correcto ni error)
    } else if (!validateName(nombre)) { // Si no pasa la validación de nombre
      showError('nombreUsuario', 'El nombre debe tener al menos 2 caracteres y solo contener letras'); // Muestra mensaje de error
    } else { // Si pasa validación
      showSuccess('nombreUsuario'); // Marca el input como válido
    }
  });

  document.getElementById('correoUsuario').addEventListener('input', function() { // Valida el correo en tiempo real
    const correo = this.value.trim(); // Normaliza el valor
    if (correo === '') { // Si está vacío
      clearValidation('correoUsuario'); // Limpia validación
    } else if (!validateEmail(correo)) { // Si formato no es válido
      showError('correoUsuario', 'Ingrese un correo electrónico válido'); // Error de formato
    } else if (usuarios.some(u => u.correo === correo)) { // Comprueba si el correo ya existe en el arreglo usuarios
      showError('correoUsuario', 'Este correo ya está registrado'); // Error por duplicado
    } else { // Si todo ok
      showSuccess('correoUsuario'); // Éxito visual
    }
  });

  document.getElementById('passUsuario').addEventListener('input', function() { // Valida contraseña al teclear
    const password = this.value; // Lee el valor actual
    if (password === '') { // Vacío
      clearValidation('passUsuario'); // Limpia validación
    } else if (!validatePassword(password)) { // Si no cumple largo mínimo
      showError('passUsuario', 'La contraseña debe tener al menos 8 caracteres'); // Error
    } else { // Correcta
      showSuccess('passUsuario'); // Éxito visual
    }
    const confirmPassword = document.getElementById('confirmPassUsuario').value; // Obtiene el valor de confirmación por si ya lo escribió
    if (confirmPassword !== '') { // Solo valida confirmación si el campo no está vacío
      if (confirmPassword !== password) { // Si no coinciden
        showError('confirmPassUsuario', 'Las contraseñas no coinciden'); // Error en confirmación
      } else { // Coinciden
        showSuccess('confirmPassUsuario'); // Marca confirmación como válida
      }
    }
  });

  document.getElementById('confirmPassUsuario').addEventListener('input', function() { // Listener de confirmación de contraseña
    const confirmPassword = this.value; // Valor de confirmación
    const password = document.getElementById('passUsuario').value; // Valor de la contraseña original
    if (confirmPassword === '') { // Si está vacío
      clearValidation('confirmPassUsuario'); // Limpia estado
    } else if (confirmPassword !== password) { // Si no coincide con la original
      showError('confirmPassUsuario', 'Las contraseñas no coinciden'); // Error
    } else { // Coincide
      showSuccess('confirmPassUsuario'); // Éxito
    }
  });

  // Submit usuario
  document.getElementById("formUsuario").addEventListener("submit", function(e) { // Maneja el envío del formulario de usuario
    e.preventDefault(); // Previene recarga de página por envío tradicional
    const nombre = document.getElementById("nombreUsuario").value.trim(); // Lee nombre normalizado
    const correo = document.getElementById("correoUsuario").value.trim(); // Lee correo normalizado
    const pass = document.getElementById("passUsuario").value; // Lee password
    const confirmPass = document.getElementById("confirmPassUsuario").value; // Lee confirmación

    let isValid = true; // Bandera que acumula si todo pasó las validaciones

    if (nombre === "") { showError('nombreUsuario', 'El nombre es obligatorio'); isValid = false; } // Nombre obligatorio
    else if (!validateName(nombre)) { showError('nombreUsuario', 'El nombre debe tener al menos 2 caracteres y solo contener letras'); isValid = false; } // Nombre con formato válido

    if (correo === "") { showError('correoUsuario', 'El correo es obligatorio'); isValid = false; } // Correo obligatorio
    else if (!validateEmail(correo)) { showError('correoUsuario', 'Ingrese un correo electrónico válido'); isValid = false; } // Formato correo
    else if (usuarios.some(u => u.correo === correo)) { showError('correoUsuario', 'Este correo ya está registrado'); isValid = false; } // Unicidad correo

    if (pass === "") { showError('passUsuario', 'La contraseña es obligatoria'); isValid = false; } // Pass obligatoria
    else if (!validatePassword(pass)) { showError('passUsuario', 'La contraseña debe tener al menos 8 caracteres'); isValid = false; } // Largo mínimo

    if (confirmPass === "") { showError('confirmPassUsuario', 'Confirme su contraseña'); isValid = false; } // Confirmación obligatoria
    else if (confirmPass !== pass) { showError('confirmPassUsuario', 'Las contraseñas no coinciden'); isValid = false; } // Coincidencia exacta

    if (isValid) { // Solo si pasó todas las validaciones
      usuarios.push({id: usuarioId++, nombre, correo, pass}); // Inserta el nuevo usuario con ID autoincremental

      const alertDiv = document.createElement('div'); // Crea un div para la alerta de éxito
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3'; // Aplica clases Bootstrap para estilo de alerta
      alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        <strong>¡Éxito!</strong> Usuario registrado correctamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `; // Contenido HTML de la alerta (icono, texto y botón para cerrar)
      this.appendChild(alertDiv); // Inserta la alerta dentro del formulario

      this.reset(); // Limpia todos los campos del formulario
      ['nombreUsuario','correoUsuario','passUsuario','confirmPassUsuario'].forEach(clearValidation); // Quita marcas de validación de los inputs
      setTimeout(() => alertDiv.parentNode && alertDiv.remove(), 5000); // Remueve la alerta automáticamente después de 5s (si sigue en el DOM)
    }
  });
}

// === Producto ===
if (document.getElementById('formProducto')) { // Si estamos en la página de registro de producto
  document.getElementById('tipoProducto').addEventListener('change', function() { // Valida al cambiar el tipo (select)
    if (this.value === '') showError('tipoProducto', 'Seleccione un tipo de dispositivo'); else showSuccess('tipoProducto'); // Obligatorio seleccionar
  });

  document.getElementById('marcaProducto').addEventListener('input', function() { // Valida marca en vivo
    const marca = this.value.trim(); // Normaliza
    if (marca === '') clearValidation('marcaProducto'); // Vacío: sin estado
    else if (marca.length < 2) showError('marcaProducto', 'La marca debe tener al menos 2 caracteres'); // Longitud mínima
    else showSuccess('marcaProducto'); // Válido
  });

  document.getElementById('modeloProducto').addEventListener('input', function() { // Valida modelo en vivo
    const modelo = this.value.trim(); // Normaliza
    if (modelo === '') clearValidation('modeloProducto'); // Vacío: limpia
    else if (modelo.length < 2) showError('modeloProducto', 'El modelo debe tener al menos 2 caracteres'); // Longitud mínima
    else showSuccess('modeloProducto'); // Válido
  });

  document.getElementById('anioProducto').addEventListener('input', function() { // Valida año en vivo
    const anio = this.value; // Toma valor como string numérico
    if (anio === '') clearValidation('anioProducto'); // Si vacío, limpia
    else if (!validateYear(anio)) showError('anioProducto', 'Ingrese un año válido entre 2000 y el año actual'); // Rango 2000..actual
    else showSuccess('anioProducto'); // Correcto
  });

  document.getElementById('precioProducto').addEventListener('input', function() { // Valida precio en vivo
    const precio = this.value; // Toma valor
    if (precio === '') clearValidation('precioProducto'); // Si vacío, limpia
    else if (!validatePrice(precio)) showError('precioProducto', 'Ingrese un precio válido (mayor o igual a 0)'); // Debe ser número >= 0
    else showSuccess('precioProducto'); // Correcto
  });

  document.getElementById('serieProducto').addEventListener('input', function() { // Valida número de serie en vivo
    const serie = this.value.trim(); // Normaliza
    if (serie === '') clearValidation('serieProducto'); // Vacío: sin estado
    else if (serie.length < 5) showError('serieProducto', 'El número de serie debe tener al menos 5 caracteres'); // Longitud mínima
    else if (productos.some(p => p.numeroSerie === serie)) showError('serieProducto', 'Este número de serie ya está registrado'); // Unicidad
    else showSuccess('serieProducto'); // Correcto
  });

  // Submit producto
  document.getElementById("formProducto").addEventListener("submit", function(e) { // Maneja envío del formulario de producto
    e.preventDefault(); // Evita recarga
    const tipo = document.getElementById("tipoProducto").value; // Lee el tipo seleccionado
    const marca = document.getElementById("marcaProducto").value.trim(); // Lee marca normalizada
    const modelo = document.getElementById("modeloProducto").value.trim(); // Lee modelo normalizado
    const anio = document.getElementById("anioProducto").value; // Lee año (string)
    const precio = document.getElementById("precioProducto").value; // Lee precio (string)
    const numeroSerie = document.getElementById("serieProducto").value.trim(); // Lee y normaliza serie
    const robado = document.getElementById("robadoProducto").checked; // Lee checkbox robado (boolean)
    const venta = document.getElementById("ventaProducto").checked; // Lee checkbox venta (boolean)

    let isValid = true; // Bandera de validación global

    if (tipo === "") { showError('tipoProducto', 'Seleccione un tipo de dispositivo'); isValid = false; } // Tipo obligatorio
    if (marca === "") { showError('marcaProducto', 'La marca es obligatoria'); isValid = false; } // Marca obligatoria
    else if (marca.length < 2) { showError('marcaProducto', 'La marca debe tener al menos 2 caracteres'); isValid = false; } // Long mín

    if (modelo === "") { showError('modeloProducto', 'El modelo es obligatorio'); isValid = false; } // Modelo obligatorio
    else if (modelo.length < 2) { showError('modeloProducto', 'El modelo debe tener al menos 2 caracteres'); isValid = false; } // Long mín

    if (anio === "") { showError('anioProducto', 'El año es obligatorio'); isValid = false; } // Año obligatorio
    else if (!validateYear(anio)) { showError('anioProducto', 'Ingrese un año válido entre 2000 y el año actual'); isValid = false; } // Rango válido

    if (precio === "") { showError('precioProducto', 'El precio es obligatorio'); isValid = false; } // Precio obligatorio
    else if (!validatePrice(precio)) { showError('precioProducto', 'Ingrese un precio válido (mayor o igual a 0)'); isValid = false; } // Número >= 0

    if (numeroSerie === "") { showError('serieProducto', 'El número de serie es obligatorio'); isValid = false; } // Serie obligatoria
    else if (numeroSerie.length < 5) { showError('serieProducto', 'El número de serie debe tener al menos 5 caracteres'); isValid = false; } // Long mín
    else if (productos.some(p => p.numeroSerie === numeroSerie)) { showError('serieProducto', 'Este número de serie ya está registrado'); isValid = false; } // Unicidad

    if (isValid) { // Si todo correcto
      productos.push({ // Inserta el nuevo producto en el arreglo
        id: productoId++, // Asigna ID actual y luego incrementa
        tipo, marca, modelo, // Copia campos de texto
        anio: parseInt(anio), // Convierte año a número entero
        precio: parseFloat(precio), // Convierte precio a número con decimales
        numeroSerie, robado, venta, // Copia serie y flags booleanos
        historialPropietarios: [] // Prepara arreglo para futuras trazas de dueños
      });

      const alertDiv = document.createElement('div'); // Crea alerta Bootstrap de éxito
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3'; // Clases de estilo de la alerta
      alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        <strong>¡Éxito!</strong> Dispositivo registrado correctamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `; // Contenido con icono y botón cerrar
      this.appendChild(alertDiv); // Inserta la alerta dentro del formulario

      this.reset(); // Limpia el formulario de producto
      ['tipoProducto','marcaProducto','modeloProducto','anioProducto','precioProducto','serieProducto'].forEach(clearValidation); // Quita marcas de validación

      // Si esta página incluye listado, lo refrescamos (no hace daño si no existe)
      if (document.getElementById('resultadosContainer')) { // Comprueba si hay un contenedor de resultados en la página
        mostrarResultados(productos); // Renderiza tarjetas con todos los productos
        document.getElementById('resultadosContainer').style.display = 'block'; // Asegura que el contenedor esté visible
      }

      setTimeout(() => alertDiv.parentNode && alertDiv.remove(), 5000); // Quita alerta tras 5 segundos si aún existe
    }
  });
}

// ---------------- Mostrar resultados ----------------
function mostrarResultados(listado) { // Renderiza una grilla de tarjetas Bootstrap para un arreglo de productos
  const contenedor = document.getElementById("resultadosBusqueda"); // Obtiene el contenedor/grid donde van las tarjetas
  if (!contenedor) return; // Si no existe (otra página), no hace nada
  contenedor.innerHTML = ""; // Limpia resultados anteriores

  if (listado.length === 0) { // Si no hay productos para mostrar
    // Asigna un HTML placeholder que informa que no hay coincidencias (no tocar líneas internas del template)
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">No se encontraron dispositivos</h4>
        <p class="text-muted">Intenta con otros criterios de búsqueda</p>
      </div>`;
    return; // Sale tras mostrar el placeholder
  }

  listado.forEach(p => { // Recorre cada producto del listado filtrado o completo
    const card = document.createElement("div"); // Crea un div-columna para la tarjeta
    card.classList.add("col-lg-4","col-md-6","mb-4"); // Aplica clases responsive Bootstrap para el grid

    const statusBadges = []; // Acumula badges dinámicos de estado
    if (p.robado) statusBadges.push('<span class="badge bg-danger"><i class="bi bi-exclamation-triangle"></i> Robado</span>'); // Muestra badge “Robado” si aplica
    if (p.venta)  statusBadges.push('<span class="badge bg-success"><i class="bi bi-tag"></i> En venta</span>'); // Muestra badge “En venta” si aplica

    // Construye el HTML de la tarjeta con header (icono tipo), body (datos) y footer (fecha de registro).
    // No se comentan las líneas internas del template literal para no romper el contenido:
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
    contenedor.appendChild(card); // Inserta la tarjeta en el grid de resultados
  });
}

// ---------------- Buscador (home) ----------------
(function() { // IIFE (función autoejecutable) para no contaminar el scope global
  const form = document.getElementById('searchForm'); // Obtiene el formulario del buscador (en la home)
  if (!form) return; // Si no existe (otra página), no hace nada

  form.addEventListener('submit', function(e) { // Maneja el envío del formulario de búsqueda
    e.preventDefault(); // Evita recarga
    const serie  = (document.getElementById('searchSerie')?.value || '').trim(); // Lee criterio: número de serie (si el input existe)
    const marca  = (document.getElementById('searchMarca')?.value || '').trim(); // Lee criterio: marca
    const modelo = (document.getElementById('searchModelo')?.value || '').trim(); // Lee criterio: modelo
    const tipo   = document.getElementById('searchTipo')?.value || ''; // Lee criterio: tipo (select)

    if (!serie && !marca && !modelo && !tipo) { // Exige al menos un criterio de búsqueda
      showError('searchSerie', 'Ingrese al menos un criterio de búsqueda'); // Muestra error pegado al primer input (convención)
      return; // No continúa si no hay criterios
    } else {
      clearValidation('searchSerie'); // Limpia posible error previo si ahora sí hay criterio
    }

    const filtrados = productos.filter(p => { // Filtra el arreglo de productos con todos los criterios
      const matchSerie  = !serie  || p.numeroSerie.toLowerCase().includes(serie.toLowerCase()); // Coincidencia parcial por serie
      const matchMarca  = !marca  || p.marca.toLowerCase().includes(marca.toLowerCase()); // Coincidencia parcial por marca
      const matchModelo = !modelo || p.modelo.toLowerCase().includes(modelo.toLowerCase()); // Coincidencia parcial por modelo
      const matchTipo   = !tipo   || p.tipo === tipo; // Coincidencia exacta por tipo (si se elige)
      return matchSerie && matchMarca && matchModelo && matchTipo; // Debe cumplir todos los criterios no vacíos
    });

    const resultsContainer = document.getElementById('searchResults'); // Contenedor donde se muestra el aviso de resultados (alert)
    if (!resultsContainer) return; // Salida segura si no existe

    if (filtrados.length === 0) { // Si no hay coincidencias
      // Inserta un alert Bootstrap informativo de “0 resultados”.
      resultsContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No se encontraron dispositivos que coincidan con los criterios de búsqueda.
        </div>`;
    } else { // Si hay coincidencias
      // Inserta un alert Bootstrap de éxito con el conteo y ancla para ir a la grilla
      resultsContainer.innerHTML = `
        <div class="alert alert-success">
          <i class="bi bi-check-circle me-2"></i>
          Se encontraron <strong>${filtrados.length}</strong> dispositivos.
          <a href="#resultadosContainer" class="alert-link">Ver resultados completos</a>
        </div>`;
      mostrarResultados(filtrados); // Dibuja las tarjetas para los filtrados
      const rc = document.getElementById('resultadosContainer'); // Contenedor grande de resultados
      if (rc) {
        rc.style.display = 'block'; // Asegura que sea visible
        rc.scrollIntoView({ behavior: 'smooth' }); // Hace scroll suave hasta los resultados
      }
    }
  });
})(); // Fin de la IIFE del buscador

// ---------------- Vitrina En venta (home) ----------------
function renderEnVenta() { // Pinta en la home una grilla con productos marcados como "En venta"
  const grid = document.getElementById('gridEnVenta'); // Contenedor de la vitrina
  if (!grid) return; // Si no existe en la página, no hace nada
  grid.innerHTML = ''; // Limpia contenido previo

  const enVenta = productos.filter(p => p.venta === true); // Filtra solo productos con flag venta=true
  if (enVenta.length === 0) { // Si no hay publicaciones
    // Muestra placeholder invitando a publicar (no comentar dentro del template para no romperlo)
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-shop display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">Aún no hay dispositivos publicados para venta</h4>
        <p class="text-muted">Sé el primero en <a href="register-product.html">publicar un dispositivo</a>.</p>
      </div>`;
    return; // Sale tras mostrar el mensaje
  }

  enVenta.forEach(p => { // Recorre cada producto en venta
    const col = document.createElement('div'); // Crea una columna Bootstrap
    col.className = 'col-lg-4 col-md-6'; // Clases responsive para el grid
    // Construye la tarjeta compacta para la vitrina (con precio y estado En venta)
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
    grid.appendChild(col); // Inserta la tarjeta de ese producto en la grilla
  });
}

// Al cargar la página (home)
document.addEventListener('DOMContentLoaded', renderEnVenta); // Cuando el DOM está listo, renderiza la vitrina "En venta" automáticamente
