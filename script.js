let jugador = "";
let vidas = 3;
let nivel = 1;
let puntos = 0;
let companero = null;
let malo = null;
let juegoActivo = true;

const container = document.getElementById("gameContainer");

function playSound(type) {
    try {
        if (type === "correct") {
            const sound = document.getElementById("correctSound");
            if (sound) sound.play().catch(e => console.log("Error"));
        } else if (type === "wrong") {
            const sound = document.getElementById("wrongSound");
            if (sound) sound.play().catch(e => console.log("Error"));
        }
    } catch(e) {}
}

function mostrarEstado() {
    let corazones = "";
    for(let i = 0; i < vidas; i++) corazones += "❤️";
    for(let i = vidas; i < 3; i++) corazones += "🖤";
    
    return `
        <div class="status-bar">
            <div>${jugador}</div>
            <div class="hearts">${corazones}</div>
            <div>Nivel ${nivel}/4</div>
            <div>Puntos: ${puntos}</div>
            ${companero ? `<div>Compañero: ${companero.nombreMostrar}</div>` : ''}
        </div>
    `;
}

function mostrarBienvenida() {
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>El Bosque de las Sombras</h1>
            <div class="scene-image">
                <img src="bosque.jpg" alt="Bosque">
            </div>
            <h2>Bienvenido, valiente viajero</h2>
            <p>¿Cuál es tu nombre?</p>
            <input type="text" id="nombreInput" placeholder="Escribe tu nombre..." maxlength="20">
            <br>
            <button id="btnComenzar">Comenzar Aventura</button>
        </div>
    `;
    
    document.getElementById("btnComenzar").onclick = iniciarJuego;
    const input = document.getElementById("nombreInput");
    if(input) input.onkeypress = (e) => { if(e.key === "Enter") iniciarJuego(); };
}

function iniciarJuego() {
    const nombreInput = document.getElementById("nombreInput");
    if (!nombreInput.value.trim()) {
        alert("Por favor, ingresa tu nombre");
        return;
    }
    
    jugador = nombreInput.value.trim();
    vidas = 3;
    nivel = 1;
    puntos = 0;
    juegoActivo = true;
    companero = null;
    malo = Math.floor(Math.random() * 2);
    
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Música no disponible"));
    }
    
    mostrarNivel1();
}

function mostrarNivel1() {
    nivel = 1;
    const esZuriBueno = (malo !== 0);
    const esKiroBueno = (malo !== 1);
    
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="bosque.jpg" alt="Bosque">
            </div>
            ${mostrarEstado()}
            <div class="story-text">
                <p>${jugador}, antes de entrar al bosque debes elegir un compañero</p>
                <p>Cuidado: Uno de ellos es un TRAIDOR</p>
                <p>El traidor cambia cada partida, elige con cuidado</p>
            </div>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <div class="companion-card" id="elegirZuri">
                    <img src="zuri.jpg" alt="Zuri">
                    <h3>Zuri</h3>
                    <p>Zorro astuto y veloz</p>
                </div>
                <div class="companion-card" id="elegirKiro">
                    <img src="kiro.jpg" alt="Kiro">
                    <h3>Kiro</h3>
                    <p>Ave misteriosa y sabia</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById("elegirZuri").onclick = () => seleccionarCompanero("Zuri", esZuriBueno);
    document.getElementById("elegirKiro").onclick = () => seleccionarCompanero("Kiro", esKiroBueno);
}

function seleccionarCompanero(nombre, esBueno) {
    companero = {
        nombre: nombre,
        esBueno: esBueno,
        nombreMostrar: nombre
    };
    
    let historia = "";
    if (esBueno) {
        playSound("correct");
        puntos += 20;
        historia = `Excelente elección, ${jugador}!<br><br>
        ${companero.nombreMostrar} es un compañero LEAL.<br><br>
        +20 puntos`;
    } else {
        playSound("wrong");
        puntos = Math.max(0, puntos - 5);
        historia = `Oh no, ${jugador}!<br><br>
        ${companero.nombreMostrar} es el TRAIDOR.<br><br>
        -5 puntos`;
    }
    
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="bosque.jpg" alt="Bosque">
            </div>
            ${mostrarEstado()}
            <div class="story-text">${historia}</div>
            <div class="choices">
                <button class="continue-btn" id="btnContinuarNivel1">Continuar</button>
            </div>
        </div>
    `;
    
    document.getElementById("btnContinuarNivel1").onclick = () => {
        nivel = 2;
        mostrarNivel2();
    };
}

