// Notas
// La sopa de letra reparte las palabras vertical y horizontalmente, se pueden agregar mas palabras pero aumentar el numero de columnas que esta en el input del inicio
// Se puede poner hasta un maximo de 19 columnas, sino el juego de deforma un poco, el valor por defecto es 7 asi que se puede ir subiendo tranqui hasta 19

//Se espera a que el HTML y CSS este cargado para ejecutar la funcion iniciar
document.addEventListener('DOMContentLoaded', iniciar);

//Variables y Objetos globales
const elementos = {};
//Palabras para cambiar, maximo 6 letras o incrementar el numero de filas en el input
const misPalabras = ['gato', 'perro', 'raton', 'jirafa', 'ave', 'abeja'];
const game = { r: 5, c: 5, w: 25, x: '', y: '', arr: [], palabrasColocadas: [], tableroArray: [] };
const palabrasColocadas = [];

function iniciar() {
   //Se crean los elementos que vamos a utilizar
   elementos.areaJuego = document.querySelector('.areaJuego');
   elementos.gridContenedor = document.createElement('div');
   elementos.gridContenedor.classList.add('gridContenedor');

   elementos.miLista = document.createElement('div');
   elementos.boton = document.createElement('button');
   elementos.gridTam = document.createElement('input');
   elementos.mensajeError = document.createElement('div');

   //Se agregan los elementos al area del juego(HTML)
   elementos.areaJuego.append(elementos.gridContenedor);
   elementos.areaJuego.append(elementos.miLista);
   elementos.areaJuego.append(elementos.gridTam);
   elementos.areaJuego.append(elementos.boton);
   elementos.areaJuego.append(elementos.mensajeError);

   elementos.gridTam.setAttribute('type', 'number');
   elementos.gridContenedor.textContent = 'Click aqui para inicar el juego. Selecciona el numero de columnas para el juego';
   elementos.boton.textContent = 'Click Empezar';
   elementos.mensajeError.style.color = 'red';
   elementos.gridTam.value = 7;
   elementos.boton.addEventListener('click', iniciarJuego);

}

function iniciarJuego() {
   if(elementos.gridTam.value < 3) {
      elementos.mensajeError.textContent = 'El número de columnas debe ser al menos 3. Inténtalo nuevamente.';
      return;
   }
   
   elementos.mensajeError.textContent = '';

   if (elementos.ganaste) {
      elementos.ganaste.parentNode.removeChild(elementos.ganaste);
      elementos.ganaste = null;
   }

   // console.log("Juego iniciado");
   //Filas
   game.r = Number(elementos.gridTam.value);
   //Columnas
   game.c = Number(elementos.gridTam.value);
   game.x = '';
   game.y = '';
   game.tableroArray.length = 0;
   game.arr.length = 0;
   game.arr.length = game.r * game.c;
   game.palabrasColocadas.length = 0;

   //Se llena el arreglo game con "-"
   for (let i = 0; i < game.arr.length; i++) {
      game.arr[i] = '-';
   }

   //A las filas se les agrega un "auto por cada columna"
   for (let xx = 0; xx < game.r; xx++) {
      game.x += ' auto ';
   }
   //A las columnas se les agrega un "auto por cada columna"
   for (let yy = 0; yy < game.r; yy++) {
      game.y += ' auto ';
   }

   // console.log(game);

   //Se agregan las cantidades de "auto" a cada propiedad en css
   elementos.gridContenedor.style.gridTemplateColumns = game.x;
   elementos.gridContenedor.style.gridTemplateRows = game.y;

   //Se ubican las palabras dentro de la sopa de letras
   //Se utiliza un bucle que recorre cada palabra y la ubicando con la funcion "ubicarPalabra"
   misPalabras.forEach((pal) => {
      let temp = ubicarPalabra(pal);
      if (temp) {
         game.palabrasColocadas.push({
            palabra: pal,
            pos: temp,
         });
      }
   });

   agregarLetras();
   construirTablero();
   elementos.miLista.innerHTML = '';
   game.palabrasColocadas.forEach((w) => {
      w.ele = document.createElement('div');
      w.ele.textContent = w.palabra;
      w.ele.arr = w.pos;
      elementos.miLista.append(w.ele);
   });
   console.log(game);
}

function agregarLetras() {
   for (let i = 0; i < game.arr.length; i++) {
      if (game.arr[i] == '-') {
         game.arr[i] = letraAleatoria();
      }
   }
}

function letraAleatoria() {
   return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('')[Math.floor(Math.random() * 26)];
}

