-- Insertar ciudades
INSERT INTO cities (name, slug, state, restaurant_count) VALUES
('Cancún', 'cancun', 'Quintana Roo', 5),
('Playa del Carmen', 'playa-del-carmen', 'Quintana Roo', 0),
('Mérida', 'merida', 'Yucatán', 0),
('Puerto Vallarta', 'puerto-vallarta', 'Jalisco', 0);

-- Insertar categorías
INSERT INTO categories (name, slug, description) VALUES
('Mariscos', 'mariscos', 'Restaurantes especializados en mariscos y pescados frescos'),
('Comida Mexicana', 'comida-mexicana', 'Auténtica cocina mexicana tradicional'),
('Internacional', 'internacional', 'Cocina internacional y fusión'),
('Buffet', 'buffet', 'Restaurantes tipo buffet con variedad de platillos'),
('Desayunos', 'desayunos', 'Especialistas en desayunos y brunch'),
('Café y Postres', 'cafe-postres', 'Cafeterías y reposterías');

-- Insertar restaurantes en Cancún
INSERT INTO restaurants (
    name, slug, tagline, description, category_id, city_id, address, 
    coordinates, rating, review_count, price_range, images, amenities, 
    business_hours, is_open, is_claimed
) VALUES
(
    'La Pescadería del Puerto',
    'la-pescaderia-del-puerto',
    'Mariscos frescos con vista al mar',
    'Restaurante familiar especializado en mariscos y pescados frescos, con más de 20 años de tradición culinaria en Cancún. Ofrecemos los mejores ceviches, pescados a la parrilla y mariscos preparados con ingredientes locales de la más alta calidad.',
    (SELECT id FROM categories WHERE slug = 'mariscos'),
    (SELECT id FROM cities WHERE slug = 'cancun'),
    'Blvd. Kukulcán Km 9.5, Zona Hotelera, 77500 Cancún, Q.R.',
    '(-86.8515,21.1619)',
    4.5,
    324,
    'mid',
    ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
    ARRAY['Vista al mar', 'Aire acondicionado', 'Acepta tarjetas', 'Estacionamiento', 'WiFi gratuito', 'Pet friendly', 'Terraza'],
    '{"lun": {"open": "12:00", "close": "22:00", "isClosed": false}, "mar": {"open": "12:00", "close": "22:00", "isClosed": false}, "mie": {"open": "12:00", "close": "22:00", "isClosed": false}, "jue": {"open": "12:00", "close": "22:00", "isClosed": false}, "vie": {"open": "12:00", "close": "23:00", "isClosed": false}, "sab": {"open": "12:00", "close": "23:00", "isClosed": false}, "dom": {"open": "12:00", "close": "21:00", "isClosed": false}}',
    true,
    true
),
(
    'Mariscos El Capitán',
    'mariscos-el-capitan',
    'Tradición marinera desde 1985',
    'Auténticos mariscos preparados con recetas tradicionales de la costa de Yucatán. Especialistas en cocteles de camarón, pulpo a las brasas y pescado frito estilo Campeche. Un lugar familiar con ambiente casual y precios accesibles.',
    (SELECT id FROM categories WHERE slug = 'mariscos'),
    (SELECT id FROM cities WHERE slug = 'cancun'),
    'Av. Tulum 145, Centro, 77500 Cancún, Q.R.',
    '(-86.8466,21.1743)',
    4.2,
    156,
    'budget',
    ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
    ARRAY['Estacionamiento', 'WiFi gratuito', 'Terraza', 'Acepta efectivo', 'Ambiente familiar'],
    '{"lun": {"open": "11:00", "close": "21:00", "isClosed": false}, "mar": {"open": "11:00", "close": "21:00", "isClosed": false}, "mie": {"open": "11:00", "close": "21:00", "isClosed": false}, "jue": {"open": "11:00", "close": "21:00", "isClosed": false}, "vie": {"open": "11:00", "close": "22:00", "isClosed": false}, "sab": {"open": "11:00", "close": "22:00", "isClosed": false}, "dom": {"open": "11:00", "close": "20:00", "isClosed": false}}',
    true,
    false
),
(
    'Tacos El Fogón Maya',
    'tacos-el-fogon-maya',
    'Auténticos sabores yucatecos',
    'Taquería tradicional especializada en cochinita pibil, sopa de lima y otros platillos típicos de Yucatán. Preparamos todo en horno de leña siguiendo recetas ancestrales mayas. El lugar perfecto para conocer la verdadera comida yucateca.',
    (SELECT id FROM categories WHERE slug = 'comida-mexicana'),
    (SELECT id FROM cities WHERE slug = 'cancun'),
    'Av. Yaxchilán 31, SM 22, 77500 Cancún, Q.R.',
    '(-86.8312,21.1611)',
    4.7,
    892,
    'budget',
    ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
    ARRAY['Comida para llevar', 'Entrega a domicilio', 'Acepta efectivo', 'Ambiente casual', 'Especialidad regional'],
    '{"lun": {"open": "08:00", "close": "23:00", "isClosed": false}, "mar": {"open": "08:00", "close": "23:00", "isClosed": false}, "mie": {"open": "08:00", "close": "23:00", "isClosed": false}, "jue": {"open": "08:00", "close": "23:00", "isClosed": false}, "vie": {"open": "08:00", "close": "24:00", "isClosed": false}, "sab": {"open": "08:00", "close": "24:00", "isClosed": false}, "dom": {"open": "08:00", "close": "22:00", "isClosed": false}}',
    true,
    true
),
(
    'Restaurante Italiano Da Vinci',
    'restaurante-italiano-da-vinci',
    'Auténtica cocina italiana en el Caribe',
    'Elegante restaurante italiano con chef napolitano. Especialistas en pasta fresca hecha en casa, pizzas en horno de leña y una selecta carta de vinos italianos. Ambiente romántico perfecto para cenas especiales con vista a la laguna.',
    (SELECT id FROM categories WHERE slug = 'internacional'),
    (SELECT id FROM cities WHERE slug = 'cancun'),
    'Blvd. Kukulcán Km 14.2, Zona Hotelera, 77500 Cancún, Q.R.',
    '(-86.8234,21.0845)',
    4.6,
    267,
    'premium',
    ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
    ARRAY['Vista a la laguna', 'Aire acondicionado', 'Valet parking', 'Bar completo', 'Música en vivo', 'Reservaciones', 'Dress code'],
    '{"lun": {"open": "17:00", "close": "23:00", "isClosed": false}, "mar": {"open": "17:00", "close": "23:00", "isClosed": false}, "mie": {"open": "17:00", "close": "23:00", "isClosed": false}, "jue": {"open": "17:00", "close": "23:00", "isClosed": false}, "vie": {"open": "17:00", "close": "24:00", "isClosed": false}, "sab": {"open": "17:00", "close": "24:00", "isClosed": false}, "dom": {"open": "17:00", "close": "22:00", "isClosed": false}}',
    true,
    true
),
(
    'Café Nader',
    'cafe-nader',
    'Desayunos y café de especialidad',
    'Acogedora cafetería en el corazón del centro de Cancún. Famosos por nuestros desayunos tradicionales mexicanos, café de altura de Chiapas y repostería artesanal. El lugar perfecto para comenzar el día o tomar un break del shopping.',
    (SELECT id FROM categories WHERE slug = 'cafe-postres'),
    (SELECT id FROM cities WHERE slug = 'cancun'),
    'Av. Nader 5, Centro, 77500 Cancún, Q.R.',
    '(-86.8515,21.1619)',
    4.3,
    445,
    'budget',
    ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
    ARRAY['WiFi gratuito', 'Aire acondicionado', 'Terraza', 'Café de especialidad', 'Repostería artesanal', 'Desayunos todo el día'],
    '{"lun": {"open": "07:00", "close": "15:00", "isClosed": false}, "mar": {"open": "07:00", "close": "15:00", "isClosed": false}, "mie": {"open": "07:00", "close": "15:00", "isClosed": false}, "jue": {"open": "07:00", "close": "15:00", "isClosed": false}, "vie": {"open": "07:00", "close": "16:00", "isClosed": false}, "sab": {"open": "08:00", "close": "16:00", "isClosed": false}, "dom": {"open": "08:00", "close": "14:00", "isClosed": false}}',
    true,
    false
);

