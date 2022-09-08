const PROD_URL= PRODUCT_INFO_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
const COMMENT_URL = PRODUCT_INFO_COMMENTS_URL + sessionStorage.getItem("ProdID") + EXT_TYPE;
let ProdInfo = [];
let ProdComments = [];
let imgContent = ""
let htmlContent = "";
//Este arreglo esta creado ya que no me dejaba iterar con una HTMLCollection
let smallImages = [];
//Dejamos definido el objeto del comentario del usuario
let userComment = {
     product: sessionStorage.getItem("ProdID"),
     score: "",
     description: "",
     user: "",
     dateTime: ""
};

function ImagesAnim(obj){
//Agrega la animación de hover a cada imagen del producto
     obj.forEach((img, i) => {
     smallImages[i] = document.getElementById(`smImg${i}`);
     });
     for(let i=0;i<smallImages.length;i++){
          smallImages[i].addEventListener("mouseover", function(e){
               //Lo que hacemos es cambiar la referencia de la imagen original
               document.getElementById("ogImg").src = smallImages[i].src;
          });
     }
}

function showProductInfo(obj){
//Muestra la información del producto usando el DOM
     obj.images.forEach((img, i) => {
          imgContent += `<img src="${img}" id="smImg${i}">
`;
     });
     htmlContent = `
     <div id="imagesContainer" class="w-75">
          <img src="${obj.images[0]}" id="ogImg" class="w-100">
          <div class="smallImg mt-3 w-50 d-flex justify-content-start">
               ${imgContent}
          </div>
     </div>
     <div id="ProdDescription">
          <h2 class="row">${obj.category} > ${obj.name}</h2>
          <span class="row">${obj.description}</span>
          <span class="row d-flex align-items-center">${obj.currency} <h3 class="fs-4 col">${obj.cost}</h3></span>
          <span class="row">${obj.soldCount} vendidos hasta el momento.</span>
     </div>
     `;
     //Botón de compra
     //<div class="btn btn-primary row w-25">botón</div>
     
     document.getElementById("Info").innerHTML = htmlContent;
}

function ShowProductComments(obj){
//Muestra los comentarios y puntuaciones del producto mostrado.
     document.getElementById("Comment").innerHTML = "";
     for(let comment of obj){
          //Al recargar la pagina cada vez que se interactúa con el formulario de ingresar comentario no necesitamos chequear 
          //el tipo de dato de comment.score
          if(comment.score > 0){
               let stars = comment.score;
               comment.score="";
               for(let i=0; i<5; i++){
                    if(i<stars){
                         comment.score += `<span class="fa fa-star checked"></span>`
                    }
                    else{
                         comment.score += `<span class="fa fa-star"></span>`
                    }
               }
          }
          htmlContent = `
               <div id="comentario" class="rounded mb-2 w-100">
                    <span class="ps-3 pt-1 fs-5">${comment.user} - ${comment.score}</span>
                    <span class="ps-3 pt-1 text-muted">${comment.dateTime}</span>
                    <span class="ps-3 pt-1 fs-5">${comment.description}</span>
               </div>
          `;
          document.getElementById("Comment").innerHTML += htmlContent;
     }
}

function showUserCommOption(){
//Muestra el formulario para ingresar el comentario. Lo hago asi porque tendría un problema de formato si no.
     htmlContent = `
     <div id="tuComentario" class="w-100">
          <h2 id="title" class="fs-3 col">Escribe tu opinión</h2>
          <div class="mb-1">
               <label for="exampleFormControlTextarea1" class="form-label">Tu comentario</label>
               <textarea id="com" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Me encanto porque..."></textarea>
          </div>
          <div id="err1">Es necesario ingresar un comentario.</div>
          <select id="punt" class="form-select class="w-50" aria-label="Default select example">
               <option selected hidden value="0">Tu puntuación</option>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
          </select>
          <div id="err2">Es necesario poner una calificación.</div>
          <div class="col-12">
               <button id="enviarCom" class="btn btn-primary mt-3" type="submit">Enviar opinión</button>
               <button id="eliminarCom" class="btn btn-primary mt-3" type="submit">Eliminar opinión</button>
          </div>
     </div>
     `;
     document.getElementById("Comment").innerHTML += htmlContent;
}