function ubicarPalabra(palabra) {
   // console.log(palabra);
   let ubicadoOkay = false;
   let cnt = 300;
   palabra = palabra.split('');
   // console.log(palabra);
   while (!ubicadoOkay && cnt > 0) {
      cnt--;
      let pos = { col: 0, row: 0 };
      let dir = Math.random() > 0.5 ? true : false;
      //Si dir es verdadero se ubica la palabra horizontalmente y
      // si es falso se ubica verticalmente
      if (dir && palabra.length <= game.c) {
         pos.col = buscarPosicionInicial(palabra.length, game.c);
         pos.row = Math.floor(Math.random() * game.r);
         ubicadoOkay = xUbicacion(pos, palabra);
      } else if (!dir && palabra.length <= game.r) {
         pos.row = buscarPosicionInicial(palabra.length, game.r);
         pos.col = Math.floor(Math.random() * game.c);
         ubicadoOkay = yUbicacion(pos, palabra);
      }
   }
   return ubicadoOkay;
}

//Se ubica la palabra verticalmente
function yUbicacion(cor, palabra) {
   let empezar = cor.row * game.c + cor.col;
   let okayCounter = 0;
   let indexColocado = [];
   for (let i = 0; i < palabra.length; i++) {
      if (game.arr[empezar + i * game.c] == '-') {
         okayCounter++;
      }
   }
   if (okayCounter == palabra.length) {
      for (let i = 0; i < palabra.length; i++) {
         if (game.arr[empezar + i * game.c] == '-') {
            game.arr[empezar + i * game.c] = palabra[i];
            indexColocado.push(empezar + i * game.c);
         }
      }
      return indexColocado;
   }
   return false;
}

//Se ubica la palabra horizontalmente
function xUbicacion(cor, palabra) {
   let empezar = cor.row * game.c + cor.col;
   let okayCounter = 0;
   let indexColocado = [];
   for (let i = 0; i < palabra.length; i++) {
      if (game.arr[empezar + i] == '-') {
         okayCounter++;
      }
   }
   if (okayCounter == palabra.length) {
      for (let i = 0; i < palabra.length; i++) {
         if (game.arr[empezar + i] == '-') {
            game.arr[empezar + i] = palabra[i];
            indexColocado.push(empezar + i);
         }
      }
      return indexColocado;
   }
   return false;
}

//Funcion que devuelve el valor incial en donde va a ser ubicada la palabra
function buscarPosicionInicial(palabraVal, totalVal) {
   return Math.floor(Math.random() * (totalVal - palabraVal + 1));
}

function construirTablero() {
   elementos.gridContenedor.innerHTML = '';
   game.arr.forEach((ele, index) => {
      let div = document.createElement('div');
      div.textContent = ele;
      div.classList.add('grid-elemento');
      elementos.gridContenedor.append(div);
      div.addEventListener('click', (e) => {
         console.log(index);
         console.log(game.arr[index]);
         game.tableroArray[index] = true;
         let chequeado = { found: 0, word: '' };
         game.palabrasColocadas.forEach((w) => {
            if (w.pos.includes(index)) {
               chequeado.found++;
               chequeado.word = w.palabra;
            }
            console.log(chequeado);
         });
         //Colorea la letra en verde si es correcta o roja si es incorrecta
         if (chequeado.found > 0) {
            div.style.backgroundColor = 'green';
         } else {
            div.style.backgroundColor = 'red';
         }
         palabraEncontradaChequear();
      });
   });
}

//Esta funcion tacha las palabras encontradas con una linea roja
function palabraEncontradaChequear() {
   game.palabrasColocadas.forEach((w, ind) => {
      //console.log(w.pos);
      let chequeado = 0;
      game.tableroArray.forEach((val, index) => {
         // console.log(val);
         if (w.pos.includes(index)) {
            chequeado++;
         }
      });
      if (chequeado == w.palabra.length) {
         w.ele.style.color = 'red';
         w.ele.style.textDecoration = 'line-through';
      }
   });
   ganadorChequear();
}

//Funcion que anuncia si ganaste
function ganadorChequear() {
   let counter = 0;
   game.palabrasColocadas.forEach((w, ind) => {
      if (w.ele.style.textDecoration == 'line-through') {
         counter++;
      }
   });
   if (game.palabrasColocadas.length - counter == 0 || game.palabrasColocadas.length == 0) {
      elementos.ganaste = document.createElement('img');
      //Cambiar esta linea para cambiar la imagen
      elementos.ganaste.src = 'img/ganaste.png';
      //Ancho de la imagen
      elementos.ganaste.style.width = '250px';
      elementos.areaJuego.insertAdjacentElement('afterbegin', elementos.ganaste);
   }
}
