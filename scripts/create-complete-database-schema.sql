-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(100),
    location VARCHAR(255),
    profile_image_url TEXT,
    online_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline DATE,
    members_count INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    space_color VARCHAR(7) DEFAULT '#3B82F6',
    space_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    space_id UUID REFERENCES spaces(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_space_id ON tasks(space_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_spaces_workspace_id ON spaces(workspace_id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_online_status ON users(online_status);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Enable read access for all spaces" ON spaces FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all spaces" ON spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all spaces" ON spaces FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all spaces" ON spaces FOR DELETE USING (true);

CREATE POLICY "Enable read access for all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all tasks" ON tasks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all messages" ON messages FOR DELETE USING (true);

-- Insert sample data
INSERT INTO users (id, name, email, phone, role, location, online_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao@digitalz.com', '(11) 99999-0001', 'Desenvolvedor', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria@digitalz.com', '(11) 99999-0002', 'Designer', 'Rio de Janeiro, RJ', true),
('550e8400-e29b-41d4-a716-446655440003', 'Pedro Costa', 'pedro@digitalz.com', '(11) 99999-0003', 'Gerente de Projeto', 'Belo Horizonte, MG', false),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Oliveira', 'ana@digitalz.com', '(11) 99999-0004', 'QA Tester', 'Porto Alegre, RS', true),
('550e8400-e29b-41d4-a716-446655440005', 'Carlos Ferreira', 'carlos@digitalz.com', '(11) 99999-0005', 'DevOps', 'Brasília, DF', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, title, description, status, progress, deadline, members_count, tasks_total, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Sistema de Gestão', 'Desenvolvimento de sistema completo de gestão empresarial', 'active', 65, '2024-12-31', 5, 12, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'App Mobile', 'Aplicativo mobile para iOS e Android', 'active', 40, '2024-11-30', 3, 8, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440003', 'Website Corporativo', 'Novo website da empresa com design moderno', 'completed', 100, '2024-10-15', 2, 6, '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440004', 'API REST', 'Desenvolvimento de API para integração de sistemas', 'on-hold', 25, '2024-12-15', 4, 10, '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

INSERT INTO spaces (id, name, description, user_id, space_color) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Desenvolvimento', 'Espaço para tarefas de desenvolvimento', '550e8400-e29b-41d4-a716-446655440001', '#3B82F6'),
('770e8400-e29b-41d4-a716-446655440002', 'Design', 'Espaço para tarefas de design e UX', '550e8400-e29b-41d4-a716-446655440002', '#10B981'),
('770e8400-e29b-41d4-a716-446655440003', 'Marketing', 'Espaço para campanhas e marketing', '550e8400-e29b-41d4-a716-446655440003', '#F59E0B'),
('770e8400-e29b-41d4-a716-446655440004', 'Testes', 'Espaço para QA e testes', '550e8400-e29b-41d4-a716-446655440004', '#EF4444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, title, description, assigned_to, project_id, space_id, status, due_date, priority, completed) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Implementar autenticação', 'Desenvolver sistema de login e registro de usuários', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'completed', '2024-01-15', 'high', true),
('880e8400-e29b-41d4-a716-446655440002', 'Criar dashboard', 'Desenvolver dashboard principal do sistema', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'in-progress', '2024-01-25', 'high', false),
('880e8400-e29b-41d4-a716-446655440003', 'Design da interface', 'Criar mockups e protótipos da interface', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'completed', '2024-01-10', 'normal', true),
('880e8400-e29b-41d4-a716-446655440004', 'Testes de usabilidade', 'Realizar testes com usuários finais', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'todo', '2024-01-30', 'normal', false),
('880e8400-e29b-41d4-a716-446655440005', 'Configurar CI/CD', 'Implementar pipeline de integração contínua', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'todo', '2024-02-05', 'urgent', false),
('880e8400-e29b-41d4-a716-446655440006', 'Documentação da API', 'Criar documentação completa da API REST', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'in-progress', '2024-02-10', 'normal', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, sender_id, receiver_id, content) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Oi Maria! Como está o progresso do design?'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Oi João! Está indo bem, já terminei os mockups principais.'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Precisamos revisar o cronograma do projeto.'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Claro Pedro, podemos marcar uma reunião para amanhã?')
ON CONFLICT (id) DO NOTHING;
