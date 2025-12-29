import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

// Lista kategorii mebli z sitemap-pumo.xml
const categories = [
    { title: 'Biurka Gamingowe', slug: 'Biurka_Biurka_gamingowe', description: 'Porównanie cen i modeli biurek gamingowych z AI asystentem' },
    { title: 'Biurka Narożne', slug: 'Biurka_Biurka_narożne', description: 'Przewodnik po biurkach narożnych - porównanie cen i funkcji' },
    { title: 'Biurka Proste', slug: 'Biurka_Biurka_proste', description: 'Biurka proste - kompleksowy przewodnik zakupowy z AI' },
    { title: 'Biurka z Regulacją Wysokości', slug: 'Biurka_Biurka_z_regulacją_wysokości', description: 'Biurka z regulacją wysokości - porównanie modeli i cen' },
    { title: 'Biurka z Szufladami', slug: 'Biurka_Biurka_z_szufladami_i_drzwiami', description: 'Przewodnik po biurkach z szufladami i drzwiami' },
    { title: 'Części do Biurek', slug: 'Biurka_Części_do_biurek', description: 'Akcesoria i części do biurek - kompleksowy przegląd' },
    { title: 'Akcesoria do Mebli', slug: 'Dodatki_do_mebli_Akcesoria_', description: 'Akcesoria do mebli - porównanie cen i modeli' },
    { title: 'Części do Mebli', slug: 'Dodatki_do_mebli_Części_do_mebli', description: 'Części zamienne do mebli - przewodnik zakupowy' },
    { title: 'Oświetlenie LED', slug: 'Dodatki_do_mebli_Oświetlenie_LED', description: 'Oświetlenie LED do mebli - porównanie i ceny' },
    { title: 'Fotele Bujane', slug: 'Fotele_Fotele_bujane', description: 'Fotele bujane - kompleksowy przewodnik zakupowy' },
    { title: 'Fotele do Biurka', slug: 'Fotele_Fotele_do_biurka', description: 'Fotele biurowe - porównanie modeli i cen z AI asystentem' },
    { title: 'Fotele Kubełkowe', slug: 'Fotele_Fotele_kubełkowe', description: 'Fotele kubełkowe - przewodnik po modelach i cenach' },
    { title: 'Fotele Młodzieżowe', slug: 'Fotele_Fotele_młodzieżowe', description: 'Fotele młodzieżowe - porównanie i przewodnik zakupowy' },
    { title: 'Fotele Ogrodowe', slug: 'Fotele_Fotele_ogrodowe', description: 'Fotele ogrodowe - kompleksowy przegląd modeli' },
    { title: 'Fotele Rozkładane', slug: 'Fotele_Fotele_rozkładane', description: 'Fotele rozkładane - porównanie cen i funkcji' },
    { title: 'Fotele Wypoczynkowe', slug: 'Fotele_Fotele_wypoczynkowe', description: 'Fotele wypoczynkowe - przewodnik zakupowy z AI' },
    { title: 'Krzesła Barowe', slug: 'Krzesła_Hokery_i_krzesła_barowe', description: 'Hokery i krzesła barowe - porównanie modeli' },
    { title: 'Krzesła Kuchenne', slug: 'Krzesła_Krzesła_kuchenne', description: 'Krzesła kuchenne - kompleksowy przewodnik zakupowy' },
    { title: 'Krzesła Młodzieżowe', slug: 'Krzesła_Krzesła_młodzieżowe', description: 'Krzesła młodzieżowe - porównanie cen i modeli' },
    { title: 'Krzesła Ogrodowe', slug: 'Krzesła_Krzesła_ogrodowe', description: 'Krzesła ogrodowe - przewodnik po modelach i cenach' },
    { title: 'Krzesła Tapicerowane', slug: 'Krzesła_Krzesła_tapicerowane', description: 'Krzesła tapicerowane - kompleksowy przegląd' },
    { title: 'Łóżka 120x200', slug: 'Łóżka_Łóżka_120x200', description: 'Łóżka 120x200 - porównanie modeli i cen' },
    { title: 'Łóżka 140x200', slug: 'Łóżka_Łóżka_140x200', description: 'Łóżka 140x200 - przewodnik zakupowy z AI asystentem' },
    { title: 'Łóżka 160x200', slug: 'Łóżka_Łóżka_160x200', description: 'Łóżka 160x200 - kompleksowe porównanie modeli' },
    { title: 'Łóżka 180x200', slug: 'Łóżka_Łóżka_180x200', description: 'Łóżka 180x200 - przewodnik po modelach i cenach' },
    { title: 'Łóżka 200x200', slug: 'Łóżka_Łóżka_200x200', description: 'Łóżka 200x200 - porównanie i przewodnik zakupowy' },
    { title: 'Łóżka 80x190', slug: 'Łóżka_Łóżka_80x190', description: 'Łóżka 80x190 - kompleksowy przegląd modeli' },
    { title: 'Łóżka 90x200', slug: 'Łóżka_Łóżka_90x200', description: 'Łóżka 90x200 - porównanie cen i funkcji' },
    { title: 'Łóżka z Pojemnikiem', slug: 'Łóżka_Łóżka_z_pojemnikiem_na_pościel', description: 'Łóżka z pojemnikiem na pościel - przewodnik zakupowy' },
    { title: 'Materace', slug: 'Łóżka_Materace', description: 'Materace - kompleksowe porównanie modeli i cen' },
    { title: 'Wezgłowia', slug: 'Łóżka_Wezgłowia', description: 'Wezgłowia do łóżek - przewodnik po modelach' },
    { title: 'Meble Kuchenne', slug: 'Meble_kuchenne_Meble_kuchenne', description: 'Meble kuchenne - kompleksowy przewodnik zakupowy' },
    { title: 'Meble Łazienkowe', slug: 'Meble_łazienkowe_Meble_łazienkowe', description: 'Meble łazienkowe - porównanie modeli i cen' },
    { title: 'Meble Młodzieżowe', slug: 'Meble_młodzieżowe_Zestawy_mebli_młodzieżowych', description: 'Zestawy mebli młodzieżowych - kompleksowy przegląd' },
    { title: 'Regały i Półki', slug: 'Regały_i_półki_Regały_i_półki', description: 'Regały i półki - przewodnik zakupowy z AI' },
    { title: 'Sofy Narożne', slug: 'Sofy_Narożniki', description: 'Sofy narożne - porównanie modeli i cen' },
    { title: 'Sofy Rozkładane', slug: 'Sofy_Sofy_rozkładane', description: 'Sofy rozkładane - kompleksowy przewodnik zakupowy' },
    { title: 'Sofy z Funkcją Spania', slug: 'Sofy_Sofy_z_funkcją_spania', description: 'Sofy z funkcją spania - porównanie i przewodnik' },
    { title: 'Szafki RTV', slug: 'Stoły_i_szafki_RTV_Szafki_pod_telewizor', description: 'Szafki RTV - przewodnik po modelach i cenach' },
    { title: 'Stoliki Kawowe', slug: 'Stoły_i_szafki_RTV_Stoliki_kawowe', description: 'Stoliki kawowe - kompleksowe porównanie modeli' },
    { title: 'Stoły Konferencyjne', slug: 'Stoły_Stoły_konferencyjne', description: 'Stoły konferencyjne - przewodnik zakupowy' },
    { title: 'Stoły Ogrodowe', slug: 'Stoły_Stoły_ogrodowe', description: 'Stoły ogrodowe - porównanie cen i modeli' },
    { title: 'Stoły Rozkładane', slug: 'Stoły_Stoły_rozkładane', description: 'Stoły rozkładane - kompleksowy przegląd' },
    { title: 'Szafy', slug: 'Szafy_Szafy', description: 'Szafy - przewodnik zakupowy z AI asystentem' },
    { title: 'Szafy Narożne', slug: 'Szafy_Szafy_narożne', description: 'Szafy narożne - porównanie modeli i cen' },
    { title: 'Szafy Przesuwne', slug: 'Szafy_Szafy_przesuwne', description: 'Szafy przesuwne - kompleksowe porównanie' },
    { title: 'Witryny', slug: 'Witryny_i_komody_Witryny', description: 'Witryny - przewodnik po modelach i cenach' },
    { title: 'Komody', slug: 'Witryny_i_komody_Komody', description: 'Komody - kompleksowy przewodnik zakupowy' },
];

