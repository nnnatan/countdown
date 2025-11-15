# Contagem → 2027

Um contador visual de dias até o ano de 2027, desenvolvido em React.

## Funcionalidades

- ✅ Contagem regressiva de dias até 2027 (ex: 438, 437, 436...)
- ✅ Marcação automática de dias passados com X vermelho
- ✅ Tooltip mostrando a data ao passar o mouse sobre cada dia
- ✅ Exibição de dias passados e futuros
- ✅ Sistema preparado para anexar links em cada dia
- ✅ Persistência de dados no localStorage
- ✅ Atualização automática a cada minuto

## Como usar

### Instalação

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Build para produção

```bash
npm run build
```

### Preview da build

```bash
npm run preview
```

## Tecnologias

- React 18
- Vite
- CSS3

## Estrutura do Projeto

```
COUNTDOWN/
├── src/
│   ├── App.jsx       # Componente principal
│   ├── App.css       # Estilos do componente
│   ├── main.jsx      # Ponto de entrada
│   └── index.css     # Estilos globais
├── index.html        # HTML principal
├── package.json      # Dependências
└── vite.config.js    # Configuração do Vite
```

## Como Adicionar Links aos Dias

O sistema está preparado para anexar links em cada dia. Por enquanto, você pode adicionar links via console do navegador:

```javascript
// Exemplo: Adicionar link ao dia de hoje
const today = new Date().toISOString().split('T')[0];
// No console do React DevTools, você pode acessar o estado ou usar localStorage diretamente:

// Via localStorage:
const dayLinks = JSON.parse(localStorage.getItem('dayLinks') || '{}');
dayLinks['2024-01-15'] = 'https://exemplo.com';
localStorage.setItem('dayLinks', JSON.stringify(dayLinks));
// Recarregue a página para ver o link

// Quando um dia tem link, ele aparece com um ícone 🔗 e ao clicar abre o link
```

## Funcionalidades Futuras

- Modal visual para adicionar links em cada dia
- Exportação de dados
- Compartilhamento de contagem

