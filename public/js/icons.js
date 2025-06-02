// Criar ícones para as caixas de fibra óptica
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');

// Função para criar ícones coloridos
function createIcon(color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar caixa
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(4, 8, 24, 20, 3);
    ctx.fill();
    
    // Desenhar detalhes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(10, 12, 12, 2);
    ctx.rect(10, 16, 12, 2);
    ctx.rect(10, 20, 12, 2);
    ctx.fill();
    
    // Desenhar "antena"
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(14, 2, 4, 6);
    ctx.fill();
    
    return canvas.toDataURL();
}

// Criar ícones para diferentes tipos de caixas
const iconBlue = createIcon('#3498db');
const iconRed = createIcon('#e74c3c');
const iconGreen = createIcon('#2ecc71');
const iconYellow = createIcon('#f1c40f');

// Salvar ícones como imagens
function saveIcons() {
    const iconLinks = {
        'icon-blue': iconBlue,
        'icon-red': iconRed,
        'icon-green': iconGreen,
        'icon-yellow': iconYellow
    };
    
    for (const [name, dataUrl] of Object.entries(iconLinks)) {
        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Exportar funções
window.createIcon = createIcon;
window.saveIcons = saveIcons;