export const prerender = true;

export async function GET(context: APIContext) {
    const baseUrl = 'https://www.mybonzoaiblog.com';

    return rss({
        title: 'AI Blog - Przewodnik po Meblach Pumo',
        description: 'Kompleksowy przewodnik po 48 kategoriach mebli z porównaniem cen, modeli i AI asystentem. Automatyczna aktualizacja danych z meblepumo.pl',
        site: baseUrl,
        items: categories.map(category => ({
            title: category.title,
            description: category.description,
            link: `${baseUrl}/pumo-guide/${category.slug}`,
            pubDate: new Date(),
            categories: ['meble', 'przewodnik zakupowy', 'porównanie cen', 'AI asystent'],
            customData: `
        <enclosure url="${baseUrl}/pumo-guide/${category.slug}" type="text/html"/>
        <source url="${baseUrl}/rss.xml">AI Blog - Przewodnik po Meblach</source>
      `,
        })),
        customData: `
      <language>pl-PL</language>
      <copyright>© 2025 MyBonzo AI Blog</copyright>
      <managingEditor>mybonzoaiblog@gmail.com (MyBonzo AI Blog)</managingEditor>
      <webMaster>mybonzoaiblog@gmail.com (MyBonzo AI Blog)</webMaster>
      <ttl>30</ttl>
      <image>
        <url>${baseUrl}/favicon.svg</url>
        <title>AI Blog - Przewodnik po Meblach Pumo</title>
        <link>${baseUrl}</link>
      </image>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    `,
        xmlns: {
            atom: 'http://www.w3.org/2005/Atom',
            content: 'http://purl.org/rss/1.0/modules/content/',
            dc: 'http://purl.org/dc/elements/1.1/',
        },
    });
}