function sendUserComment(obj){
//Maneja la interacción con el botón de enviar comentario
          let com = document.getElementById("com").value;
          let punt = document.getElementById("punt").selectedIndex;
          if( com == ""  || punt == ""){
               if(( com == "") && ( punt == "")){

                    document.getElementById("err1").style.display="block";
                    document.getElementById("com").style.borderColor="red";
                    document.getElementById("err2").style.display="block";
                    document.getElementById("punt").style.borderColor="red";
               }else if(com == ""){
                    document.getElementById("err1").style.display="block";
                    document.getElementById("com").style.borderColor="red";
                    document.getElementById("err2").style.display="none";
                    document.getElementById("punt").style.borderColor="#4f4f4f";
               }else if(punt == ""){
                    document.getElementById("err2").style.display="block";
                    document.getElementById("punt").style.borderColor="red";
                    document.getElementById("err1").style.display="none";
                    document.getElementById("com").style.borderColor="#4f4f4f";
               }
          }else{
               //Esto obtiene la fecha y hora actual del sistema.
               let date = new Date();
               userComment.description = com;
               userComment.score = parseInt(punt);
               userComment.user = localStorage.getItem("UserName");
               userComment.dateTime = date.getFullYear() + '-' + (date.getMonth()+1)+ '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               obj.push(userComment);
               //Define el comentario en el localStorage para que siga apareciendo mas tarde
               localStorage.setItem(`${userComment.product}`+"Comments", JSON.stringify(userComment));
               location.reload();
          }
}


document.addEventListener("DOMContentLoaded", function(e){
     document.getElementById("u_n").innerHTML = localStorage.getItem("UserName");

     //Lo tuve que hacer asi porque no me copiaba el objeto response a los arreglos ya creados
     //(No se arregla con la anidación del getJSONData)
     getJSONData(PROD_URL).then(function (resObj) {
          if (resObj.status === "ok") {
               ProdInfo = resObj.data;
          }
          showProductInfo(ProdInfo);
          ImagesAnim(ProdInfo.images);
     }).then(function(){
          getJSONData(COMMENT_URL).then(function (resObj) {
               if (resObj.status === "ok") {
                    ProdComments = resObj.data;
               }
               //Verificamos si el localStorage cuenta con algún comentario puesto por el usuario en su pc.
               if(localStorage.getItem(`${userComment.product}`+"Comments") != null &&
               localStorage.getItem(`${userComment.product}`+"Comments").includes(`${ProdInfo.id}`)){
                    ProdComments.push(JSON.parse(localStorage.getItem(`${userComment.product}`+"Comments")));
               }
               ShowProductComments(ProdComments);
               showUserCommOption();
               //Agregamos un eventListener al botón de submit
               document.getElementById("enviarCom").addEventListener("click", function(e){
                    if(localStorage.getItem(`${userComment.product}`+"Comments") == null){
                         sendUserComment(ProdComments);
                    }else if(confirm("Ya hiciste tu comentario! No se pueden hacer 2.\nQuieres editar tu comentario actual?")){
                         sendUserComment(ProdComments);
                    }else{
                         document.getElementById("com").value = "";
                         document.getElementById("punt").selectedIndex = 0;
                    }
               });
               //Comportamiento de eliminar un comentario
               document.getElementById("eliminarCom").addEventListener("click",function(e){
                    if(localStorage.getItem(`${userComment.product}`+"Comments") != null
                    && confirm("Estas seguro que quieres eliminar tu comentario?")){
                         localStorage.removeItem(`${userComment.product}`+"Comments");
                         location.reload();
                    }else if(localStorage.getItem(`${userComment.product}`+"Comments") == null){
                         alert("No hay comentarios para eliminar!");
                    }
               });
          });
     });
});