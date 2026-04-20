import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      title="Politika privatnosti"
      subtitle="Kako prikupljamo, koristimo i štitimo vaše podatke."
      lastUpdated="18.04.2026."
    >
      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">1. Uvod</h2>
        <p>
          TeretLink (u daljem tekstu: „Platforma") posvećen je zaštiti privatnosti svojih korisnika. Ova Politika
          privatnosti objašnjava koje lične podatke prikupljamo, zašto ih prikupljamo, kako ih koristimo i kako ih
          štitimo u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije i GDPR regulativom.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">2. Koje podatke prikupljamo</h2>
        <p>Prilikom registracije i korišćenja Platforme prikupljamo sledeće kategorije podataka:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-text-main">Podaci o ličnosti:</strong> ime i prezime, pozicija u firmi, email adresa, telefonski brojevi.</li>
          <li><strong className="text-text-main">Podaci o firmi:</strong> naziv firme, PIB, matični broj, adresa, kontakt podaci.</li>
          <li><strong className="text-text-main">Podaci o oglasima:</strong> rute, destinacije, podaci o teretima/kamionima koje objavljujete.</li>
          <li><strong className="text-text-main">Tehnički podaci:</strong> IP adresa, tip pretraživača, operativni sistem, vreme pristupa.</li>
          <li><strong className="text-text-main">Kolačići:</strong> više o ovome pročitajte u našoj <a href="/#/cookies" className="text-brand-500 hover:underline">Politici kolačića</a>.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">3. Svrha obrade podataka</h2>
        <p>Vaše podatke koristimo u sledeće svrhe:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Omogućavanje korišćenja Platforme i njenih funkcionalnosti</li>
          <li>Verifikacija identiteta firmi i korisnika</li>
          <li>Komunikacija između prevoznika i špeditera</li>
          <li>Slanje obaveštenja o relevantnim oglasima (matching alarmi)</li>
          <li>Obrada pretplata i naplata</li>
          <li>Poboljšanje kvaliteta usluge i analitika</li>
          <li>Sprečavanje prevare i zloupotrebe Platforme</li>
          <li>Ispunjavanje zakonskih obaveza</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">4. Pravni osnov obrade</h2>
        <p>
          Vaše podatke obrađujemo na osnovu: vašeg pristanka, izvršenja ugovora sa vama (prihvaćeni uslovi
          korišćenja), naše legitimne poslovne interese (sigurnost platforme, sprečavanje prevare) i zakonskih
          obaveza.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">5. Sa kim delimo vaše podatke</h2>
        <p>Vaše podatke ne prodajemo trećim licima. Delimo ih isključivo u sledećim slučajevima:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-text-main">Drugi korisnici Platforme:</strong> kontakt podaci firme i osobe su vidljivi verifikovanim korisnicima kako bi se omogućila komunikacija.</li>
          <li><strong className="text-text-main">Provajderi usluga:</strong> hosting (Supabase), procesori plaćanja, analitika. Svi oni rade pod strogim ugovorima o poverljivosti.</li>
          <li><strong className="text-text-main">Nadležni organi:</strong> ako je to zakonom propisano ili po sudskom nalogu.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">6. Čuvanje podataka</h2>
        <p>
          Vaše podatke čuvamo dok postoji aktivan korisnički nalog i do godinu dana nakon brisanja naloga (radi
          zakonskih i računovodstvenih obaveza). Tehničke logove čuvamo maksimalno 12 meseci.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">7. Vaša prava</h2>
        <p>U skladu sa ZZPL i GDPR-om, imate sledeća prava:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-text-main">Pravo na pristup</strong> — zatražiti kopiju vaših podataka</li>
          <li><strong className="text-text-main">Pravo na ispravku</strong> — korigovati netačne podatke</li>
          <li><strong className="text-text-main">Pravo na brisanje</strong> — zahtevati brisanje naloga i podataka</li>
          <li><strong className="text-text-main">Pravo na ograničenje obrade</strong></li>
          <li><strong className="text-text-main">Pravo na prenosivost podataka</strong></li>
          <li><strong className="text-text-main">Pravo na prigovor</strong> protiv obrade u određene svrhe</li>
          <li><strong className="text-text-main">Pravo žalbe</strong> Povereniku za zaštitu podataka</li>
        </ul>
        <p className="mt-3">
          Za ostvarivanje bilo kog od ovih prava, pošaljite nam email na{' '}
          <a href="mailto:privacy@teretlink.rs" className="text-brand-500 hover:underline">privacy@teretlink.rs</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">8. Sigurnost podataka</h2>
        <p>
          Koristimo tehničke i organizacione mere za zaštitu vaših podataka: SSL/TLS enkripciju za sve komunikacije,
          enkriptovane lozinke (nikad ih ne čuvamo u čistom tekstu), Row Level Security na nivou baze podataka,
          redovna sigurnosna ažuriranja i ograničen pristup zaposlenih.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">9. Maloletna lica</h2>
        <p>
          Platforma je namenjena poslovnim subjektima i osobama starijim od 18 godina. Svesno ne prikupljamo
          podatke o maloletnim licima.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">10. Promene Politike privatnosti</h2>
        <p>
          Zadržavamo pravo da s vremena na vreme ažuriramo ovu Politiku. O značajnim izmenama obavestićemo vas
          putem email-a ili obaveštenja na Platformi. Datum poslednjeg ažuriranja je naveden na vrhu stranice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">11. Kontakt</h2>
        <p>
          Za sva pitanja u vezi sa ovom Politikom privatnosti, slobodno nas kontaktirajte:
        </p>
        <ul className="list-none pl-0 mt-2 space-y-1">
          <li><strong className="text-text-main">Email:</strong> <a href="mailto:privacy@teretlink.rs" className="text-brand-500 hover:underline">privacy@teretlink.rs</a></li>
          <li><strong className="text-text-main">Adresa:</strong> Beograd, Srbija</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};
