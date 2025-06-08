// Variables globales
let userImage = null;
let frameImage = null;
let canvas = null;
let ctx = null;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let imageScale = 1;
let imageX = 0;
let imageY = 0;
let canvasWidth = 600;
let canvasHeight = 600;

// Estado de la aplicación
const appState = {
    fullName: '',
    selectedDance: '',
    otherDance: '',
    imageLoaded: false,
    frameLoaded: false
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Obtener referencias a elementos del DOM
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext('2d');
    
    // Configurar canvas
    setupCanvas();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar el marco
    loadFrameImage();
    
    console.log('Aplicación Danzarín inicializada correctamente');
}

function setupCanvas() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Dibujar fondo inicial
    drawInitialCanvas();
}

function setupEventListeners() {
    // Formulario
    const fullNameInput = document.getElementById('fullName');
    const danceSelect = document.getElementById('danceSelect');
    const otherDanceGroup = document.getElementById('otherDanceGroup');
    const otherDanceInput = document.getElementById('otherDance');
    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    const downloadBtn = document.getElementById('downloadBtn');

    // Eventos del formulario
    fullNameInput.addEventListener('input', function() {
        appState.fullName = this.value;
        updateCanvas();
    });

    danceSelect.addEventListener('change', function() {
        const value = this.value;
        appState.selectedDance = value;
        
        // Mostrar/ocultar campo "otro"
        if (value === 'otro') {
            otherDanceGroup.style.display = 'block';
            otherDanceInput.required = true;
        } else {
            otherDanceGroup.style.display = 'none';
            otherDanceInput.required = false;
            appState.otherDance = '';
        }
        
        updateCanvas();
    });

    otherDanceInput.addEventListener('input', function() {
        appState.otherDance = this.value;
        updateCanvas();
    });

    // Eventos de carga de imagen
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });

    // Eventos del canvas
    setupCanvasEvents();

    // Evento de descarga
    downloadBtn.addEventListener('click', downloadImage);
}

function setupCanvasEvents() {
    // Mouse events
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);
    canvas.addEventListener('wheel', handleZoom);

    // Touch events para móvil
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });

    // Gestos de zoom en móvil
    let initialDistance = 0;
    let initialScale = 1;

    canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialScale = imageScale;
        }
    });

    canvas.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scale = (currentDistance / initialDistance) * initialScale;
            imageScale = Math.max(0.1, Math.min(5, scale));
            updateCanvas();
        }
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Por favor, selecciona una imagen menor a 10MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            userImage = img;
            appState.imageLoaded = true;
            
            // Centrar y ajustar la imagen
            resetImagePosition();
            updateCanvas();
            updateDownloadButton();
            
            console.log('Imagen cargada correctamente:', img.width, 'x', img.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function loadFrameImage() {
    const img = new Image();
    img.onload = function() {
        frameImage = img;
        appState.frameLoaded = true;
        updateCanvas();
        console.log('Marco cargado correctamente');
    };
    img.onerror = function() {
        console.error('Error al cargar el marco');
        // Crear un marco simple si no se puede cargar
        createSimpleFrame();
    };
    img.src = 'assets/marco.png';
}

function createSimpleFrame() {
    // Crear un canvas temporal para dibujar un marco simple
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 600;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Dibujar marco dorado simple
    tempCtx.strokeStyle = '#D4AF37';
    tempCtx.lineWidth = 20;
    tempCtx.strokeRect(10, 10, 580, 580);
    
    // Añadir decoraciones
    tempCtx.strokeStyle = '#B22222';
    tempCtx.lineWidth = 5;
    tempCtx.strokeRect(25, 25, 550, 550);
    
    // Convertir a imagen
    frameImage = new Image();
    frameImage.onload = function() {
        appState.frameLoaded = true;
        updateCanvas();
    };
    frameImage.src = tempCanvas.toDataURL();
}

function resetImagePosition() {
    if (!userImage) return;
    
    // Calcular escala para ajustar la imagen al canvas
    const scaleX = canvasWidth / userImage.width;
    const scaleY = canvasHeight / userImage.height;
    imageScale = Math.min(scaleX, scaleY) * 0.8; // 80% del tamaño para dejar espacio
    
    // Centrar la imagen
    imageX = (canvasWidth - userImage.width * imageScale) / 2;
    imageY = (canvasHeight - userImage.height * imageScale) / 2;
}

function startDrag(e) {
    if (!userImage) return;
    
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    canvas.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging || !userImage) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = currentX - lastX;
    const deltaY = currentY - lastY;
    
    imageX += deltaX;
    imageY += deltaY;
    
    lastX = currentX;
    lastY = currentY;
    
    updateCanvas();
}

