INSERT INTO food_items (name, category) VALUES
('judia', 'LEGUME'),
('judias verdes', 'VEGETABLE'),
('arroces', 'CEREAL'),
('maices', 'CEREAL')
ON CONFLICT (name) DO NOTHING;