function mostrarNivel2() {
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="cruce.jpg" alt="Cruce de Caminos">
            </div>
            ${mostrarEstado()}
            <div class="story-text">
                <p>Llegas a un CRUCE DE CAMINOS</p>
                <p>${companero.esBueno ? 
                    `${companero.nombreMostrar}: "El camino de la derecha es más seguro"` : 
                    `${companero.nombreMostrar}: "Ve por la izquierda"`}</p>
            </div>
            <div class="choices">
                <button id="caminoIzquierda">Camino Izquierdo</button>
                <button id="caminoDerecha">Camino Derecho</button>
            </div>
        </div>
    `;
    
    document.getElementById("caminoIzquierda").onclick = () => procesarCruce("izquierda", !companero.esBueno);
    document.getElementById("caminoDerecha").onclick = () => procesarCruce("derecha", companero.esBueno);
}

function procesarCruce(camino, esCorrecto) {
    let historia = "";
    if (esCorrecto) {
        playSound("correct");
        puntos += 30;
        vidas = Math.min(vidas + 1, 5);
        historia = `Decisión correcta!<br><br>
        Tomaste el camino ${camino === 'izquierda' ? 'izquierdo' : 'derecho'}.<br><br>
        +30 puntos<br>
        +1 vida`;
    } else {
        playSound("wrong");
        puntos = Math.max(0, puntos - 10);
        vidas--;
        historia = `Mala decisión!<br><br>
        El camino ${camino === 'izquierda' ? 'izquierdo' : 'derecho'} era una trampa.<br><br>
        -10 puntos<br>
        -1 vida`;
    }
    
    if (vidas <= 0) {
        gameOver(false);
        return;
    }
    
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="cruce.jpg" alt="Cruce de Caminos">
            </div>
            ${mostrarEstado()}
            <div class="story-text">${historia}</div>
            <div class="choices">
                <button class="continue-btn" id="btnSiguienteNivel2">Continuar</button>
            </div>
        </div>
    `;
    
    document.getElementById("btnSiguienteNivel2").onclick = () => {
        nivel = 3;
        mostrarNivel3();
    };
}

function mostrarNivel3() {
    const opcionCorrecta = Math.random() < 0.5;
    
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="rio.jpg" alt="Río">
            </div>
            ${mostrarEstado()}
            <div class="story-text">
                <p>Un RÍO CAUDALOSO bloquea tu paso</p>
                <p>${companero.esBueno ? 
                    `${companero.nombreMostrar}: "Confía en tu instinto"` : 
                    `${companero.nombreMostrar}: "Cualquier camino sirve"`}</p>
            </div>
            <div class="choices">
                <button id="opcionRio">Cruzar nadando</button>
                <button id="opcionPuente">Cruzar por el puente</button>
            </div>
        </div>
    `;
    
    document.getElementById("opcionRio").onclick = () => procesarRio("nadando", opcionCorrecta);
    document.getElementById("opcionPuente").onclick = () => procesarRio("puente", !opcionCorrecta);
}

function procesarRio(opcion, esCorrecto) {
    let historia = "";
    if (esCorrecto) {
        playSound("correct");
        puntos += 30;
        historia = `Decisión correcta!<br><br>
        Cruzaste por ${opcion}.<br><br>
        +30 puntos`;
    } else {
        playSound("wrong");
        puntos = Math.max(0, puntos - 15);
        vidas--;
        historia = `Mala decisión!<br><br>
        ${opcion} era peligroso.<br><br>
        -15 puntos<br>
        -1 vida`;
    }
    
    if (vidas <= 0) {
        gameOver(false);
        return;
    }
    
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="rio.jpg" alt="Río">
            </div>
            ${mostrarEstado()}
            <div class="story-text">${historia}</div>
            <div class="choices">
                <button class="continue-btn" id="btnSiguienteNivel3">Continuar</button>
            </div>
        </div>
    `;
    
    document.getElementById("btnSiguienteNivel3").onclick = () => {
        nivel = 4;
        mostrarNivel4();
    };
}

