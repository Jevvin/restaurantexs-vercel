-- Verificar que las tablas existen y tienen datos
SELECT 'cities' as table_name, COUNT(*) as count FROM cities
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'restaurants' as table_name, COUNT(*) as count FROM restaurants
UNION ALL
SELECT 'promotions' as table_name, COUNT(*) as count FROM promotions
UNION ALL
SELECT 'menu_items' as table_name, COUNT(*) as count FROM menu_items
UNION ALL
SELECT 'reviews' as table_name, COUNT(*) as count FROM reviews;

-- Verificar datos específicos de Cancún
SELECT 'Cancún city check' as check_type, name, slug FROM cities WHERE slug = 'cancun';

-- Verificar restaurantes en Cancún
SELECT 
    'Restaurants in Cancún' as check_type,
    r.name,
    r.slug,
    c.name as city_name,
    cat.name as category_name
FROM restaurants r
JOIN cities c ON r.city_id = c.id
JOIN categories cat ON r.category_id = cat.id
WHERE c.slug = 'cancun';

-- Verificar si hay duplicados en cities
SELECT slug, COUNT(*) as count 
FROM cities 
GROUP BY slug 
HAVING COUNT(*) > 1;

-- Verificar si hay duplicados en restaurants
SELECT slug, COUNT(*) as count 
FROM restaurants 
GROUP BY slug 
HAVING COUNT(*) > 1;
