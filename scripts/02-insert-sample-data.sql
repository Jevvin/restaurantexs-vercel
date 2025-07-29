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

-- Obtener IDs para referencias
DO $$
DECLARE
    cancun_id UUID;
    mariscos_id UUID;
    mexicana_id UUID;
    internacional_id UUID;
BEGIN
    -- Obtener IDs
    SELECT id INTO cancun_id FROM cities WHERE slug = 'cancun';
    SELECT id INTO mariscos_id FROM categories WHERE slug = 'mariscos';
    SELECT id INTO mexicana_id FROM categories WHERE slug = 'comida-mexicana';
    SELECT id INTO internacional_id FROM categories WHERE slug = 'internacional';

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
        mariscos_id,
        cancun_id,
        'Blvd. Kukulcán Km 9.5, Zona Hotelera, 77500 Cancún, Q.R.',
        POINT(-86.8515, 21.1619),
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
        mariscos_id,
        cancun_id,
        'Av. Tulum 145, Centro, 77500 Cancún, Q.R.',
        POINT(-86.8466, 21.1743),
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
        mexicana_id,
        cancun_id,
        'Av. Yaxchilán 31, SM 22, 77500 Cancún, Q.R.',
        POINT(-86.8312, 21.1611),
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
        internacional_id,
        cancun_id,
        'Blvd. Kukulcán Km 14.2, Zona Hotelera, 77500 Cancún, Q.R.',
        POINT(-86.8234, 21.0845),
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
        cancun_id,
        'Av. Nader 5, Centro, 77500 Cancún, Q.R.',
        POINT(-86.8515, 21.1619),
        4.3,
        445,
        'budget',
        ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
        ARRAY['WiFi gratuito', 'Aire acondicionado', 'Terraza', 'Café de especialidad', 'Repostería artesanal', 'Desayunos todo el día'],
        '{"lun": {"open": "07:00", "close": "15:00", "isClosed": false}, "mar": {"open": "07:00", "close": "15:00", "isClosed": false}, "mie": {"open": "07:00", "close": "15:00", "isClosed": false}, "jue": {"open": "07:00", "close": "15:00", "isClosed": false}, "vie": {"open": "07:00", "close": "16:00", "isClosed": false}, "sab": {"open": "08:00", "close": "16:00", "isClosed": false}, "dom": {"open": "08:00", "close": "14:00", "isClosed": false}}',
        true,
        false
    );
END $$;
