// Gerenciamento de caixas de fibra óptica
const addBoxForm = document.getElementById('addBoxForm');
const addBoxModal = document.getElementById('addBoxModal');
const removeBoxBtn = document.getElementById('removeBoxBtn');

// Variáveis de estado
let selectedBox = null;
let removeMode = false;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Formulário de adicionar caixa
    addBoxForm.addEventListener('submit', handleAddBox);
    
    // Botão de remover caixa
    removeBoxBtn.addEventListener('click', toggleRemoveMode);
});

// Função para adicionar uma nova caixa
function handleAddBox(e) {
    e.preventDefault();
    
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
        alert('Você precisa estar logado para adicionar caixas.');
        return;
    }
    
    // Verificar se uma localização foi selecionada
    if (!selectedLocation) {
        alert('Selecione uma localização no mapa primeiro.');
        return;
    }
    
    // Obter dados do formulário
    const name = document.getElementById('boxName').value;
    const type = document.getElementById('boxType').value;
    const status = document.getElementById('boxStatus').value;
    const description = document.getElementById('boxDescription').value;
    const icon = document.getElementById('boxIcon').value;
    const latitude = document.getElementById('boxLatitude').value;
    const longitude = document.getElementById('boxLongitude').value;
    
    // Obter token de autenticação
    const token = localStorage.getItem('token');
    
    // Enviar dados para o servidor
    fetch('/api/boxes', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            type,
            status,
            description,
            icon,
            latitude,
            longitude
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao adicionar caixa');
        }
        return response.json();
    })
    .then(data => {
        // Adicionar marcador ao mapa
        addMarkerToMap(data);
        
        // Fechar modal
        addBoxModal.style.display = 'none';
        
        // Limpar formulário
        addBoxForm.reset();
        
        // Desativar modo de adição
        deactivateAddBoxMode();
        
        alert('Caixa adicionada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao adicionar caixa:', error);
        alert('Erro ao adicionar caixa. Tente novamente.');
    });
}

// Função para ativar/desativar modo de remoção
function toggleRemoveMode() {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
        alert('Você precisa estar logado para remover caixas.');
        return;
    }
    
    removeMode = !removeMode;
    
    if (removeMode) {
        // Ativar modo de remoção
        removeBoxBtn.textContent = 'Cancelar Remoção';
        removeBoxBtn.classList.add('active');
        map.getContainer().style.cursor = 'not-allowed';
        
        // Adicionar evento de clique nos marcadores para remoção
        markers.forEach(marker => {
            marker.on('click', function() {
                if (removeMode) {
                    confirmDeleteBox(marker.boxId);
                }
            });
        });
        
        alert('Clique em uma caixa no mapa para removê-la.');
    } else {
        // Desativar modo de remoção
        removeBoxBtn.textContent = 'Remover Caixa';
        removeBoxBtn.classList.remove('active');
        map.getContainer().style.cursor = '';
        
        // Recarregar caixas para resetar eventos
        loadBoxes();
    }
}

// Função para confirmar exclusão de caixa
function confirmDeleteBox(boxId) {
    if (confirm('Tem certeza que deseja remover esta caixa?')) {
        deleteBox(boxId);
    }
}

// Função para excluir caixa
function deleteBox(boxId) {
    // Obter token de autenticação
    const token = localStorage.getItem('token');
    
    // Enviar requisição para o servidor
    fetch(`/api/boxes/${boxId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao remover caixa');
        }
        return response.json();
    })
    .then(data => {
        // Remover marcador do mapa
        const markerIndex = markers.findIndex(marker => marker.boxId === boxId);
        if (markerIndex !== -1) {
            map.removeLayer(markers[markerIndex]);
            markers.splice(markerIndex, 1);
        }
        
        // Limpar informações da caixa
        document.getElementById('boxInfo').innerHTML = `
            <h2>Informações da Caixa</h2>
            <p>Selecione uma caixa no mapa para ver detalhes</p>
        `;
        
        // Desativar modo de remoção
        toggleRemoveMode();
        
        alert('Caixa removida com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao remover caixa:', error);
        alert('Erro ao remover caixa. Tente novamente.');
    });
}

// Função para editar caixa
function editBox(boxId) {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
        alert('Você precisa estar logado para editar caixas.');
        return;
    }
    
    // Obter token de autenticação
    const token = localStorage.getItem('token');
    
    // Obter dados da caixa
    fetch(`/api/boxes/${boxId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao obter dados da caixa');
        }
        return response.json();
    })
    .then(box => {
        // Preencher formulário com dados da caixa
        document.getElementById('boxName').value = box.name;
        document.getElementById('boxType').value = box.type;
        document.getElementById('boxStatus').value = box.status;
        document.getElementById('boxDescription').value = box.description || '';
        document.getElementById('boxIcon').value = box.icon;
        document.getElementById('boxLatitude').value = box.latitude;
        document.getElementById('boxLongitude').value = box.longitude;
        
        // Atualizar localização selecionada
        selectedLocation = {
            lat: box.latitude,
            lng: box.longitude
        };
        
        document.getElementById('selectedLocation').textContent = 
            `Latitude: ${box.latitude.toFixed(6)}, Longitude: ${box.longitude.toFixed(6)}`;
        
        // Armazenar ID da caixa para atualização
        selectedBox = boxId;
        
        // Modificar formulário para modo de edição
        const submitButton = addBoxForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Atualizar';
        
        // Mostrar modal
        addBoxModal.style.display = 'block';
        
        // Modificar comportamento do formulário
        addBoxForm.removeEventListener('submit', handleAddBox);
        addBoxForm.addEventListener('submit', function handleUpdateBox(e) {
            e.preventDefault();
            
            // Obter dados do formulário
            const name = document.getElementById('boxName').value;
            const type = document.getElementById('boxType').value;
            const status = document.getElementById('boxStatus').value;
            const description = document.getElementById('boxDescription').value;
            const icon = document.getElementById('boxIcon').value;
            const latitude = document.getElementById('boxLatitude').value;
            const longitude = document.getElementById('boxLongitude').value;
            
            // Enviar dados para o servidor
            fetch(`/api/boxes/${selectedBox}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    type,
                    status,
                    description,
                    icon,
                    latitude,
                    longitude
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao atualizar caixa');
                }
                return response.json();
            })
            .then(data => {
                // Fechar modal
                addBoxModal.style.display = 'none';
                
                // Limpar formulário
                addBoxForm.reset();
                
                // Restaurar comportamento do formulário
                addBoxForm.removeEventListener('submit', handleUpdateBox);
                addBoxForm.addEventListener('submit', handleAddBox);
                
                // Restaurar botão
                submitButton.textContent = 'Salvar';
                
                // Limpar seleção
                selectedBox = null;
                
                // Recarregar caixas
                loadBoxes();
                
                alert('Caixa atualizada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao atualizar caixa:', error);
                alert('Erro ao atualizar caixa. Tente novamente.');
            });
        });
    })
    .catch(error => {
        console.error('Erro ao obter dados da caixa:', error);
        alert('Erro ao obter dados da caixa. Tente novamente.');
    });
}
