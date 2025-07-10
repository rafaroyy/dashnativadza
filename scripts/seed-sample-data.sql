-- Insert sample users (all with password "123")
INSERT INTO users (id, name, email, password, role, profile_image_url, online_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao@example.com', '123', 'admin', 'https://api.dicebear.com/8.x/initials/svg?seed=João Silva', true),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria@example.com', '123', 'manager', 'https://api.dicebear.com/8.x/initials/svg?seed=Maria Santos', true),
('550e8400-e29b-41d4-a716-446655440003', 'Pedro Costa', 'pedro@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Pedro Costa', false),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Oliveira', 'ana@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Ana Oliveira', true),
('550e8400-e29b-41d4-a716-446655440005', 'Carlos Ferreira', 'carlos@example.com', '123', 'member', 'https://api.dicebear.com/8.x/initials/svg?seed=Carlos Ferreira', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample workspaces
INSERT INTO workspaces (id, name, description, owner_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Digitalz Workspace', 'Workspace principal da empresa', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Projetos Especiais', 'Workspace para projetos especiais', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, workspace_id, status, color, progress, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Sistema de Gestão', 'Desenvolvimento do sistema principal', '660e8400-e29b-41d4-a716-446655440001', 'active', '#3B82F6', 75, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'App Mobile', 'Aplicativo mobile da empresa', '660e8400-e29b-41d4-a716-446655440001', 'active', '#10B981', 45, '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', 'Website Institucional', 'Novo site da empresa', '660e8400-e29b-41d4-a716-446655440001', 'completed', '#8B5CF6', 100, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440004', 'Dashboard Analytics', 'Dashboard de análise de dados', '660e8400-e29b-41d4-a716-446655440002', 'active', '#F59E0B', 30, '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, project_id, assignee_id, created_by, status, priority, completed) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Implementar autenticação', 'Desenvolver sistema de login e registro', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'in_progress', 'high', false),
('880e8400-e29b-41d4-a716-446655440002', 'Design da interface', 'Criar mockups das telas principais', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'completed', 'medium', true),
('880e8400-e29b-41d4-a716-446655440003', 'Configurar banco de dados', 'Setup inicial do PostgreSQL', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'completed', 'high', true),
('880e8400-e29b-41d4-a716-446655440004', 'Desenvolver API REST', 'Criar endpoints da API', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'todo', 'medium', false),
('880e8400-e29b-41d4-a716-446655440005', 'Testes unitários', 'Implementar testes automatizados', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'todo', 'low', false)
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

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'developer'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'designer'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'developer'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'admin')
ON CONFLICT (project_id, user_id) DO NOTHING;
