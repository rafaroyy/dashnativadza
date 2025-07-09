-- Insert sample users with temporary password "123"
INSERT INTO users (id, name, email, password, role, profile_image_url, online_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao@example.com', '123', 'admin', 'https://api.dicebear.com/8.x/initials/svg?seed=João Silva', true),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria@example.com', '123', 'manager', 'https://api.dicebear.com/8.x/initials/svg?seed=Maria Santos', true),
('550e8400-e29b-41d4-a716-446655440003', 'Pedro Costa', 'pedro@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Pedro Costa', false),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Oliveira', 'ana@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Ana Oliveira', true),
('550e8400-e29b-41d4-a716-446655440005', 'Carlos Ferreira', 'carlos@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Carlos Ferreira', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample workspaces
INSERT INTO workspaces (id, name, description, owner_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Workspace Principal', 'Workspace principal da empresa', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Projetos de Marketing', 'Workspace para projetos de marketing', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert workspace members
INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'manager'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'member')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, workspace_id, status, color, progress, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Sistema de Vendas', 'Desenvolvimento do novo sistema de vendas', '660e8400-e29b-41d4-a716-446655440001', 'active', '#FF6B6B', 75, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'App Mobile', 'Desenvolvimento do aplicativo mobile', '660e8400-e29b-41d4-a716-446655440001', 'active', '#4ECDC4', 45, '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', 'Campanha Digital', 'Nova campanha de marketing digital', '660e8400-e29b-41d4-a716-446655440002', 'active', '#45B7D1', 30, '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'member')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Criar interface de login', 'Desenvolver a tela de login do sistema', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'in-progress', 'high', '2024-02-15', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'Configurar banco de dados', 'Configurar e otimizar o banco de dados', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'completed', 'high', '2024-02-10', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'Design da interface mobile', 'Criar o design das telas do app mobile', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'todo', 'normal', '2024-02-20', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440004', 'Implementar notificações push', 'Adicionar sistema de notificações push', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'todo', 'normal', '2024-02-25', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440005', 'Criar conteúdo para redes sociais', 'Desenvolver conteúdo para Instagram e Facebook', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'in-progress', 'normal', '2024-02-18', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, content) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Como está o progresso da interface de login?'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Está quase pronto! Só faltam alguns ajustes finais.'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Preciso que você revise os designs do app mobile.'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Perfeito! Vou revisar hoje mesmo.');