-- Insertar promociones
INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
-- La Pescadería del Puerto
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), '2x1 en cervezas', 'Válido de lunes a viernes de 5pm a 7pm', '2024-12-31', true),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Ceviche gratis', 'Con consumo mínimo de $800 pesos', '2024-12-31', true),

-- Mariscos El Capitán
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Martes de mariscos', '20% de descuento en todos los platillos', '2024-12-31', true),

-- Tacos El Fogón Maya
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Combo familiar', '4 órdenes de tacos + 2 sopas de lima por $350', '2024-12-31', true),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Happy hour', 'Micheladas 2x1 de 4pm a 6pm', '2024-12-31', true),

-- Da Vinci
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Noche romántica', 'Cena para 2 con botella de vino incluida', '2024-12-31', true),

-- Café Nader
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Desayuno completo', 'Café americano gratis con cualquier desayuno', '2024-12-31', true);

-- Insertar elementos del menú
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- La Pescadería del Puerto
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Ceviche Mixto', 'Pescado blanco, camarón y pulpo marinado en limón', 180, 'Entradas'),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Aguachile Verde', 'Camarones frescos en salsa verde picante', 220, 'Entradas'),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Pescado a la Parrilla', 'Mero fresco con guarnición de verduras', 320, 'Platos Fuertes'),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Langosta Termidor', 'Langosta gratinada con queso y especias', 650, 'Platos Fuertes'),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Sopa de Mariscos', 'Caldo concentrado con mariscos mixtos', 280, 'Sopas'),

