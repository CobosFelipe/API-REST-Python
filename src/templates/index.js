// Manipulacion del DOM
const tabla = document.getElementById("tDatos");
const formulario = document.getElementById("formulario");
const botonesEditar = document.getElementsByClassName("edit");
const inpIdLibro = document.getElementsByClassName("inpIdLibro");
const inpNombre = document.getElementsByClassName("inpNombre");
const inpIsbn = document.getElementsByClassName("inpIsbn");
const inpCant = document.getElementsByClassName("inpCant");
const inpPrestado = document.getElementsByClassName("inpPrestado");

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
        <a href="{{url_for('delete', id=d.idlibro)}}" class="btn btn-danger btn-sm">Eliminar</a>
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
}

function actualizarDatos() {
  // Datos de los inputs del formulario
  const name = document.getElementById("name").value;
  const isbn = document.getElementById("isbn").value;
  const cant = document.getElementById("cant").value;
  const borrowed = document.getElementById("borrowed").value;

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
  // En la variable data se almacena el valor del identificador del libro
  data = parseInt(inpIdLibro[id].value);
  valor = data-1
  fetch(`${urlDataAll}update/${data}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Establece el tipo de contenido a JSON
    },
    body: JSON.stringify({
      idlibro: inpIdLibro[valor].value,
      nombre: inpNombre[valor].value,
      isbn: inpIsbn[valor].value,
      cantidad: inpCant[valor].value,
      prestado: inpPrestado[valor].value,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (dato) {
      console.log(dato);
    });
}

function eliminarDatos() {
  
}

function cargarBotones() {
  for (let j = 0; j < botonesEditar.length; j++) {
    botonesEditar[j].addEventListener("click", function () {
      editarDatos(j);
    });
  }
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  actualizarDatos();
});