function mostrarNivel4() {
    container.innerHTML = `
        <div class="game-screen">
            <div class="scene-image">
                <img src="templo.jpg" alt="Templo">
            </div>
            ${mostrarEstado()}
            <div class="story-text">
                <p>TEMPLO SAGRADO</p>
                <p>${companero.esBueno ? 
                    `${companero.nombreMostrar}: "Responde con sabiduría"` : 
                    `${companero.nombreMostrar}: "Responde cualquier cosa"`}</p>
                <p style="margin-top: 15px; font-size: 1.3em; color: #ffd700;">ADIVINANZA</p>
                <p style="font-size: 1.2em;">"¿Qué se moja mientras más seca está?"</p>
                <input type="text" id="respuestaInput" placeholder="Tu respuesta...">
                <br>
                <button id="btnResponder">Responder</button>
            </div>
        </div>
    `;
    
    document.getElementById("btnResponder").onclick = () => {
        const input = document.getElementById("respuestaInput");
        const respuesta = input ? input.value.trim().toLowerCase() : "";
        
        if (respuesta === "toalla") {
            playSound("correct");
            puntos += 50;
            gameOver(true);
        } else {
            playSound("wrong");
            vidas--;
            if (vidas <= 0) {
                gameOver(false);
            } else {
                const historiaError = `Respuesta incorrecta. Te quedan ${vidas} vidas.`;
                container.innerHTML = `
                    <div class="game-screen">
                        <div class="scene-image">
                            <img src="templo.jpg" alt="Templo">
                        </div>
                        ${mostrarEstado()}
                        <div class="story-text">${historiaError}</div>
                        <div class="choices">
                            <button class="continue-btn" id="btnReintentar">Intentar de nuevo</button>
                        </div>
                    </div>
                `;
                document.getElementById("btnReintentar").onclick = () => mostrarNivel4();
            }
        }
    };
}

function gameOver(gano) {
    juegoActivo = false;
    playSound("wrong");
    
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
    
    let titulo = "";
    let mensaje = "";
    
    if (gano) {
        titulo = "VICTORIA!";
        mensaje = `Felicidades ${jugador}!<br><br>
        Has llegado al corazón del bosque.<br><br>
        Puntuación final: ${puntos} puntos`;
    } else {
        titulo = "GAME OVER";
        mensaje = `${jugador}, la oscuridad del bosque te ha consumido.<br><br>
        Puntuación final: ${puntos} puntos`;
    }
    
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>${titulo}</h1>
            <div class="scene-image">
                <img src="templo.jpg" alt="Templo">
            </div>
            <div class="story-text">
                <p>${mensaje}</p>
                <p>Niveles completados: ${gano ? 4 : nivel-1}/4</p>
                ${companero ? `<p>Compañero: ${companero.nombreMostrar}</p>` : ''}
            </div>
            <button class="restart-btn" id="btnReiniciar">Jugar de Nuevo</button>
        </div>
    `;
    
    document.getElementById("btnReiniciar").onclick = () => {
        const bgMusic = document.getElementById("bgMusic");
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
        mostrarBienvenida();
    };
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarBienvenida();
});