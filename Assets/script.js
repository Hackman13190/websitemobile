/*TOGGLE-SLIDER*/
document.addEventListener('DOMContentLoaded', function () {
    // Initialiser l'état au chargement de la page
    const textOption = document.getElementById("textOption");
    const fileOption = document.getElementById("fileOption");
    const slider = document.getElementById("toggleSlider");

    if (!textOption.classList.contains("active") && !fileOption.classList.contains("active")) {
        textOption.classList.add("active");
        slider.style.transform = "translateX(0)";
    }
});

function toggleOptions() {
    const textOption = document.getElementById("textOption");
    const fileOption = document.getElementById("fileOption");
    const slider = document.getElementById("toggleSlider");
    const encryptButton = document.querySelector('.login-btn[value="Encrypt"]');
    const decryptButton = document.querySelector('.login-btn[value="Decrypt"]');
    const userInput = document.getElementById("userInput");
    const fileDropArea = document.getElementById("fileDropArea");
    const copytext = document.getElementById("copyText");

    if (textOption.classList.contains("active")) {
        textOption.classList.remove("active");
        fileOption.classList.add("active");
        slider.style.transform = "translateX(100%)";
        chiffrementTitle.textContent = "File encryption";
        encryptButton.setAttribute("onclick", "encryptFile()");
        decryptButton.setAttribute("onclick", "decryptFile()");
        userInput.style.display = "none";
        copytext.style.display = "none";
        fileDropArea.style.display = "block"; //
    } else {
        fileOption.classList.remove("active");
        textOption.classList.add("active");
        slider.style.transform = "translateX(0)";
        chiffrementTitle.textContent = "Text encryption";
        encryptButton.setAttribute("onclick", "cryptText()");
        decryptButton.setAttribute("onclick", "decryptText()");
        userInput.style.display = "block";
        copytext.style.display = "block";
        fileDropArea.style.display = "none";
    }
}

// Reste du code...

function copyToClipboard() {
    const textarea = document.getElementById("userInput");

    if (textarea) {
        textarea.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges(); // Désélectionne le texte
    }
}



/*EYE PASSWORD*/
const passwordInput = document.getElementById("pass");
const eyeIcon = document.getElementById("eye");

eyeIcon.addEventListener("click", () => {
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    eyeIcon.src = isPasswordVisible ? "/Images/red_eye.png" : "/Images/green_eye.png";
});




























































function readFile() {
    return new Promise((resolve, reject) => {
        var fileInput = document.getElementById('fileInput');
        
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            
            reader.onload = function(e) {
                var arrayBuffer = e.target.result;
                
                // Traitement des données binaires (arrayBuffer)
                console.log(arrayBuffer); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                resolve(arrayBuffer);
            };
            
            reader.onerror = function(e) {
                reject(e);
            };
            
            reader.readAsArrayBuffer(file);
        } else {
            console.log("No file selected."); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            reject("No file selected.");
        }
    });
}

async function encryptDataFile(t, p, fileName) {
    const e = new TextEncoder(),
        d = e.encode(t),
        s = crypto.getRandomValues(new Uint8Array(256)),
        k = await deriveKeyMaterial(p, s),
        i = crypto.getRandomValues(new Uint8Array(12)),
        c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: i }, k, d),
        u = new Uint8Array([...s, ...i, ...new Uint8Array(c)]),
        b = btoa(String.fromCharCode.apply(null, u));

    // Création d'un fichier binaire à partir du arrayBuffer chiffré
    var blob = new Blob([b], {type: "application/octet-stream"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + ".enc";
    link.click();
}

async function decryptDataFile(e, p, fileName) {
    const t = new Uint8Array(atob(e).split('').map((char) => char.charCodeAt(0))),
        s = t.slice(0, 256),
        i = t.slice(256, 268),
        c = t.slice(268),
        k = await deriveKeyMaterial(p, s);
    //début-erreur
    const d = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: i }, k, c),
        u = new TextDecoder(),
        b = u.decode(d);
    //fin-erreur
    // Création d'un fichier binaire à partir du arrayBuffer déchiffré
    var blob = new Blob([b], {type: "application/octet-stream"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName.replace('.enc', '');
    link.click();
}



async function encryptFile() {
    try {
        const fileInput = document.getElementById('fileInput');
        const fileName = fileInput.files[0].name;
        const t = await readFile();
        const p = document.getElementById("pass").value;
        encryptDataFile(t, p, fileName);
    } catch (error) {
        console.error("An unexpected error occurred.\nPlease retry and check for any mistakes.\nIf the issue persists, please contact us.");
        alert("Verify that the file is properly loaded and valid.\nIf the issue persists, please contact us.")
        enblinkButton();
    }
}


async function decryptFile() {
    try {
        const fileInput = document.getElementById('fileInput');
        const fileName = fileInput.files[0].name;
        const arrayBuffer = await readFile();
        const t = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        const p = document.getElementById("pass").value;
        decryptDataFile(t, p, fileName);
    } catch (error) {
        console.error("An unexpected error occurred.\nPlease retry and check for any mistakes.\nIf the issue persists, please contact us.");
        alert("Verify that the file is properly loaded, the key is correct, and the file has not been modified.\nIf the issue persists, please contact us.")
        blinkButton();
    }
}



















































































// Fonction pour envoyer la requête
async function encrypt(t, p) {
    try {
        const e = new TextEncoder(),
            d = e.encode(t),
            s = crypto.getRandomValues(new Uint8Array(256)),
            k = await deriveKeyMaterial(p, s),
            i = crypto.getRandomValues(new Uint8Array(12)),
            c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: i }, k, d),
            u = new Uint8Array([...s, ...i, ...new Uint8Array(c)]),
            b = btoa(String.fromCharCode.apply(null, u));
        document.getElementById("userInput").value = b;
    } catch (error) {
        console.error("An unexpected error occurred.\nPlease retry and check for any mistakes.\nIf the issue persists, please contact us.");
        alert("Verify that the text is properly loaded.\nIf the issue persists, please contact us.")
        enblinkButton();
    }
}

