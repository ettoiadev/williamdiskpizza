-- =====================================================
-- William Disk Pizza CMS - Dados Iniciais (Seed)
-- =====================================================
-- 
-- Este script popula o banco com dados iniciais
-- baseados no conteúdo atual do site.
-- =====================================================

-- =====================================================
-- SITE CONTENT - Hero Section
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('hero', 'title', '"William Disk Pizza"', 'text'),
('hero', 'subtitle', '"As melhores pizzas da região há 35 anos! Ingredientes frescos, massa artesanal e muito amor em cada fatia. Delivery rápido e sabor inesquecível."', 'text'),
('hero', 'image_url', '"/images/f16f8dd6-6832-4d92-9d77-586f8cfac02b.png"', 'image'),
('hero', 'cta_text', '"Fazer Pedido"', 'text'),
('hero', 'cta_link', '"tel:+551239517565"', 'text')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Stats Section
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('stats', 'years', '35', 'number'),
('stats', 'clients', '"+10k"', 'text'),
('stats', 'delivery_time', '"30min"', 'text'),
('stats', 'rating', '"4.9★"', 'text')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Features
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('features', 'feature_1', '{"title": "Entrega Rápida", "description": "Delivery em até 30 minutos para toda a região. Sua pizza quentinha direto no seu endereço!", "icon": "Clock"}', 'json'),
('features', 'feature_2', '{"title": "Ingredientes Frescos", "description": "Selecionamos os melhores ingredientes diariamente. Qualidade que você pode sentir em cada mordida.", "icon": "Heart"}', 'json'),
('features', 'feature_3', '{"title": "Tradição Familiar", "description": "35 anos servindo pizzas com receitas especiais da família. Tradição e sabor únicos!", "icon": "Award"}', 'json')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Contact Info
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('contact', 'phone_primary', '"(12) 3951-7565"', 'text'),
('contact', 'phone_secondary', '"(12) 3961-3004"', 'text'),
('contact', 'whatsapp', '"5512996367326"', 'text'),
('contact', 'email', '"contato@williamdiskpizza.com.br"', 'text'),
('contact', 'address', '"R. Bernardino de Campos, 143 - Jacareí SP"', 'text'),
('contact', 'map_embed_url', '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.4!2d-45.9658!3d-23.2955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a7e7b7b7b7b%3A0x7b7b7b7b7b7b7b7b!2sR.%20Bernardino%20de%20Campos%2C%20143%20-%20Jacare%C3%AD%2C%20SP!5e0!3m2!1spt!2sbr!4v1234567890"', 'text')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Business Hours
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('business_hours', 'days', '"Terça a Domingo"', 'text'),
('business_hours', 'hours', '"18:00 às 23:00"', 'text'),
('business_hours', 'is_open', 'true', 'json')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - About Section
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('about', 'title', '"Conheça a William Disk Pizza"', 'text'),
('about', 'subtitle', '"Uma história de paixão, tradição e muito sabor que começou há 35 anos"', 'text'),
('about', 'history', '"Há 35 anos, nossa paixão por pizza começou em casa, em 1990, servindo vizinhos, amigos e familiares. Com o boca a boca, surgiram nossos primeiros clientes, que passaram a nos chamar de William Disk Pizza. Assim, conquistamos uma clientela fiel, que nos acompanha até hoje. Crescemos, informatizamos nosso serviço em 1992 e mudamos para espaços maiores, sempre mantendo a qualidade e o carinho no atendimento."', 'text'),
('about', 'mission', '"Proporcionar momentos únicos através do sabor autêntico das nossas pizzas, mantendo viva a tradição familiar e criando memórias afetivas em cada entrega. Queremos estar presente nos melhores momentos da vida dos nossos clientes."', 'text')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Promo Banner
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('promo_banner', 'title', '"🍕 PROMOÇÃO ESPECIAL!"', 'text'),
('promo_banner', 'description', '"2 Pizzas Grandes por apenas R$ 89,90 • Válido até domingo"', 'text'),
('promo_banner', 'cta_text', '"Aproveitar"', 'text'),
('promo_banner', 'cta_link', '"tel:+551239517565"', 'text'),
('promo_banner', 'is_active', 'true', 'json')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- SITE CONTENT - Social Links
-- =====================================================
INSERT INTO public.site_content (section, key, value, type) VALUES
('social_links', 'instagram', '"https://instagram.com/williamdiskpizza"', 'text'),
('social_links', 'facebook', '"https://facebook.com/williamdiskpizza"', 'text')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- TESTIMONIALS - Depoimentos Iniciais
-- =====================================================
INSERT INTO public.testimonials (name, rating, comment, location, is_active, "order") VALUES
('Maria Silva', 5, 'A melhor pizza de Jacareí! A massa é perfeita e os ingredientes são sempre frescos. Já sou cliente há mais de 10 anos.', 'Centro, Jacareí', true, 1),
('João Santos', 5, 'Delivery sempre pontual e as pizzas chegam quentinhas. A pizza portuguesa é sensacional! Recomendo para toda família.', 'Vila Branca, Jacareí', true, 2),
('Ana Costa', 5, 'Tradição e qualidade que se mantém ao longo dos anos. A pizza margherita é a minha favorita. Atendimento sempre excelente!', 'Jardim Paraíba, Jacareí', true, 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- GALLERY - Imagens Placeholder
-- =====================================================
INSERT INTO public.gallery (title, image_url, alt_text, "order", is_active) VALUES
('Pizza Margherita', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop', 'Pizza Margherita artesanal', 1, true),
('Pizza Pepperoni', 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=500&h=400&fit=crop', 'Pizza Pepperoni tradicional', 2, true),
('Pizza Quatro Queijos', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500&h=400&fit=crop', 'Pizza Quatro Queijos especial', 3, true),
('Pizza Portuguesa', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=400&fit=crop', 'Pizza Portuguesa completa', 4, true),
('Nosso Pizzaiolo', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop', 'Pizzaiolo preparando massa', 5, true),
('Forno Artesanal', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop', 'Forno a lenha tradicional', 6, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETTINGS - Configurações Gerais
-- =====================================================
INSERT INTO public.settings (key, value, description) VALUES
('site_name', '"William Disk Pizza"', 'Nome do site'),
('site_description', '"As melhores pizzas de Jacareí há 35 anos. Delivery rápido e ingredientes frescos."', 'Descrição do site para SEO'),
('logo_url', '"/images/0224011b-9067-486b-a363-2b2b99b36403.png"', 'URL do logo principal'),
('primary_color', '"#ef4444"', 'Cor primária do site (vermelho)'),
('secondary_color', '"#f97316"', 'Cor secundária do site (laranja)'),
('menu_url', '"https://cardapiodigital.williamdiskpizza.com.br"', 'URL do cardápio digital externo'),
('meta_keywords', '["pizza", "pizzaria", "jacareí", "delivery", "massa artesanal"]', 'Palavras-chave para SEO')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- Concluído!
-- =====================================================

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Dados iniciais inseridos com sucesso!';
    RAISE NOTICE '📊 Verifique as tabelas: site_content, testimonials, gallery, settings';
END $$;
