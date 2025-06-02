// Inicialização do mapa
let map;
let selectedLocation = null;
let addingBoxMode = false;
let markers = [];

// Ícones personalizados
const icons = {
    'icon-blue': L.icon({
        iconUrl: '/images/icon-blue.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    'icon-red': L.icon({
        iconUrl: '/images/icon-red.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    'icon-green': L.icon({
        iconUrl: '/images/icon-green.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    'icon-yellow': L.icon({
        iconUrl: '/images/icon-yellow.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })
};

// Inicializar o mapa quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    checkAuthStatus();
});

// Função para inicializar o mapa
function initMap() {
    // Criar o mapa centrado no Brasil
    map = L.map('map').setView([-15.7801, -47.9292], 5);
    
    // Adicionar camada de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Adicionar evento de clique no mapa
    map.on('click', handleMapClick);
    
    // Carregar caixas existentes
    loadBoxes();
}

// Função para lidar com cliques no mapa
function handleMapClick(e) {
    if (addingBoxMode) {
        selectedLocation = e.latlng;
        document.getElementById('boxLatitude').value = selectedLocation.lat;
        document.getElementById('boxLongitude').value = selectedLocation.lng;
        document.getElementById('selectedLocation').textContent = 
            `Latitude: ${selectedLocation.lat.toFixed(6)}, Longitude: ${selectedLocation.lng.toFixed(6)}`;
    }
}

// Função para carregar caixas do servidor
function loadBoxes() {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Usuário não autenticado');
        return;
    }
    
    // Limpar marcadores existentes
    clearMarkers();
    
    // Fazer requisição para obter caixas
    fetch('/api/boxes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar caixas');
        }
        return response.json();
    })
    .then(data => {
        // Adicionar marcadores para cada caixa
        data.forEach(box => {
            addMarkerToMap(box);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar caixas:', error);
    });
}

// Função para adicionar marcador ao mapa
function addMarkerToMap(box) {
    const icon = icons[box.icon] || icons['icon-blue'];
    
    const marker = L.marker([box.latitude, box.longitude], { icon: icon })
        .addTo(map)
        .bindPopup(`
            <strong>${box.name}</strong><br>
            Tipo: ${box.type}<br>
            Status: ${box.status}<br>
            <button onclick="showBoxDetails(${box.id})">Ver Detalhes</button>
        `);
    
    marker.boxId = box.id;
    markers.push(marker);
    
    // Adicionar evento de clique no marcador
    marker.on('click', () => {
        showBoxInfo(box);
    });
}

// Função para mostrar informações da caixa no painel lateral
function showBoxInfo(box) {
    const boxInfoElement = document.getElementById('boxInfo');
    boxInfoElement.innerHTML = `
        <h2>Informações da Caixa</h2>
        <p><strong>Nome:</strong> ${box.name}</p>
        <p><strong>Tipo:</strong> ${box.type}</p>
        <p><strong>Status:</strong> ${box.status}</p>
        <p><strong>Descrição:</strong> ${box.description || 'Nenhuma descrição'}</p>
        <p><strong>Coordenadas:</strong> ${box.latitude.toFixed(6)}, ${box.longitude.toFixed(6)}</p>
        <button onclick="editBox(${box.id})">Editar</button>
        <button onclick="deleteBox(${box.id})">Excluir</button>
    `;
}

// Função para limpar todos os marcadores
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

// Função para ativar modo de adição de caixa
function activateAddBoxMode() {
    addingBoxMode = true;
    map.getContainer().style.cursor = 'crosshair';
    alert('Clique no mapa para selecionar a localização da nova caixa');
}

// Função para desativar modo de adição de caixa
function deactivateAddBoxMode() {
    addingBoxMode = false;
    map.getContainer().style.cursor = '';
    selectedLocation = null;
}

// Botão de adicionar caixa
document.getElementById('addBoxBtn').addEventListener('click', () => {
    activateAddBoxMode();
    document.getElementById('addBoxModal').style.display = 'block';
});

// Fechar modais quando clicar no X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        deactivateAddBoxMode();
    });
});

// Fechar modais quando clicar fora deles
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
            deactivateAddBoxMode();
        }
    });
});
