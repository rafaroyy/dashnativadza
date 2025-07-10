-- Inserir usuários de exemplo (todos com senha "123")
INSERT INTO users (name, email, password, role, profile_image_url, online_status) VALUES
('João Silva', 'joao@example.com', '123', 'admin', 'https://api.dicebear.com/8.x/initials/svg?seed=João Silva', true),
('Maria Santos', 'maria@example.com', '123', 'manager', 'https://api.dicebear.com/8.x/initials/svg?seed=Maria Santos', true),
('Pedro Oliveira', 'pedro@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Pedro Oliveira', false),
('Ana Costa', 'ana@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Ana Costa', true),
('Carlos Ferreira', 'carlos@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Carlos Ferreira', false)
ON CONFLICT (email) DO NOTHING;

-- Inserir workspace de exemplo
INSERT INTO workspaces (name, description, owner_id) 
SELECT 'Workspace Principal', 'Workspace principal da empresa', id 
FROM users WHERE email = 'joao@example.com' LIMIT 1
ON CONFLICT DO NOTHING;

-- Inserir projetos de exemplo
INSERT INTO projects (name, description, workspace_id, status, color, progress, deadline, created_by)
SELECT 
    'Sistema de Vendas',
    'Desenvolvimento do novo sistema de vendas online',
    w.id,
    'active',
    '#3b82f6',
    75,
    NOW() + INTERVAL '30 days',
    u.id
FROM workspaces w, users u 
WHERE w.name = 'Workspace Principal' AND u.email = 'joao@example.com'
UNION ALL
SELECT 
    'App Mobile',
    'Aplicativo mobile para clientes',
    w.id,
    'active',
    '#10b981',
    45,
    NOW() + INTERVAL '60 days',
    u.id
FROM workspaces w, users u 
WHERE w.name = 'Workspace Principal' AND u.email = 'maria@example.com'
UNION ALL
SELECT 
    'Website Institucional',
    'Novo website da empresa',
    w.id,
    'completed',
    '#f59e0b',
    100,
    NOW() - INTERVAL '10 days',
    u.id
FROM workspaces w, users u 
WHERE w.name = 'Workspace Principal' AND u.email = 'pedro@example.com'
ON CONFLICT DO NOTHING;

-- Inserir tarefas de exemplo
INSERT INTO tasks (title, description, project_id, assignee_id, created_by, status, priority, due_date, completed)
SELECT 
    'Implementar autenticação',
    'Desenvolver sistema de login e registro',
    p.id,
    u1.id,
    u2.id,
    'in-progress',
    'high',
    NOW() + INTERVAL '7 days',
    false
FROM projects p, users u1, users u2
WHERE p.name = 'Sistema de Vendas' AND u1.email = 'maria@example.com' AND u2.email = 'joao@example.com'
UNION ALL
SELECT 
    'Design da interface',
    'Criar mockups das telas principais',
    p.id,
    u1.id,
    u2.id,
    'completed',
    'normal',
    NOW() + INTERVAL '3 days',
    true
FROM projects p, users u1, users u2
WHERE p.name = 'Sistema de Vendas' AND u1.email = 'ana@example.com' AND u2.email = 'joao@example.com'
UNION ALL
SELECT 
    'Configurar banco de dados',
    'Estruturar tabelas e relacionamentos',
    p.id,
    u1.id,
    u2.id,
    'todo',
    'high',
    NOW() + INTERVAL '14 days',
    false
FROM projects p, users u1, users u2
WHERE p.name = 'Sistema de Vendas' AND u1.email = 'pedro@example.com' AND u2.email = 'joao@example.com'
UNION ALL
SELECT 
    'Desenvolver tela de login',
    'Implementar interface de autenticação no app',
    p.id,
    u1.id,
    u2.id,
    'in-progress',
    'normal',
    NOW() + INTERVAL '5 days',
    false
FROM projects p, users u1, users u2
WHERE p.name = 'App Mobile' AND u1.email = 'carlos@example.com' AND u2.email = 'maria@example.com'
UNION ALL
SELECT 
    'Integração com API',
    'Conectar app com backend',
    p.id,
    u1.id,
    u2.id,
    'todo',
    'high',
    NOW() + INTERVAL '21 days',
    false
FROM projects p, users u1, users u2
WHERE p.name = 'App Mobile' AND u1.email = 'ana@example.com' AND u2.email = 'maria@example.com'
ON CONFLICT DO NOTHING;

-- Inserir membros do workspace
INSERT INTO workspace_members (workspace_id, user_id, role)
SELECT w.id, u.id, 
    CASE 
        WHEN u.email = 'joao@example.com' THEN 'admin'
        WHEN u.email = 'maria@example.com' THEN 'manager'
        ELSE 'member'
    END
FROM workspaces w, users u
WHERE w.name = 'Workspace Principal'
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Inserir membros dos projetos
INSERT INTO project_members (project_id, user_id, role)
SELECT p.id, u.id, 'member'
FROM projects p, users u
WHERE p.name IN ('Sistema de Vendas', 'App Mobile', 'Website Institucional')
ON CONFLICT (project_id, user_id) DO NOTHING;
