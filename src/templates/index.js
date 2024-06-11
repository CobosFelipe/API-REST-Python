// Manipulacion del DOM
const tabla = document.getElementById("tDatos");
const formulario = document.getElementById("formulario");
const botonesEditar = document.getElementsByClassName("edit");
const botonesEliminar = document.getElementsByClassName("delete");

//URL del EndPoint
const urlDataAll = "http://localhost:5000/api/books/";

//Traer datos desde API
(async () => {
  await fetch(`${urlDataAll}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => {
      mostrarDatos(json);
      //console.log(json);
    })
    .catch((error) => {
      console.log("Error consumiendo la api", error);
    });
})();

function mostrarDatos(data) {
  let table = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i].prestado == false) {
      data[i].prestado = "No";
    } else {
      data[i].prestado = "Si";
    }
    table += ` 
  <tr>
    <td class="text-center">${data[i].idlibro}</td>
    <td>${data[i].nombre}</td>
    <td class="text-center">${data[i].isbn}</td>
    <td class="text-center">${data[i].cantidad}</td>
    <td class="text-center">${data[i].prestado}</td>
    <td>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal${data[i].idlibro}">
          Editar
        </button>
      </div>
    </td>
    <td>
      <div class="d-flex justify-content-center">
        <button class="btn btn-danger btn-sm delete">
          Eliminar
        </button>
      </div>
    </td>
  </tr>

  <!-- Modal -->
  <div class="modal fade" id="modal${data[i].idlibro}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">${data[i].nombre}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form method="post">
            <label for="idLibro" class="form-label">IdLibro</label>
            <input type="text" class="form-control inpIdLibro" id="idLibro" name="name" value="${data[i].idlibro}" />

            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control inpNombre" id="name" name="name" value="${data[i].nombre}" />

            <label for="isbn" class="form-label">ISBN</label>
            <input type="text" class="form-control inpIsbn" id="isbn" name="isbn" value="${data[i].isbn}" />

            <label for="cant" class="form-label">Cantidad</label>
            <input type="cant" class="form-control inpCant" id="cant" name="cant" value="${data[i].cantidad}" />
            <div class="col">
                <label for="borrowed" class="form-label">Prestado</label>
                <select class="form-select inpPrestado" name="borrowed" id="${data[i].borrowed}" name="borrowed">
                  <option value="True">Si</option>
                  <option value="False">No</option>
                </select>
              </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" id="btn-${data[i].idlibro}" class="btn btn-primary edit">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
  `;
  }
  tabla.innerHTML = table;
  //Ejecutamos esta funcion para que el event listener espere a que se creen los botones en el html
  cargarBotones();
  capturarDatos();
}

function actualizarDatos() {
  // Datos de los inputs del formulario
  const name = document.getElementById("name").value;
  const isbn = document.getElementById("isbn").value;
  const cant = document.getElementById("cant").value;
  const borrowed = document.getElementById("borrowed").value;
  // Actualizacion del registro en la base de datos
  fetch(`${urlDataAll}add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Establece el tipo de contenido a JSON
    },
    body: JSON.stringify({
      nombre: name,
      isbn: isbn,
      cantidad: cant,
      prestado: borrowed,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function editarDatos(id) {
  const datos = capturarDatos();
  //console.log(datos.inpPrestado[id].value);

  // Reasigno los valores en variables para acceder mas fácil
  let idlibro = datos.inpIdLibro[id].value;
  let nombre = datos.inpNombre[id].value;
  let isbn = datos.inpIsbn[id].value;
  let cantidad = datos.inpCant[id].value;
  let prestado = datos.inpPrestado[id].value;

  fetch(`${urlDataAll}update/${idlibro}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Establece el tipo de contenido a JSON
    },
    body: JSON.stringify({
      idlibro: parseInt(idlibro),
      nombre: nombre,
      isbn: isbn,
      cantidad: parseInt(cantidad),
      prestado: prestado,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (dato) {
      console.log(dato);
    });
  Swal.fire({
    title: "Edición Exitosa",
    text: "Datos actualizados!",
    icon: "success",
  }).then(() => {
    window.location.reload();
  });
}

function eliminarDatos(id) {
  const datos = capturarDatos();
  //console.log(datos.inpIdLibro[id].value);

  // Reasigno los valores en variables para acceder mas fácil
  let idlibro = datos.inpIdLibro[id].value;

  // Ejecutamos SweetAlert2 para ayudar con la confirmación de la acción de borrado
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "¿Está seguro?",
      text: "Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, borrar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        //Si se confirma la acción se ejecuta el fetch
        fetch(`${urlDataAll}delete/${idlibro}`, {
          method: "DELETE",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (dato) {
            console.log(dato);
          });
        swalWithBootstrapButtons
          .fire({
            title: "Eliminado!",
            text: "El elemento ha sido eliminado!",
            icon: "success",
          })
          .then(() => {
            window.location.reload();
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}

function cargarBotones() {
  for (let j = 0; j < botonesEditar.length; j++) {
    botonesEditar[j].addEventListener("click", function () {
      editarDatos(j);
    });
    botonesEliminar[j].addEventListener("click", function () {
      eliminarDatos(j);
    });
  }
}

function capturarDatos() {
  // Capturar los datos para editarlos
  const inpIdLibro = document.getElementsByClassName("inpIdLibro");
  const inpNombre = document.getElementsByClassName("inpNombre");
  const inpIsbn = document.getElementsByClassName("inpIsbn");
  const inpCant = document.getElementsByClassName("inpCant");
  const inpPrestado = document.getElementsByClassName("inpPrestado");
  return { inpIdLibro, inpNombre, inpIsbn, inpCant, inpPrestado };
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  actualizarDatos();
});
