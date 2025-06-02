# Sistema de Mapeamento de Caixas de Fibra Óptica - Manual do Usuário

## Introdução

Este sistema foi desenvolvido para permitir o mapeamento e gerenciamento de caixas de fibra óptica em um mapa interativo. Com ele, você pode adicionar, remover, editar e consultar caixas de fibra óptica em diferentes localizações, utilizando ícones ilustrativos para representá-las.

## Requisitos do Sistema

- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## Instalação

1. Clone ou extraia os arquivos do sistema para o diretório desejado
2. Configure o banco de dados:
   - Crie um banco de dados MySQL chamado `fiber_map_system`
   - Configure as credenciais no arquivo `.env` na raiz do projeto
3. Instale as dependências:
   ```
   npm install
   ```
4. Inicie o servidor:
   ```
   node src/server.js
   ```
5. Acesse o sistema pelo navegador:
   ```
   http://localhost:3000
   ```

## Funcionalidades

### Autenticação

- **Registro**: Crie uma nova conta de usuário para acessar o sistema
- **Login**: Acesse o sistema com suas credenciais
- **Logout**: Encerre sua sessão no sistema

### Gerenciamento de Caixas

- **Visualização**: Veja todas as caixas de fibra óptica no mapa
- **Adição**: Adicione novas caixas clicando no mapa e preenchendo as informações
- **Edição**: Modifique informações de caixas existentes
- **Remoção**: Exclua caixas do mapa
- **Consulta**: Visualize detalhes de caixas específicas

### Mapa Interativo

- **Navegação**: Mova-se pelo mapa, amplie e reduza a visualização
- **Seleção**: Clique nas caixas para ver detalhes
- **Marcação**: Adicione novas caixas clicando no mapa

## Guia de Uso

### Primeiros Passos

1. Acesse o sistema pelo navegador
2. Registre-se ou faça login com suas credenciais
3. Explore o mapa para visualizar caixas existentes

### Adicionar uma Nova Caixa

1. Clique no botão "Adicionar Caixa"
2. Clique no mapa para selecionar a localização
3. Preencha as informações da caixa no formulário
4. Selecione o tipo de ícone desejado
5. Clique em "Salvar"

### Editar uma Caixa

1. Clique na caixa que deseja editar no mapa
2. Clique no botão "Editar" no painel de informações
3. Modifique as informações desejadas
4. Clique em "Atualizar"

### Remover uma Caixa

1. Clique no botão "Remover Caixa"
2. Clique na caixa que deseja remover no mapa
3. Confirme a remoção

## Personalização

### Ícones

O sistema inclui quatro ícones padrão para representar diferentes tipos de caixas:
- Azul: Caixa de Distribuição
- Vermelho: Caixa de Emenda
- Verde: Caixa Terminal
- Amarelo: Outros tipos

Para adicionar novos ícones, coloque as imagens na pasta `public/images/` e atualize o arquivo `public/js/map.js`.

## Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.

---

Desenvolvido com Node.js, Express, Sequelize, MySQL e Leaflet.
