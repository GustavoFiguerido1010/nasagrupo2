document.addEventListener("DOMContentLoaded", function () {
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnBorrar = document.getElementById("btnBorrar");
  const contenedor = document.getElementById("contenedor");
  const listaImagenes = document.getElementById("listaImagenes");

  btnBuscar.addEventListener("click", function () {
    const query = inputBuscar.value.trim();

    if (query !== "") {
      const apiUrl = `https://images-api.nasa.gov/search?q=${query}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Limpia el contenedor antes de mostrar nuevos resultados
          listaImagenes.innerHTML = "";

          if (data.collection && data.collection.items.length > 0) {
            data.collection.items.forEach((item) => {
              if (item.links && item.links.length > 0) {
                const imageUrl = item.links[0].href;
                const title = item.data[0].title || "Sin título";
                const description = item.data[0].description || "Sin descripción";
                const dateCreated = item.data[0].date_created || "Sin fecha";

                const listItem = document.createElement("li"); // Crea un elemento de lista
                const img = document.createElement("img");
                img.src = imageUrl;

                // Crea un div para mostrar la información de la imagen
                const infoDiv = document.createElement("div");
                infoDiv.className = "imagen-info";
                infoDiv.innerHTML = `
                  <h2>${title}</h2>
                  <p>${description}</p>
                  <p>Fecha: ${dateCreated}</p>
                `;

                // Agrega el elemento de imagen y el div de información a la lista de imágenes
                listItem.appendChild(img);
                listItem.appendChild(infoDiv);
                listaImagenes.appendChild(listItem); // Agrega el elemento de lista a la lista ordenada
              }
            });
          } else {
            listaImagenes.innerHTML = "No se encontraron imágenes.";
          }
          
        })
        // Actualiza la URL para que aparezca el texto que se busca
        history.pushState({}, "", `?q=${query}`)

        .catch((error) => {
          console.error("Error al buscar imágenes:", error);
        });
    }
    function onBuscarClick() {
      const query = inputBuscar.value.trim();

      if (query !== "") {
          buscarYActualizarURL(query);
      }
  }

  // Agregar un evento click al botón de búsqueda
  btnBuscar.addEventListener("click", onBuscarClick);

  // Esto maneja el evento de navegación hacia atrás
  window.addEventListener("popstate", function () {
    
      // Obtiene el texto de búsqueda desde la URL al cargar la página
      const queryParams = new URLSearchParams(window.location.search);
      const queryParam = queryParams.get("q");
      if (queryParam) {
          inputBuscar.value = queryParam;
          buscarYActualizarURL(queryParam);
      }
  });

  });
  
// Borrar busqueda
  btnBorrar.addEventListener("click", function () {
    inputBuscar.value = "";
    listaImagenes.innerHTML = "";
    history.pushState({}, "", "/");
  });
});
 
/*-----------------------------------*\
 * #funcion para calificacion con estrellasS
\*-----------------------------------*/

function createStarRating(score) {
  const starCount = 5; // Número total de estrellas
  const filledStars = Math.round(score); // Número de estrellas llenas. La funcion Math.round rendea a numeros enteros.

  let starRatingHTML = ''; // Cadena HTML para las estrellas

  // Creamos estrellas llenas
  for (let i = 0; i < filledStars; i++) {
    starRatingHTML += '<i class="fa fa-star"></i>'; // fa fa-star hace referencia a estrellas llenas
  }

  // Creamos las estrellas vacías (las que faltan)
  for (let i = filledStars; i < starCount; i++) {
    starRatingHTML += '<i class="fa fa-star-o"></i>'; // fa fa-star-o hace referencia a estrellas vacias
  }

  return starRatingHTML; // Devolver la cadena HTML de las estrellas
}
  /*-----------------------------------*\
 * #FUNCION PARA ENVIAR COMENTARIOS
\*-----------------------------------*/

const commentForm = document.getElementById("comment-form");

commentForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el envío predeterminado del formulario

  // Obtener el valor del comentario y la calificación
  const comment = document.getElementById("comment").value;
  const rating = document.querySelector('input[name="rating"]:checked');

  if (!rating) {
    // mensaje de error por no seleccionar calificación
    alert("Por favor, seleccione una calificación.");
    return;
  }
if (!comment) {
  // mensaje de error si no existe comentario 
  alert("Por favor, ingrese un comentario")
  return;
}
/*-----------------------------------*\
 * #Crear un nuevo comentario
\*-----------------------------------*/
  
  const newCommentHTML = `
  <div class="comment">
      <button class="delete-comment-button" onclick="deleteComment(this)">&#10006;</button>
      <div class="comment-content">
        <p><span class="user">Usuario</span> - ${formattedDate} ${formattedTime} <div class="star-rating">${createStarRating(Number(rating.value))}</div></p>
        <p>${comment}</p>
      </div>
    </div>
  `;

  // Agregar el nuevo comentario al área de comentarios
  const commentSection = document.getElementById("comment-section");
  commentSection.insertAdjacentHTML("beforeend", newCommentHTML);

  // Limpia el formulario
  commentForm.reset();
});


/*-----------------------------------*\
 * #Obtener la fecha y hora actual
\*-----------------------------------*/
const currentDate = new Date();

// Formatear la fecha y hora en el formato deseado
const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;


/*-----------------------------------*\
 * #Eliminar comentario
\*-----------------------------------*/

function deleteComment(button) {
  const comment = button.parentElement; 
  comment.remove(); // Eliminar el comentario del DOM
}


document.getElementById("finalDePagina").addEventListener("click", function() {
  window.scrollTo(0, document.body.scrollHeight);
});

/*-----------------------------------*\
 * #Funcion JSON
\*-----------------------------------*/


document.addEventListener("DOMContentLoaded", function () {
  const selectedPlanetaId = localStorage.getItem("prodId");

  if (selectedPlanetaId) {
    const PLANETA = "comentarios.json"; // Ruta al archivo JSON

    fetch(PLANETA)
      .then(response => response.json())
      .then(comentarios => {
        // Mostrar los comentarios en la página
        displayProductDetails(comentarios);
      })
      .catch(error => {
        console.error("Error al cargar los datos del producto", error);
      });
  } else {
    document.getElementById("comment-section").innerHTML = "<p>No se buscó ningún planeta.</p>";
  }
});

function displayProductDetails(comentarios) {
  const commentSection = document.getElementById("comment-section");

  // Limpiar el contenido anterior, si lo hubiera
  commentSection.innerHTML = "";

  // Crear un elemento para cada comentario y agregarlo al DOM
  comentarios.comentario.forEach(comentario => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");

    const userPara = document.createElement("p");
    userPara.textContent = `Usuario: ${comentario.user}`;

    const descriptionPara = document.createElement("p");
    descriptionPara.textContent = `Descripción: ${comentario.description}`;

    const dateTimePara = document.createElement("p");
    dateTimePara.textContent = `Fecha y hora: ${comentario.dateTime}`;

    const scorePara = document.createElement("p");
    scorePara.textContent = `Puntuación: ${comentario.score}`;

    commentDiv.appendChild(userPara);
    commentDiv.appendChild(descriptionPara);
    commentDiv.appendChild(dateTimePara);
    commentDiv.appendChild(scorePara);

    commentSection.appendChild(commentDiv);
  });
}
