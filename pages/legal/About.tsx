import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from './LegalPageLayout';
import { Card, Button } from '../../components/UIComponents';
import { Truck, Globe, Shield, TrendingUp, Users, Zap } from 'lucide-react';

export const About = () => {
  const features = [
    { icon: Truck, title: 'Transport bez granica', desc: 'Povezujemo prevoznike i špeditere širom Balkana i EU.' },
    { icon: Globe, title: 'Pokrivenost', desc: 'Hiljade ruta, od lokalnih do međunarodnih.' },
    { icon: Shield, title: 'Sigurnost', desc: 'Verifikovani korisnici i transparentne ocene.' },
    { icon: TrendingUp, title: 'Rast poslovanja', desc: 'Napredna analitika i matching alarmi.' },
    { icon: Users, title: 'Zajednica', desc: 'Preko hiljadu aktivnih firmi.' },
    { icon: Zap, title: 'Brzina', desc: 'Moderan sistem, bez nepotrebnih koraka.' },
  ];

  return (
    <LegalPageLayout
      title="O nama"
      subtitle="TeretLink je moderna berza transporta koja olakšava pronalaženje tereta i kamiona na Balkanu i u Evropi."
    >
      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">Naša misija</h2>
        <p>
          TeretLink je nastao iz jednostavne ideje — transport ne treba da bude komplikovan. Tržište je godinama
          opterećeno zastarelim platformama i sporim procesima. Mi gradimo nešto drugačije: brzu, sigurnu i
          modernu berzu koja radi 24/7 i pomaže firmama da obave više posla sa manje truda.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">Šta nas izdvaja</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          {features.map((f, i) => (
            <Card key={i} className="p-5 hover:border-brand-500/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main mb-1">{f.title}</h3>
                  <p className="text-sm text-text-muted">{f.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">Kome služi TeretLink</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-text-main">Prevoznicima</strong> — pronađite terete na rutama koje već vozite, smanjite prazne kilometre.</li>
          <li><strong className="text-text-main">Špediterima</strong> — objavite teret i pustite da vas kontaktiraju provereni prevoznici.</li>
          <li><strong className="text-text-main">Trgovinskim firmama</strong> — direktan pristup kapacitetima bez posrednika.</li>
          <li><strong className="text-text-main">Logističkim kompanijama</strong> — upravljajte celom mrežom partnera iz jednog mesta.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-main mb-3">Naš pristup</h2>
        <p>
          Ne verujemo u skrivene provizije ili lažne cene. Sve je transparentno — platite samo pristup platformi
          putem mesečne pretplate, a ko sa kim radi i po kojoj ceni je stvar dogovora između vas i partnera.
          Mi obezbeđujemo alat; vi radite biznis.
        </p>
      </section>

      <section className="bg-surface border border-border rounded-xl p-8 not-prose">
        <h2 className="text-xl font-bold text-text-main mb-2">Spremni ste da počnete?</h2>
        <p className="text-text-muted mb-5">Registracija je besplatna. Plate plaćate samo kada odlučite da proširite mogućnosti.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/register">
            <Button variant="primary">Registruj se besplatno</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline">Pogledaj cenovnik</Button>
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
};
