-- Verificar y corregir las foreign keys si es necesario
-- Esto asegura que las relaciones estén correctamente configuradas

-- Verificar que existen las foreign keys
DO $$
BEGIN
    -- Verificar foreign key de restaurants a cities
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'restaurants_city_id_fkey'
    ) THEN
        ALTER TABLE restaurants 
        ADD CONSTRAINT restaurants_city_id_fkey 
        FOREIGN KEY (city_id) REFERENCES cities(id);
    END IF;

    -- Verificar foreign key de restaurants a categories
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'restaurants_category_id_fkey'
    ) THEN
        ALTER TABLE restaurants 
        ADD CONSTRAINT restaurants_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES categories(id);
    END IF;
END $$;

-- Actualizar el conteo de restaurantes por ciudad
UPDATE cities SET restaurant_count = (
    SELECT COUNT(*) FROM restaurants WHERE restaurants.city_id = cities.id
);

-- Crear índices adicionales para mejorar performance
CREATE INDEX IF NOT EXISTS idx_restaurants_city_category ON restaurants(city_id, category_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating_desc ON restaurants(rating DESC);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_open ON restaurants(is_open);
