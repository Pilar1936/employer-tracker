INSERT INTO departments
  (name)
VALUES
  ('Sales'), 
  ('Engineering'), 
  ('Customer Service'),
  ('Marketing');

INSERT INTO roles

  (title, salary, department_id)
VALUES
  ('Sales Manager', 80000, 1),
  ('Sales Intern', 50000, 1),
  ('Head Engineer', 80000, 2),
  ('Electrical Engineer', 75000, 2),
  ('Testing Engineer', 45000, 2),
  ('Customer Service Agent', 40000, 3),
  ('Marketing Manager', 65000, 4),
  ('Marketing Intern', 40000, 4);

INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Carlos', 'Cortez', 1, null),
  ('Anthony', 'Shoes', 2, 1),
  ('Alvaro', 'Gil', 3, null),
  ('Maria', 'Jones', 4, 3),
  ('Elvia', 'Suarez', 5, 3),
  ('Walter', 'swchee', 6, 1),
  ('Pilar', 'Moreno', 7, null),
  ('Dominic', 'Gale', 8, 7);