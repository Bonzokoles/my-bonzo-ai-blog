import type { APIRoute } from "astro";

/**
 * IndexNow API - Automatyczne powiadamianie Bing, Yandex o nowych/zaktualizowanych stronach
 * Dokumentacja: https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = "8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f"; // Unikalny klucz dla domeny

export const POST: APIRoute = async ({ request }) => {
    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls)) {
            return new Response(
                JSON.stringify({ error: "urls array required" }),
                { status: 400 }
            );
        }

        const host = "mybonzoaiblog.pages.dev";

        // Ping IndexNow (obsługuje Bing, Yandex, Seznam.cz, Naver)
        const indexNowResponse = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                host,
                key: INDEXNOW_KEY,
                keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
                urlList: urls.map(url => `https://${host}${url}`)
            })
        });

        const results = {
            indexnow: indexNowResponse.ok ? "submitted" : "failed",
            urls: urls.length
        };

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
};

// Automatyczne generowanie pełnej listy URL do indeksacji
export const GET: APIRoute = async () => {
    const pumoGuidePages = [
        "/pumo-guide/",
        "/pumo-guide/agent",
        "/pumo-guide/Biurka_Biurka_gamingowe",
        "/pumo-guide/Biurka_Biurka_narożne",
        "/pumo-guide/Biurka_Biurka_proste",
        "/pumo-guide/Biurka_Biurka_z_regulacją_wysokości",
        "/pumo-guide/Biurka_Biurka_z_szufladami_i_drzwiami",
        "/pumo-guide/Biurka_Części_do_biurek",
        "/pumo-guide/Dodatki_do_mebli_Akcesoria_",
        "/pumo-guide/Dodatki_do_mebli_Części_do_mebli",
        "/pumo-guide/Dodatki_do_mebli_Oświetlenie_LED",
        "/pumo-guide/Fotele_Fotele_bujane",
        "/pumo-guide/Fotele_Fotele_do_biurka",
        "/pumo-guide/Fotele_Fotele_kubełkowe",
        "/pumo-guide/Fotele_Fotele_młodzieżowe",
        "/pumo-guide/Fotele_Fotele_ogrodowe",
        "/pumo-guide/Fotele_Fotele_rozkładane",
        "/pumo-guide/Fotele_Fotele_wypoczynkowe",
        "/pumo-guide/Hokery",
        "/pumo-guide/Komody_Komody_z_drzwiami",
        "/pumo-guide/Komody_Komody_z_szufladami",
        "/pumo-guide/Komody_Komody_z_szufladami_i_drzwiami",
        "/pumo-guide/Kontenerki",
        "/pumo-guide/Krzesła_Krzesła_do_jadalni",
        "/pumo-guide/Krzesła_Krzesła_na_płozie",
        "/pumo-guide/Krzesła_Krzesła_ogrodowe",
        "/pumo-guide/Lustra",
        "/pumo-guide/Materace_Materace_piankowe",
        "/pumo-guide/Materace_Materace_sprężynowe_kieszeniowe",
        "/pumo-guide/Meblościanki",
        "/pumo-guide/Pozostałe_produkty",
        "/pumo-guide/Pufy",
        "/pumo-guide/Półki_wiszące",
        "/pumo-guide/Regały",
        "/pumo-guide/Sofy_i_narożniki_Narożniki",
        "/pumo-guide/Sofy_i_narożniki_Sofy_2_osobowe",
        "/pumo-guide/Sofy_i_narożniki_Sofy_3_osobowe",
        "/pumo-guide/Stelaże",
        "/pumo-guide/Stoliki_kawowe_i_ławy_Stoliki_kawowe",
        "/pumo-guide/Stoliki_kawowe_i_ławy_Ławostoły",
        "/pumo-guide/Stoliki_kawowe_i_ławy_Ławy",
        "/pumo-guide/Stoly_Stoły_nierozkładane",
        "/pumo-guide/Stoly_Stoły_ogrodowe",
        "/pumo-guide/Stoly_Stoły_rozkładane",
        "/pumo-guide/Szafki_kuchenne",
        "/pumo-guide/Szafki_modułowe",
        "/pumo-guide/Szafki_na_buty",
        "/pumo-guide/Szafki_nocne",
        "/pumo-guide/Szafki_RTV",
        "/pumo-guide/Szafy_Nadstawki_na_szafę",
        "/pumo-guide/Szafy_Szafy_uchylne",
        "/pumo-guide/Szezlongi",
        "/pumo-guide/Toaletki_i_konsole_Konsole_",
        "/pumo-guide/Toaletki_i_konsole_Toaletki",
        "/pumo-guide/Wieszaki_na_ubrania_Wieszaki_stojące",
        "/pumo-guide/Wieszaki_na_ubrania_Wieszaki_ścienne",
        "/pumo-guide/Witryny_i_kredensy_Witryny",
        "/pumo-guide/Zestawy_mebli_Zestawy_mebli_do_jadalni",
        "/pumo-guide/Zestawy_mebli_Zestawy_mebli_kuchennych",
        "/pumo-guide/Ławki_do_przedpokoju",
        "/pumo-guide/Łóżka_dziecięce",
        "/pumo-guide/Łóżka_i_części_Części_do_łóżek",
        "/pumo-guide/Łóżka_i_części_Stelaże_do_łóżek",
        "/pumo-guide/Łóżka_i_części_Łóżka"
    ];

    return new Response(JSON.stringify({ urls: pumoGuidePages }), {
        headers: { "Content-Type": "application/json" }
    });
};
