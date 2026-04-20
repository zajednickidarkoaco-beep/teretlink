import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';

export const CookiesPolicy = () => {
  return (
    <LegalPageLayout
      title="Politika kolačića"
      subtitle="Koje kolačiće koristimo i zašto."
      lastUpdated="18.04.2026."
    >
      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">1. Šta su kolačići?</h2>
        <p>
          Kolačići (engl. „cookies") su male tekstualne datoteke koje sajtovi čuvaju u vašem pretraživaču. Omogućavaju
          sajtovima da zapamte vaše preference i akcije tokom sesije, što poboljšava korisničko iskustvo.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">2. Koje kolačiće koristimo</h2>

        <h3 className="text-lg font-semibold text-text-main mt-4 mb-2">🔒 Neophodni kolačići</h3>
        <p>
          Ovi kolačići su ključni za funkcionisanje Platforme i ne mogu se isključiti. Bez njih Platforma
          neće raditi kako treba.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><code className="text-brand-500 bg-surface px-1.5 py-0.5 rounded text-xs">supabase-auth-token</code> — čuva vašu sesiju nakon prijave</li>
          <li><code className="text-brand-500 bg-surface px-1.5 py-0.5 rounded text-xs">lbx_theme</code> — pamti vašu preferenciju teme (tamna/svetla)</li>
        </ul>

        <h3 className="text-lg font-semibold text-text-main mt-5 mb-2">📊 Analitički kolačići</h3>
        <p>
          Pomažu nam da razumemo kako korisnici koriste Platformu — koje stranice su najposećenije, gde se
          korisnici zadržavaju, gde odustaju. Ovi podaci su anonimni i koriste se isključivo za poboljšanje
          Platforme.
        </p>

        <h3 className="text-lg font-semibold text-text-main mt-5 mb-2">🎯 Funkcionalni kolačići</h3>
        <p>
          Čuvaju vaše preference kao što su filter postavke, poslednja odabrana država itd., kako ne biste
          morali svaki put da ih ponovo podešavate.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">3. Kolačići trećih strana</h2>
        <p>
          Koristimo i određene usluge trećih strana koje mogu postaviti svoje kolačiće:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-text-main">Supabase</strong> — autentifikacija i baza podataka</li>
          <li><strong className="text-text-main">Google Maps / Places</strong> — autocomplete gradova (ako je aktivno)</li>
        </ul>
        <p className="mt-3">
          Ove treće strane imaju svoje politike privatnosti koje preporučujemo da pročitate.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">4. Kako upravljati kolačićima</h2>
        <p>
          Možete kontrolisati i/ili brisati kolačiće u bilo kom trenutku kroz podešavanja svog pretraživača.
          Većina pretraživača omogućava vam da:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Vidite koje kolačiće imate i obrišete ih pojedinačno</li>
          <li>Blokirate kolačiće trećih strana</li>
          <li>Blokirate sve kolačiće sa određenih sajtova</li>
          <li>Blokirate sve kolačiće</li>
          <li>Obrišete sve kolačiće kada zatvorite pretraživač</li>
        </ul>
        <p className="mt-3">
          <strong className="text-text-main">Napomena:</strong> Ako blokirate neophodne kolačiće, Platforma možda
          neće raditi ispravno — nećete moći da se prijavite ili da koristite većinu funkcionalnosti.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">5. Promene politike</h2>
        <p>
          Ovu Politiku kolačića možemo s vremena na vreme ažurirati. Datum poslednjeg ažuriranja je naveden na
          vrhu stranice. Preporučujemo da periodično proverite ovu stranicu.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">6. Kontakt</h2>
        <p>
          Za sva pitanja u vezi sa kolačićima, kontaktirajte nas na{' '}
          <a href="mailto:info@teretlink.rs" className="text-brand-500 hover:underline">info@teretlink.rs</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
};