function endDrag() {
    isDragging = false;
    canvas.style.cursor = 'move';
}

function handleZoom(e) {
    if (!userImage) return;
    
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = imageScale * zoomFactor;
    
    // Limitar el zoom
    if (newScale >= 0.1 && newScale <= 5) {
        // Ajustar posición para zoom centrado en el mouse
        imageX = mouseX - (mouseX - imageX) * zoomFactor;
        imageY = mouseY - (mouseY - imageY) * zoomFactor;
        imageScale = newScale;
        
        updateCanvas();
    }
}

function drawInitialCanvas() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#F8F6F0');
    gradient.addColorStop(1, '#E8E6E0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Texto de instrucciones
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Carga tu imagen para comenzar', canvasWidth / 2, canvasHeight / 2);
}

function updateCanvas() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Fondo
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#F8F6F0');
    gradient.addColorStop(1, '#E8E6E0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Dibujar imagen del usuario si está cargada
    if (userImage && appState.imageLoaded) {
        ctx.save();
        ctx.drawImage(
            userImage,
            imageX,
            imageY,
            userImage.width * imageScale,
            userImage.height * imageScale
        );
        ctx.restore();
    }
    
    // Dibujar marco si está cargado
    if (frameImage && appState.frameLoaded) {
        ctx.drawImage(frameImage, 0, 0, canvasWidth, canvasHeight);
    }
    
    // Dibujar texto
    drawText();
}

function drawText() {
    const textX = 20; // Posición centrada a la izquierda
    let textY = 350; // Posición inicial
    const lineHeight = 20;
    
    ctx.textAlign = 'left';
    
    // Nombre y apellido
    if (appState.fullName.trim()) {
        const names = appState.fullName.trim().split(' ');
        
        ctx.font = 'bold 30px Arial';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0;
        ctx.fillStyle = '#FFFFFF';
        
        // Dibujar cada palabra en línea separada
        names.forEach((name) => {
            // Contorno negro
            ctx.strokeText(name.toUpperCase(), textX, textY);
            // Texto blanco
            ctx.fillText(name.toUpperCase(), textX, textY);
            textY += lineHeight;
        });
        
        textY += 2; // Espacio extra
    }
    
    // Etiqueta "DANZA:"
    ctx.font = 'bold 30px Arial';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0;
    ctx.fillStyle = '#FFD700'; // Amarillo
    
    ctx.strokeText('DANZA:', textX, textY);
    ctx.fillText('DANZA:', textX, textY);
    textY += lineHeight;
    
    // Nombre de la danza
    const danceText = getDanceText();
    if (danceText) {
        ctx.font = 'bold 30px Arial';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFFFFF';
        
        // Dividir texto largo en múltiples líneas
        const words = danceText.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > 10 && currentLine) {
                // Dibujar línea actual
                ctx.strokeText(currentLine.toUpperCase(), textX, textY);
                ctx.fillText(currentLine.toUpperCase(), textX, textY);
                textY += lineHeight;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        // Dibujar última línea
        if (currentLine) {
            ctx.strokeText(currentLine.toUpperCase(), textX, textY);
            ctx.fillText(currentLine.toUpperCase(), textX, textY);
        }
    }
}

function getDanceText() {
    if (appState.selectedDance === 'otro' && appState.otherDance.trim()) {
        return appState.otherDance.trim();
    } else if (appState.selectedDance && appState.selectedDance !== 'otro') {
        return appState.selectedDance;
    }
    return '';
}

function updateDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    const hasRequiredData = appState.fullName.trim() && 
                           (appState.selectedDance && appState.selectedDance !== '') &&
                           (appState.selectedDance !== 'otro' || appState.otherDance.trim()) &&
                           appState.imageLoaded;
    
    downloadBtn.disabled = !hasRequiredData;
}

