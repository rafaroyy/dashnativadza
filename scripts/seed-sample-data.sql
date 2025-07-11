-- Insert sample users with fixed UUIDs
INSERT INTO users (id, name, email, phone, role, location, online_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ana Silva', 'ana@exemplo.com', '(11) 99999-0001', 'Desenvolvedora', 'São Paulo', true),
('550e8400-e29b-41d4-a716-446655440002', 'Carlos Santos', 'carlos@exemplo.com', '(11) 99999-0002', 'Designer', 'Rio de Janeiro', false),
('550e8400-e29b-41d4-a716-446655440003', 'Maria Oliveira', 'maria@exemplo.com', '(11) 99999-0003', 'Gerente', 'Belo Horizonte', true),
('550e8400-e29b-41d4-a716-446655440004', 'João Costa', 'joao@exemplo.com', '(11) 99999-0004', 'Analista', 'Porto Alegre', false),
('550e8400-e29b-41d4-a716-446655440005', 'Lucia Ferreira', 'lucia@exemplo.com', '(11) 99999-0005', 'QA', 'Brasília', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample workspaces
INSERT INTO workspaces (id, name, description, user_id) VALUES
('450e8400-e29b-41d4-a716-446655440001', 'DigitalZ Academy', 'Workspace principal da DigitalZ Academy', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample spaces
INSERT INTO spaces (id, name, description, workspace_id, user_id, space_color, space_avatar) VALUES
('350e8400-e29b-41d4-a716-446655440001', 'Marketing Digital', 'Projetos e campanhas de marketing digital', '450e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '#00FFD1', '📱'),
('350e8400-e29b-41d4-a716-446655440002', 'Desenvolvimento', 'Projetos de desenvolvimento de software', '450e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '#00ff88', '💻'),
('350e8400-e29b-41d4-a716-446655440003', 'Educação', 'Conteúdos educacionais e cursos', '450e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '#ffaa00', '🎓')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, title, description, status, progress, deadline, members_count, tasks_total, created_by, space_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Sistema de Vendas', 'Desenvolvimento de sistema completo de vendas online', 'active', 65, '2024-03-15', 4, 12, '550e8400-e29b-41d4-a716-446655440001', '350e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440002', 'App Mobile', 'Aplicativo mobile para gestão de tarefas', 'active', 30, '2024-04-20', 3, 8, '550e8400-e29b-41d4-a716-446655440002', '350e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'Website Corporativo', 'Novo website da empresa com design moderno', 'completed', 100, '2024-01-30', 2, 6, '550e8400-e29b-41d4-a716-446655440003', '350e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks with all required fields
INSERT INTO tasks (id, title, description, assigned_to, project_id, space_id, status, due_date, completed, priority) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Implementar autenticação', 'Desenvolver sistema de login e registro de usuários', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '350e8400-e29b-41d4-a716-446655440002', 'completed', '2024-02-15', true, 'high'),
('750e8400-e29b-41d4-a716-446655440002', 'Criar dashboard', 'Desenvolver painel administrativo com métricas', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '350e8400-e29b-41d4-a716-446655440002', 'in-progress', '2024-02-28', false, 'normal'),
('750e8400-e29b-41d4-a716-446655440003', 'Design da interface', 'Criar mockups e protótipos das telas principais', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '350e8400-e29b-41d4-a716-446655440002', 'todo', '2024-03-10', false, 'normal'),
('750e8400-e29b-41d4-a716-446655440004', 'Testes de usabilidade', 'Realizar testes com usuários finais', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', '350e8400-e29b-41d4-a716-446655440002', 'todo', '2024-03-20', false, 'low'),
('750e8400-e29b-41d4-a716-446655440005', 'Otimização SEO', 'Implementar melhorias para motores de busca', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '350e8400-e29b-41d4-a716-446655440001', 'completed', '2024-01-25', true, 'urgent')
ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (id, sender_id, receiver_id, content) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Oi Carlos, como está o progresso do design?'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Olá Ana! Estou finalizando os mockups, deve ficar pronto até amanhã.'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Ana, preciso revisar os requisitos do projeto. Podemos conversar?'),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Claro Maria! Estou disponível agora.')
ON CONFLICT (id) DO NOTHING;
