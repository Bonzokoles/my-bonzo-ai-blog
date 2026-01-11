-- Update products with real URLs from products.json
-- Total products: 5 (TEST SAMPLE - need full extraction)

UPDATE products SET real_url = 'https://www.meblepumo.pl/pl/products/stelaz-power42-nv-609.feed10009' WHERE id = '609';
UPDATE products SET real_url = 'https://www.meblepumo.pl/pl/products/kieszenie-do-lozka-rozowe-93x38-cm-steens-2080.feed10009' WHERE id = '2080';
UPDATE products SET real_url = 'https://www.meblepumo.pl/pl/products/oswietlenie-1-led-czerwone-high-glossy-furniture-10422.feed10009' WHERE id = '10422';
UPDATE products SET real_url = 'https://www.meblepumo.pl/pl/products/totality-biale-oswietlenie-do-polki-18497.feed10009' WHERE id = '18497';
UPDATE products SET real_url = 'https://www.meblepumo.pl/pl/products/wieszaki-stojace-do-przedpokoju-czarny-w55-19447.feed10009' WHERE id = '19447';
