-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    online_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace members table
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Insert sample data
INSERT INTO users (id, email, name, profile_image_url, online_status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@digitalz.com', 'Admin User', '/placeholder.svg?height=40&width=40', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'john@digitalz.com', 'John Silva', '/placeholder.svg?height=40&width=40', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'maria@digitalz.com', 'Maria Santos', '/placeholder.svg?height=40&width=40', false),
    ('550e8400-e29b-41d4-a716-446655440004', 'pedro@digitalz.com', 'Pedro Costa', '/placeholder.svg?height=40&width=40', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, name, description, owner_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'DigitalZ Workspace', 'Workspace principal da DigitalZ', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Marketing Team', 'Workspace da equipe de marketing', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, name, description, workspace_id, status, color) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Redesign completo do website da empresa', '660e8400-e29b-41d4-a716-446655440001', 'active', '#3b82f6'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Mobile App', 'Desenvolvimento do aplicativo mobile', '660e8400-e29b-41d4-a716-446655440001', 'active', '#10b981'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Marketing Campaign', 'Campanha de marketing Q1 2024', '660e8400-e29b-41d4-a716-446655440002', 'active', '#f59e0b')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'Design Homepage', 'Criar design da página inicial', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'in_progress', 'high', '2024-02-15 23:59:59'),
    ('880e8400-e29b-41d4-a716-446655440002', 'Setup Database', 'Configurar banco de dados', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'todo', 'medium', '2024-02-20 23:59:59'),
    ('880e8400-e29b-41d4-a716-446655440003', 'Create Content Strategy', 'Desenvolver estratégia de conteúdo', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'done', 'low', '2024-02-10 23:59:59')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'owner'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'member')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

INSERT INTO project_members (project_id, user_id, role) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'member'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'owner'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'member')
ON CONFLICT (project_id, user_id) DO NOTHING;