-- Mariscos El Capitán
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Coctel de Camarón', 'Camarones cocidos con salsa especial', 120, 'Entradas'),
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Pulpo a las Brasas', 'Pulpo tierno asado con ajo y hierbas', 180, 'Platos Fuertes'),
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Pescado Frito Estilo Campeche', 'Robalo entero frito con arroz', 250, 'Platos Fuertes'),
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Filete de Pescado Empanizado', 'Con papas fritas y ensalada', 200, 'Platos Fuertes'),

-- Tacos El Fogón Maya
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Tacos de Cochinita Pibil', 'Orden de 4 tacos con cebolla morada', 85, 'Tacos'),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Sopa de Lima', 'Tradicional sopa yucateca con pollo', 65, 'Sopas'),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Poc Chuc', 'Carne de cerdo asada con frijol refrito', 120, 'Platos Fuertes'),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Panuchos Yucatecos', 'Tortillas rellenas de frijol con pollo', 95, 'Antojitos'),

-- Da Vinci
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Carpaccio di Manzo', 'Láminas de res con rúcula y parmesano', 280, 'Entradas'),
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Spaghetti alle Vongole', 'Pasta con almejas en salsa blanca', 320, 'Pasta'),
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Pizza Margherita', 'Tomate, mozzarella y albahaca fresca', 250, 'Pizzas'),
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Osso Buco alla Milanese', 'Jarrete de ternera con risotto', 480, 'Platos Fuertes'),

-- Café Nader
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Desayuno Mexicano', 'Huevos, frijoles, chilaquiles y café', 85, 'Desayunos'),
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Café de Olla', 'Café tradicional con canela y piloncillo', 35, 'Bebidas'),
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Molletes Poblanos', 'Pan con frijoles, queso y pico de gallo', 65, 'Desayunos'),
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Cheesecake de Guayaba', 'Postre artesanal con fruta tropical', 75, 'Postres');

-- Insertar reseñas
INSERT INTO reviews (restaurant_id, user_name, user_avatar, rating, comment, images) VALUES
-- La Pescadería del Puerto
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'María González', '/placeholder.svg?height=40&width=40', 5, 'Excelente experiencia! El ceviche estaba fresco y delicioso. El servicio fue muy atento y la vista al mar es espectacular. Definitivamente regresaremos.', ARRAY['/placeholder.svg?height=200&width=200']),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Carlos Mendoza', '/placeholder.svg?height=40&width=40', 4, 'Muy buena comida y ambiente familiar. Los precios son justos para la calidad que ofrecen. Recomiendo el pescado a la parrilla.', NULL),
((SELECT id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto'), 'Ana Rodríguez', '/placeholder.svg?height=40&width=40', 5, 'La langosta termidor es increíble! El lugar tiene una vista hermosa y el personal es muy profesional. Vale la pena cada peso.', NULL),

-- Mariscos El Capitán
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Roberto Silva', '/placeholder.svg?height=40&width=40', 4, 'Lugar tradicional con sabores auténticos. El coctel de camarón es de los mejores que he probado. Precios muy accesibles.'),
((SELECT id FROM restaurants WHERE slug = 'mariscos-el-capitan'), 'Lucia Herrera', '/placeholder.svg?height=40&width=40', 4, 'Ambiente familiar y comida casera. El pulpo a las brasas estaba perfecto. Recomendado para comer rico sin gastar mucho.'),

-- Tacos El Fogón Maya
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Diego Morales', '/placeholder.svg?height=40&width=40', 5, 'Los mejores tacos de cochinita pibil de Cancún! La sopa de lima también está deliciosa. Muy auténtico.'),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Carmen López', '/placeholder.svg?height=40&width=40', 5, 'Sabores tradicionales yucatecos preparados como debe ser. El poc chuc es espectacular. Lugar imperdible.'),
((SELECT id FROM restaurants WHERE slug = 'tacos-el-fogon-maya'), 'Fernando Vega', '/placeholder.svg?height=40&width=40', 4, 'Excelente relación calidad-precio. La cochinita se deshace en la boca. Ambiente casual y servicio rápido.'),

-- Da Vinci
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Isabella Rossi', '/placeholder.svg?height=40&width=40', 5, 'Auténtica cocina italiana en Cancún. El chef realmente sabe lo que hace. Perfecto para una cena romántica.'),
((SELECT id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci'), 'Miguel Ángel Torres', '/placeholder.svg?height=40&width=40', 4, 'Excelente pasta y pizzas. El ambiente es elegante y la vista a la laguna es hermosa. Un poco caro pero vale la pena.'),

-- Café Nader
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Patricia Jiménez', '/placeholder.svg?height=40&width=40', 4, 'Perfecto para desayunar. El café de olla es delicioso y los molletes están muy buenos. Ambiente acogedor.'),
((SELECT id FROM restaurants WHERE slug = 'cafe-nader'), 'Alejandro Ruiz', '/placeholder.svg?height=40&width=40', 4, 'Buen lugar para trabajar con laptop. WiFi rápido, café rico y precios justos. El cheesecake de guayaba es imperdible.');
