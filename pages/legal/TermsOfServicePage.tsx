import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const TermsOfServicePage = () => {
  return (
    <LegalPageLayout
      title="Uslovi korišćenja"
      subtitle="Pravila i uslovi korišćenja platforme TeretLink."
      lastUpdated="18.04.2026."
    >
      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">1. Opšte odredbe</h2>
        <p>
          Ovi Uslovi korišćenja („Uslovi") regulišu korišćenje platforme TeretLink („Platforma"), koja pruža
          usluge berze transporta — povezivanja prevoznika, špeditera i trgovinskih firmi. Korišćenjem Platforme
          potvrđujete da ste pročitali, razumeli i da prihvatate ove Uslove.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">2. Uslovi za korišćenje</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Platforma je namenjena isključivo registrovanim poslovnim subjektima.</li>
          <li>Korisnik mora biti punoletno lice (18+) ovlašćeno za zastupanje firme.</li>
          <li>Jedan poslovni subjekat može imati više korisničkih naloga, ali svi moraju biti povezani sa istom firmom.</li>
          <li>Nije dozvoljeno deljenje naloga sa trećim licima.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">3. Registracija i verifikacija</h2>
        <p>
          Prilikom registracije, korisnik je dužan da unese istinite i tačne podatke o sebi i firmi. TeretLink
          zadržava pravo da zahteva dodatnu dokumentaciju radi verifikacije (izvod iz APR-a, PIB potvrda i sl.).
          Nalozi sa lažnim podacima biće trajno suspendovani, bez povraćaja uplaćenih sredstava.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">4. Pretplate i naplata</h2>
        <p>Platforma nudi više planova pretplate:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-text-main">Free</strong> — osnovni pristup sa ograničenim funkcionalnostima.</li>
          <li><strong className="text-text-main">Standard</strong> — plaćeni mesečni plan sa proširenim mogućnostima.</li>
          <li><strong className="text-text-main">Pro</strong> — premium plan sa svim funkcionalnostima.</li>
        </ul>
        <p className="mt-3">
          Detaljne cene i razlike između planova dostupne su na stranici <a href="/#/pricing" className="text-brand-500 hover:underline">Cenovnik</a>.
          Pretplate se automatski obnavljaju do otkazivanja. Otkaz je moguć u bilo kom trenutku, ali bez
          povraćaja za neiskorišćeni deo perioda.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">5. Obaveze korisnika</h2>
        <p>Prilikom korišćenja Platforme, korisnik se obavezuje da:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Objavljuje samo istinite i proverene oglase</li>
          <li>Ne objavljuje isti oglas više puta (spam)</li>
          <li>Ne objavljuje oglase za robu ili usluge suprotne zakonu</li>
          <li>Ne koristi Platformu za prevaru, ucenu ili nezakonite radnje</li>
          <li>Poštuje dogovore sa drugim korisnicima</li>
          <li>Ne pokušava da zaobiđe sigurnosne mehanizme Platforme</li>
          <li>Ne koristi automatske alate (botove, skripte) za prikupljanje podataka</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">6. Odgovornost</h2>
        <p>
          TeretLink je posrednik koji povezuje strane, ali nije strana u samom ugovoru o prevozu. Sva prava
          i obaveze iz poslovnog odnosa (cena prevoza, uslovi plaćanja, osiguranje, šteta) regulišu se direktno
          između strana koje su sklopile dogovor.
        </p>
        <p className="mt-3">
          TeretLink ne garantuje za tačnost podataka koje korisnici objavljuju niti za ispunjenje obaveza
          između korisnika. Preporučujemo korisnicima da pre svake saradnje provere firmu (APR, ocene na
          Platformi, reference).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">7. Intelektualna svojina</h2>
        <p>
          Sav sadržaj Platforme (dizajn, logo, tekstovi, kod) predstavlja vlasništvo TeretLink-a i zaštićen je
          zakonima o intelektualnoj svojini. Zabranjeno je kopiranje, reprodukcija ili komercijalno korišćenje
          bez pismene saglasnosti.
        </p>
        <p className="mt-3">
          Korisnici zadržavaju prava na sadržaj koji sami objavljuju (oglasi, opisi), ali dodeljuju TeretLink-u
          pravo da taj sadržaj prikazuje u okviru Platforme.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">8. Suspenzija i ukidanje naloga</h2>
        <p>
          TeretLink zadržava pravo da privremeno ili trajno suspenduje nalog korisnika koji krši ove Uslove,
          bez prethodne najave i bez obaveze povraćaja uplaćenih sredstava. Korisnik može sam ukinuti svoj
          nalog u bilo kom trenutku preko stranice profila.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">9. Izmena Uslova</h2>
        <p>
          Zadržavamo pravo da izmenimo ove Uslove u bilo kom trenutku. O značajnim izmenama korisnici će biti
          obavešteni email-om ili obaveštenjem na Platformi. Nastavak korišćenja Platforme nakon izmena znači
          prihvatanje novih Uslova.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">10. Rešavanje sporova i merodavno pravo</h2>
        <p>
          Za sve sporove koji nastanu iz korišćenja Platforme, strane će prvo pokušati mirno rešenje. Ukoliko
          mirno rešenje nije moguće, nadležan je Privredni sud u Beogradu. Merodavno je pravo Republike Srbije.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">11. Kontakt</h2>
        <p>
          Za sva pitanja u vezi sa ovim Uslovima, možete nas kontaktirati:
        </p>
        <ul className="list-none pl-0 mt-2 space-y-1">
          <li><strong className="text-text-main">Email:</strong> <a href="mailto:info@teretlink.rs" className="text-brand-500 hover:underline">info@teretlink.rs</a></li>
          <li><strong className="text-text-main">Adresa:</strong> Beograd, Srbija</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};