function downloadImage() {
    if (!appState.imageLoaded) {
        alert('Por favor, carga una imagen primero.');
        return;
    }
    
    if (!appState.fullName.trim()) {
        alert('Por favor, ingresa tu nombre y apellido.');
        return;
    }
    
    if (!appState.selectedDance) {
        alert('Por favor, selecciona una danza.');
        return;
    }
    
    if (appState.selectedDance === 'otro' && !appState.otherDance.trim()) {
        alert('Por favor, especifica el nombre de la danza.');
        return;
    }
    
    // Crear canvas de alta resolución
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    const finalSize = 2000;
    
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    
    // Escalar todos los elementos proporcionalmente
    const scaleFactor = finalSize / canvasWidth;
    
    // Fondo
    const gradient = finalCtx.createLinearGradient(0, 0, finalSize, finalSize);
    gradient.addColorStop(0, '#F8F6F0');
    gradient.addColorStop(1, '#E8E6E0');
    finalCtx.fillStyle = gradient;
    finalCtx.fillRect(0, 0, finalSize, finalSize);
    
    // Imagen del usuario escalada
    if (userImage) {
        finalCtx.drawImage(
            userImage,
            imageX * scaleFactor,
            imageY * scaleFactor,
            userImage.width * imageScale * scaleFactor,
            userImage.height * imageScale * scaleFactor
        );
    }
    
    // Marco escalado
    if (frameImage) {
        finalCtx.drawImage(frameImage, 0, 0, finalSize, finalSize);
    }
    
    // Texto escalado
    drawTextOnCanvas(finalCtx, scaleFactor);
    
    // Generar nombre del archivo
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const fileName = `SERGIO_VARGAS_GESTION_FUL_USFX_NACER_${randomNumber}.png`;
    
    // Descargar
    finalCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Redirección automática
        setTimeout(() => {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSeTfMtTzWq7LVPUl8tJ5lIt2DnlISnz192LWabErIw70FN-wA/viewform?usp=header', '_blank');
        }, 1000);
    }, 'image/png');
}

function drawTextOnCanvas(ctx, scaleFactor) {
    const textX = 20 * scaleFactor;
    let textY = 350 * scaleFactor;
    const lineHeight = 20 * scaleFactor;
    
    ctx.textAlign = 'left';
    
    // Nombre y apellido
    if (appState.fullName.trim()) {
        const names = appState.fullName.trim().split(' ');
        
        ctx.font = `bold ${28 * scaleFactor}px Arial`;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3 * scaleFactor;
        ctx.fillStyle = '#FFFFFF';
        
        names.forEach((name) => {
            ctx.strokeText(name.toUpperCase(), textX, textY);
            ctx.fillText(name.toUpperCase(), textX, textY);
            textY += lineHeight;
        });
        
        textY += 20 * scaleFactor;
    }
    
    // Etiqueta "DANZA:"
    ctx.font = `bold ${24 * scaleFactor}px Arial`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scaleFactor;
    ctx.fillStyle = '#FFD700';
    
    ctx.strokeText('DANZA:', textX, textY);
    ctx.fillText('DANZA:', textX, textY);
    textY += lineHeight;
    
    // Nombre de la danza
    const danceText = getDanceText();
    if (danceText) {
        ctx.font = `bold ${26 * scaleFactor}px Arial`;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3 * scaleFactor;
        ctx.fillStyle = '#FFFFFF';
        
        const words = danceText.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > 300 * scaleFactor && currentLine) {
                ctx.strokeText(currentLine.toUpperCase(), textX, textY);
                ctx.fillText(currentLine.toUpperCase(), textX, textY);
                textY += lineHeight;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            ctx.strokeText(currentLine.toUpperCase(), textX, textY);
            ctx.fillText(currentLine.toUpperCase(), textX, textY);
        }
    }
}

// Event listeners adicionales para actualizar el botón de descarga
document.getElementById('fullName').addEventListener('input', updateDownloadButton);
document.getElementById('danceSelect').addEventListener('change', updateDownloadButton);
document.getElementById('otherDance').addEventListener('input', updateDownloadButton);
