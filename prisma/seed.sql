-- Create initial Admin User
INSERT OR IGNORE INTO "User" ("id", "phoneNumber", "password", "fullName", "role", "updatedAt") 
VALUES ('admin-id', '0000000000', '$2a$10$wV8iUv7H/vY.2I.z.E9pOOe0W7jV.5H9.G9G9G9G9G9G9G9G9G9G9', 'System Admin', 'ADMIN', CURRENT_TIMESTAMP);

-- Insert CORE subjects
INSERT OR IGNORE INTO "Subject" ("id", "name", "type") VALUES ('s1', 'English Language', 'CORE');
INSERT OR IGNORE INTO "Subject" ("id", "name", "type") VALUES ('s2', 'Mathematics', 'CORE');
INSERT OR IGNORE INTO "Subject" ("id", "name", "type") VALUES ('s3', 'Integrated Science', 'CORE');
INSERT OR IGNORE INTO "Subject" ("id", "name", "type") VALUES ('s4', 'Social Studies', 'CORE');

-- Insert default Mock Exam
INSERT OR IGNORE INTO "MockExam" ("id", "name", "createdAt") VALUES ('mock-1', 'Mock 1 2024', CURRENT_TIMESTAMP);
