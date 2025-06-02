// Gerenciamento de autenticação
let isAuthenticated = false;
let currentUser = null;

// Elementos DOM
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const addBoxBtn = document.getElementById('addBoxBtn');
const removeBoxBtn = document.getElementById('removeBoxBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botões de autenticação
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
    
    logoutBtn.addEventListener('click', logout);
    
    // Formulários
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Verificar status de autenticação
    checkAuthStatus();
});

// Verificar se o usuário está autenticado
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
        // Validar token no servidor
        fetch('/api/auth/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Token inválido');
            }
        })
        .then(data => {
            // Token válido, usuário autenticado
            isAuthenticated = true;
            currentUser = {
                id: userId,
                name: data.name,
                email: data.email,
                role: data.role
            };
            updateAuthUI(true);
        })
        .catch(error => {
            console.error('Erro na validação do token:', error);
            // Token inválido, fazer logout
            logout(false);
        });
    } else {
        // Sem token, usuário não autenticado
        updateAuthUI(false);
    }
}

// Atualizar interface com base no status de autenticação
function updateAuthUI(authenticated) {
    if (authenticated) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        addBoxBtn.disabled = false;
        removeBoxBtn.disabled = false;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        addBoxBtn.disabled = true;
        removeBoxBtn.disabled = true;
    }
}

// Função de login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha no login');
        }
        return response.json();
    })
    .then(data => {
        // Salvar token e informações do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        
        // Atualizar estado e UI
        isAuthenticated = true;
        currentUser = data.user;
        updateAuthUI(true);
        
        // Fechar modal
        loginModal.style.display = 'none';
        
        // Limpar formulário
        loginForm.reset();
        
        // Carregar caixas
        loadBoxes();
        
        alert('Login realizado com sucesso!');
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro no login. Verifique suas credenciais.');
    });
}

// Função de registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha no registro');
        }
        return response.json();
    })
    .then(data => {
        // Fechar modal
        registerModal.style.display = 'none';
        
        // Limpar formulário
        registerForm.reset();
        
        alert('Registro realizado com sucesso! Faça login para continuar.');
        
        // Abrir modal de login
        loginModal.style.display = 'block';
    })
    .catch(error => {
        console.error('Erro no registro:', error);
        alert('Erro no registro. Verifique os dados informados.');
    });
}

// Função de logout
function logout(showAlert = true) {
    // Limpar dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Atualizar estado e UI
    isAuthenticated = false;
    currentUser = null;
    updateAuthUI(false);
    
    // Limpar marcadores do mapa
    clearMarkers();
    
    if (showAlert) {
        alert('Logout realizado com sucesso!');
    }
}
