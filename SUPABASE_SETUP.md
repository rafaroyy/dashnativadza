# 🚀 Configuração Completa do Supabase

## 📋 Pré-requisitos
- Conta no Supabase (https://supabase.com)
- Projeto criado no Supabase Dashboard

## 🔧 Passo a Passo

### 1. **Configurar Projeto no Supabase**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto ou use o existente
3. Anote a **URL** e **ANON KEY** do projeto

### 2. **Executar Scripts SQL**

#### 2.1 Criar Tabelas
No Supabase Dashboard → SQL Editor, execute:
\`\`\`sql
-- Copie e cole o conteúdo de: scripts/create-supabase-tables.sql
\`\`\`

#### 2.2 Inserir Dados de Exemplo
Após criar as tabelas, execute:
\`\`\`sql
-- Copie e cole o conteúdo de: scripts/seed-sample-data.sql
\`\`\`

### 3. **Verificar Configuração**

#### 3.1 Verificar Tabelas Criadas
No Supabase Dashboard → Table Editor, você deve ver:
- ✅ `users` (5 registros)
- ✅ `projects` (3 registros) 
- ✅ `tasks` (5 registros)
- ✅ `messages` (4 registros)

#### 3.2 Verificar Storage
No Supabase Dashboard → Storage:
- ✅ Bucket `avatars` criado e público

#### 3.3 Verificar RLS
No Supabase Dashboard → Authentication → Policies:
- ✅ Políticas criadas para todas as tabelas

### 4. **Testar Conexão**

Execute no terminal:
\`\`\`bash
npm run db:check
\`\`\`

Deve retornar: `Database connection successful`

## 📊 Estrutura das Tabelas

### 👥 Users
\`\`\`sql
- id (UUID, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- phone (TEXT)
- role (TEXT)
- location (TEXT)
- profile_image_url (TEXT)
- online_status (BOOLEAN)
- created_at (TIMESTAMP)
\`\`\`

### 📁 Projects
\`\`\`sql
- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- status (TEXT)
- progress (INTEGER)
- deadline (DATE)
- members_count (INTEGER)
- tasks_total (INTEGER)
- created_by (UUID, FK → users.id)
- created_at (TIMESTAMP)
\`\`\`

### ✅ Tasks
\`\`\`sql
- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- assigned_to (UUID, FK → users.id)
- project_id (UUID, FK → projects.id)
- status (TEXT)
- due_date (DATE)
- completed (BOOLEAN)
- created_at (TIMESTAMP)
\`\`\`

### 💬 Messages
\`\`\`sql
- id (UUID, PK)
- sender_id (UUID, FK → users.id)
- receiver_id (UUID, FK → users.id)
- content (TEXT)
- created_at (TIMESTAMP)
\`\`\`

## 🔐 Segurança (RLS)

### Políticas Configuradas:
- **Users**: Visualização pública, edição própria
- **Projects**: CRUD completo para todos
- **Tasks**: CRUD completo para todos  
- **Messages**: Visualização e envio próprio
- **Storage**: Upload e visualização pública de avatars

## 🧪 Dados de Exemplo

### Usuários:
- João Silva (Frontend Dev) - Online
- Maria Santos (UX Designer) - Offline
- Carlos Oliveira (Backend Dev) - Online
- Ana Costa (Product Manager) - Offline
- Pedro Ferreira (DevOps) - Online

### Projetos:
- Website Redesign (65% completo)
- App Mobile (30% completo)
- Sistema CRM (15% completo)

### Tarefas:
- Wireframes (Concluída)
- Autenticação (Em progresso)
- Banco de dados (A fazer)
- Testes usabilidade (A fazer)
- Deploy produção (A fazer)

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] Scripts SQL executados
- [ ] Tabelas criadas e populadas
- [ ] Storage configurado
- [ ] RLS habilitado
- [ ] Conexão testada
- [ ] Dados de exemplo carregados

## 🚨 Troubleshooting

### Erro de Conexão
\`\`\`bash
# Verificar se as credenciais estão corretas
npm run db:check
\`\`\`

### Tabelas não encontradas
- Execute novamente `create-supabase-tables.sql`
- Verifique se não há erros no SQL Editor

### RLS bloqueando acesso
- Verifique se as políticas foram criadas
- Temporariamente desabilite RLS para teste

## 📞 Suporte
Se encontrar problemas, verifique:
1. Credenciais do Supabase em `lib/supabase.ts`
2. Logs no console do navegador
3. Logs no Supabase Dashboard → Logs