async function decrypt(e, p) {
    try {
        const t = new Uint8Array(atob(e).split('').map((char) => char.charCodeAt(0))),
            s = t.slice(0, 256),
            i = t.slice(256, 268),
            c = t.slice(268),
            k = await deriveKeyMaterial(p, s);
        const d = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: i }, k, c),
            u = new TextDecoder();
        document.getElementById("userInput").value = u.decode(d);
    } catch (error) {
        console.error("An unexpected error occurred.\nPlease retry and check for any mistakes.\nIf the issue persists, please contact us.");
        alert("Verify that the text is properly loaded, the key is correct, and the text has not been modified.\nIf the issue persists, please contact us.")
        blinkButton();
    }
}

async function deriveKeyMaterial(p, s) {
    const e = new TextEncoder(), d = e.encode(p),
        k = await crypto.subtle.importKey('raw', d, { name: 'PBKDF2' }, !1, ['deriveBits', 'deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: s, iterations: 1e6, hash: 'SHA-256' },
        k, { name: 'AES-GCM', length: 256 }, !0, ['encrypt', 'decrypt']);
}






















function cryptText() {
    new Promise(r => setTimeout(r, 100));
    const t = document.getElementById("userInput").value,
        p = document.getElementById("pass").value;
    encrypt(t, p);
}

function decryptText() {
    new Promise(r => setTimeout(r, 100));
    const t = document.getElementById("userInput").value,
        p = document.getElementById("pass").value;
    decrypt(t, p);
}






function blinkButton() {
    const decryptButton = document.querySelector('.login-btn[value="Decrypt"]');

    // Add the blink class to the button
    decryptButton.classList.add('blink');

    // Remove the blink class after the animation completes
    setTimeout(() => {
        decryptButton.classList.remove('blink');
    }, 1000); // Adjust the duration based on your animation time
}

function enblinkButton() {
    const encryptButton = document.querySelector('.login-btn[value="Encrypt"]');

    // Add the blink class to the button
    encryptButton.classList.add('blink');

    // Remove the blink class after the animation completes
    setTimeout(() => {
        encryptButton.classList.remove('blink');
    }, 1000); // Adjust the duration based on your animation time
}






function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
}

function selectFile() {
    document.getElementById('fileInput').click();
}

function handleFileSelect() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length > 0) {
        // Appeler votre fonction de traitement de fichiers
        handleFiles(files);

        fileInput.disabled = true;
    }
}


function handleFiles(files) {
    const selectedFileName = document.getElementById('selectedFileName');
    const filePreview = document.getElementById('filePreview');
    const fileDrop = document.getElementById('fileDropArea');

    for (const file of files) {
        console.log('Selected file:', file.name); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        selectedFileName.innerText = file.name;

        // Afficher l'aperçu si le fichier est une image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                filePreview.src = e.target.result;
                filePreview.style.display = 'block';
                selectedFileName.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            filePreview.src = './Images/file_ico.png'; 
            filePreview.style.display = 'block';
            selectedFileName.style.display = 'block';
        }
    }

    updateFileDropAttributes();
}




// Fonction pour obtenir le nombre de documents présents
function getNumberOfDocuments() {
    return 1;
}

// Fonction pour mettre à jour les attributs en fonction du nombre de documents
function updateFileDropAttributes() {
    const fileDropArea = document.getElementById('fileDropArea');
    const numberOfDocuments = getNumberOfDocuments();
    const fileDrop = document.getElementById("areaDrop");
    const clearAllFileButton = document.getElementById('clearAllFile');

    if (numberOfDocuments >= 1) {
        // Si vous avez déjà 1 document ou plus
        fileDropArea.removeAttribute('ondrop');
        fileDropArea.removeAttribute('ondragover');
        fileDropArea.removeAttribute('onclick');
        fileDrop.style.display = "none";
        clearAllFileButton.style.display = 'block'; 
    } else {
        // Si vous avez moins de 1 document
        fileDropArea.setAttribute('ondrop', 'handleDrop(event)');
        fileDropArea.setAttribute('ondragover', 'handleDragOver(event)');
        fileDropArea.setAttribute('onclick', 'selectFile()');
        fileDrop.style.display = "block";
        clearAllFileButton.style.display = 'none'; 
    }
}


function clearAllFile() {
    location.reload();
}