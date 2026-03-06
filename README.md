<div align="center">
  <img src="./public/couple-finances-logo.png" alt="Couple Finances Logo" width="200"/>

# 💑 Couple Finances — Nicolas & Nicole

Aplicativo web de controle financeiro para casais, com sincronização em tempo real via Firebase.

  *Organizando sonhos, planejando futuros juntos*
 </div>  

## Funcionalidades

- **Dashboard** — visão geral mensal com totais de entradas, saídas e saldo por pessoa, gráfico comparativo e distribuição de gastos por categoria
- **Lançamentos** — listagem filtrável por pessoa e tipo (entrada/saída), com edição e exclusão
- **Metas** — criação e acompanhamento de metas financeiras do casal com barra de progresso, prazo e cálculo de valor mensal necessário
- **Adicionar/Editar** — formulário para cadastro de transações com categorias predefinidas para receitas e despesas
- Sincronização em tempo real com **Firebase Firestore**
- Interface responsiva com seletor de mês/ano para navegação histórica

## Stack

<div align="center">
<div style="display: inline_block"><br/>
	<img align="center" alt="react" src="https://img.shields.io/badge/-React-45b8d8?style=for-the-badge&logo=react&logoColor=white" />
   <img align="center" alt="vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" />
   <img align="center" alt="vite" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
   <img align="center" alt="vite" src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white%22/%3E" />
	<img align="center" alt="sql" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" />
</div>
</div> 

###

| Tecnologia | Uso |
|---|---|
| React 19 | Interface |
| Vite 7 | Build e dev server |
| Firebase 12 (Firestore) | Banco de dados em tempo real |
| Recharts 3 | Gráficos (pizza e barras) |

## Pré-requisitos

- Node.js 18+
- Projeto no [Firebase Console](https://console.firebase.google.com) com Firestore habilitado

## Configuração

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   cd couple-finances
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Firebase. Crie o arquivo `src/firebase.js` com as credenciais do seu projeto:
   ```js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Lint com ESLint
```

## Estrutura do Firestore

### Coleção `transactions`

| Campo | Tipo | Descrição |
|---|---|---|
| `desc` | string | Descrição do lançamento |
| `amount` | number | Valor em R$ |
| `type` | string | `"income"` ou `"expense"` |
| `category` | string | Categoria do lançamento |
| `person` | string | `"Nicolas"` ou `"Nicole"` |
| `date` | string | Data no formato `YYYY-MM-DD` |

### Coleção `goals`

| Campo | Tipo | Descrição |
|---|---|---|
| `title` | string | Nome da meta |
| `target` | number | Valor total da meta em R$ |
| `saved` | number | Valor já guardado em R$ |
| `icon` | string | Emoji representando a meta |
| `color` | string | Cor hex da barra de progresso |
| `deadline` | string | Prazo no formato `YYYY-MM` |
| `notes` | string | Observações opcionais |
