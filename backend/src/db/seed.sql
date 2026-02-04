INSERT INTO areas (id, name) VALUES
	(1, 'Unassigned')
ON DUPLICATE KEY UPDATE
	name = VALUES(name);

UPDATE areas SET name = 'Unassigned' WHERE id = 1 AND name = 'Dhaka';

INSERT INTO users (name, email, password, nid, area_id, role_id, status) VALUES
	('Admin One', 'admin@urbanease.local', '$2a$10$MKRnbOklSaxgSeIcY/rl4..pnh44X0FtrMBxkwyhARG4TeXZorRma', 'NID-ADMIN-001', 1, 1, 'approved')
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	password = VALUES(password),
	nid = VALUES(nid),	
	area_id = VALUES(area_id),
	role_id = VALUES(role_id),
	status = VALUES(status);
