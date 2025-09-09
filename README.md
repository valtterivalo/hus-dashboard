/**
hus-dashboard — sotkanet-demo (hus)
*/

Yleiskuvaus
- kevyt next.js-sovellus (app router), joka hakee kolmen sotkanet‑indikaattorin aikasarjat ja näyttää ne hus‑alueelta (id 629).
- käyttöliittymä on suomeksi, käyttäjä valitsee yhden indikaattorin kerrallaan.
- esitys: viivakaavio, pari kpi-korttia ja taulukko. virheet ja puuttuva data käsitellään mahdollisimman agnostisesti ja siististi.

Ajaminen
- vaatimus: node 20+
- asennus: `npm i`
- kehitys: `npm run dev` ja selaimella http://localhost:3000
- "tuotanto": `npm run build && npm start`

Stäkki
- next.js 15 (app router) + typescript, oma valintani käytännössä kaikkeen verkkokehitykseen laajan tuen ja yhteisön sekä kattavien ominaisuuksien takia.
- shadcn komponentit, yksinkertainen ja helppo, sekä omaan makuuni sopivan minimalistinen ja mielikuvitukseton komponenttikirjasto.
- recharts kaaviota varten (shadcn chart‑kääreet), ns. shadcn natiivit kaaviot.
- node ja npm valittu pitkälti laajan tuen takia, suosin itse pnpm ja bun runtimejä mutten halunnut lisätä ylimääräisiä riippuvuuksia tähän projektiin.

Käytetyt indikaattorit
- 5070 — Päivystyskäynnit erikoissairaanhoidossa 75 vuotta täyttäneillä / 1 000 vastaavan ikäistä
- 5342 — Lonkkamurtumapotilaat, jotka on leikattu 0–2 päivän kuluessa sairaalaan tulosta, % (vakioimaton)
- 5358 — Hoitohenkilökunnan influenssarokotuskattavuus erikoissairaanhoidossa

Datan hakeminen
- metadata: `/api/sotkanet/metadata/:id` (otsikko, vuosialue, desimaalit, arvo‑yksikkö)
- aikasarja: `/api/sotkanet/series?indicator=ID&start=YYYY&end=YYYY&gender=total` (puuttuvat vuodet → null)

Käyttö
- valinta ylhäällä, oletuksena ensimmäinen indikaattori.
- kaavio näyttää joko arvon tai absoluuttisen arvon (yläpalkin painike). arvon desimaalit tulevat metadatasta, absoluuttinen on kokonaisluku.
- puuttuvat vuodet näkyvät katkoksina kaaviossa ja viivoina taulukossa.

Oletukset ja rajaukset
- sukupuoli lukittu arvoon `total` yksinkertaisuuden vuoksi.
- vuodet = metadatan range.start..range.end.
- pieni next.js api‑kerros (välttää cors/online‑rajoitteet ja suodattaa hus‑alueen palvelimella).
- en kirjoittanut testejä, pidin riippuvuudet minimissä. jos tätä jatkettaisiin, aloittaisin unit testeillä sarjamuunnoksille (lib/series.ts) ja kevyellä apin mockatulla vastauksella.
- kontitus tai starttiskriptien kirjoittaminen mielestäni tarpeetonta näin yksinkertaiseen repoon.

Viittaukset
- tietolähde: Sotkanet / THL (Creative Commons Attribution 4.0, http://www.sotkanet.fi/)
- käytetyt indikaattorit:
  1) Päivystyskäynnit erikoissairaanhoidossa 75 vuotta täyttäneillä / 1 000 vastaavan ikäistä (ID 5070)
  2) Lonkkamurtumapotilaat, jotka on leikattu 0–2 päivän kuluessa sairaalaan tulosta, % (vakioimaton) (ID 5342)
  3) Hoitohenkilökunnan influenssarokotuskattavuus erikoissairaanhoidossa (ID 5358)

Kuvakaappaus
- placeholder
