-- Insertar promociones
DO $$
DECLARE
    pescaderia_id UUID;
    capitan_id UUID;
    fogon_id UUID;
    davinci_id UUID;
    nader_id UUID;
BEGIN
    -- Obtener IDs de restaurantes
    SELECT id INTO pescaderia_id FROM restaurants WHERE slug = 'la-pescaderia-del-puerto';
    SELECT id INTO capitan_id FROM restaurants WHERE slug = 'mariscos-el-capitan';
    SELECT id INTO fogon_id FROM restaurants WHERE slug = 'tacos-el-fogon-maya';
    SELECT id INTO davinci_id FROM restaurants WHERE slug = 'restaurante-italiano-da-vinci';
    SELECT id INTO nader_id FROM restaurants WHERE slug = 'cafe-nader';

    -- Promociones para La Pescadería del Puerto
    INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
    (pescaderia_id, '2x1 en cervezas', 'Válido de lunes a viernes de 5pm a 7pm', '2024-12-31', true),
    (pescaderia_id, 'Ceviche gratis', 'Con consumo mínimo de $800 pesos', '2024-12-31', true);

    -- Promociones para Mariscos El Capitán
    INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
    (capitan_id, 'Martes de mariscos', '20% de descuento en todos los platillos', '2024-12-31', true);

    -- Promociones para Tacos El Fogón Maya
    INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
    (fogon_id, 'Combo familiar', '4 órdenes de tacos + 2 sopas de lima por $350', '2024-12-31', true),
    (fogon_id, 'Happy hour', 'Micheladas 2x1 de 4pm a 6pm', '2024-12-31', true);

    -- Promociones para Da Vinci
    INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
    (davinci_id, 'Noche romántica', 'Cena para 2 con botella de vino incluida', '2024-12-31', true);

    -- Promociones para Café Nader
    INSERT INTO promotions (restaurant_id, title, description, valid_until, is_active) VALUES
    (nader_id, 'Desayuno completo', 'Café americano gratis con cualquier desayuno', '2024-12-31', true);

    -- Menú para La Pescadería del Puerto
    INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
    (pescaderia_id, 'Ceviche Mixto', 'Pescado blanco, camarón y pulpo marinado en limón', 180, 'Entradas'),
    (pescaderia_id, 'Aguachile Verde', 'Camarones frescos en salsa verde picante', 220, 'Entradas'),
    (pescaderia_id, 'Pescado a la Parrilla', 'Mero fresco con guarnición de verduras', 320, 'Platos Fuertes'),
    (pescaderia_id, 'Langosta Termidor', 'Langosta gratinada con queso y especias', 650, 'Platos Fuertes'),
    (pescaderia_id, 'Sopa de Mariscos', 'Caldo concentrado con mariscos mixtos', 280, 'Sopas');

    -- Menú para Mariscos El Capitán
    INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
    (capitan_id, 'Coctel de Camarón', 'Camarones cocidos con salsa especial', 120, 'Entradas'),
    (capitan_id, 'Pulpo a las Brasas', 'Pulpo tierno asado con ajo y hierbas', 180, 'Platos Fuertes'),
    (capitan_id, 'Pescado Frito Estilo Campeche', 'Robalo entero frito con arroz', 250, 'Platos Fuertes'),
    (capitan_id, 'Filete de Pescado Empanizado', 'Con papas fritas y ensalada', 200, 'Platos Fuertes');

    -- Menú para Tacos El Fogón Maya
    INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
    (fogon_id, 'Tacos de Cochinita Pibil', 'Orden de 4 tacos con cebolla morada', 85, 'Tacos'),
    (fogon_id, 'Sopa de Lima', 'Tradicional sopa yucateca con pollo', 65, 'Sopas'),
    (fogon_id, 'Poc Chuc', 'Carne de cerdo asada con frijol refrito', 120, 'Platos Fuertes'),
    (fogon_id, 'Panuchos Yucatecos', 'Tortillas rellenas de frijol con pollo', 95, 'Antojitos');

    -- Menú para Da Vinci
    INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
    (davinci_id, 'Carpaccio di Manzo', 'Láminas de res con rúcula y parmesano', 280, 'Entradas'),
    (davinci_id, 'Spaghetti alle Vongole', 'Pasta con almejas en salsa blanca', 320, 'Pasta'),
    (davinci_id, 'Pizza Margherita', 'Tomate, mozzarella y albahaca fresca', 250, 'Pizzas'),
    (davinci_id, 'Osso Buco alla Milanese', 'Jarrete de ternera con risotto', 480, 'Platos Fuertes');

    -- Menú para Café Nader
    INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
    (nader_id, 'Desayuno Mexicano', 'Huevos, frijoles, chilaquiles y café', 85, 'Desayunos'),
    (nader_id, 'Café de Olla', 'Café tradicional con canela y piloncillo', 35, 'Bebidas'),
    (nader_id, 'Molletes Poblanos', 'Pan con frijoles, queso y pico de gallo', 65, 'Desayunos'),
    (nader_id, 'Cheesecake de Guayaba', 'Postre artesanal con fruta tropical', 75, 'Postres');

    -- Reseñas para La Pescadería del Puerto
    INSERT INTO reviews (restaurant_id, user_name, user_avatar, rating, comment, images) VALUES
    (pescaderia_id, 'María González', '/placeholder.svg?height=40&width=40', 5, 'Excelente experiencia! El ceviche estaba fresco y delicioso. El servicio fue muy atento y la vista al mar es espectacular. Definitivamente regresaremos.', ARRAY['/placeholder.svg?height=200&width=200']),
    (pescaderia_id, 'Carlos Mendoza', '/placeholder.svg?height=40&width=40', 4, 'Muy buena comida y ambiente familiar. Los precios son justos para la calidad que ofrecen. Recomiendo el pescado a la parrilla.', NULL),
    (pescaderia_id, 'Ana Rodríguez', '/placeholder.svg?height=40&width=40', 5, 'La langosta termidor es increíble! El lugar tiene una vista hermosa y el personal es muy profesional. Vale la pena cada peso.', NULL);

    -- Reseñas para Mariscos El Capitán
    INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
    (capitan_id, 'Roberto Silva', 4, 'Lugar tradicional con sabores auténticos. El coctel de camarón es de los mejores que he probado. Precios muy accesibles.'),
    (capitan_id, 'Lucia Herrera', 4, 'Ambiente familiar y comida casera. El pulpo a las brasas estaba perfecto. Recomendado para comer rico sin gastar mucho.');

    -- Reseñas para Tacos El Fogón Maya
    INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
    (fogon_id, 'Diego Morales', 5, 'Los mejores tacos de cochinita pibil de Cancún! La sopa de lima también está deliciosa. Muy auténtico.'),
    (fogon_id, 'Carmen López', 5, 'Sabores tradicionales yucatecos preparados como debe ser. El poc chuc es espectacular. Lugar imperdible.'),
    (fogon_id, 'Fernando Vega', 4, 'Excelente relación calidad-precio. La cochinita se deshace en la boca. Ambiente casual y servicio rápido.');

    -- Reseñas para Da Vinci
    INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
    (davinci_id, 'Isabella Rossi', 5, 'Auténtica cocina italiana en Cancún. El chef realmente sabe lo que hace. Perfecto para una cena romántica.'),
    (davinci_id, 'Miguel Ángel Torres', 4, 'Excelente pasta y pizzas. El ambiente es elegante y la vista a la laguna es hermosa. Un poco caro pero vale la pena.');

    -- Reseñas para Café Nader
    INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
    (nader_id, 'Patricia Jiménez', 4, 'Perfecto para desayunar. El café de olla es delicioso y los molletes están muy buenos. Ambiente acogedor.'),
    (nader_id, 'Alejandro Ruiz', 4, 'Buen lugar para trabajar con laptop. WiFi rápido, café rico y precios justos. El cheesecake de guayaba es imperdible.');

END $$;
