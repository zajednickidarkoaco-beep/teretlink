import React from 'react';
import {
  X,
  MapPin,
  Package,
  Weight,
  Ruler,
  AlertTriangle,
  Thermometer,
  Phone,
  Lock,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Load, Truck } from '../types';
import { Badge, Button } from './UIComponents';
import { getFlagEmoji } from '../utils/countries';

interface ListingDetailPanelProps {
  item: Load | Truck | null;
  onClose: () => void;
  canSeePhone: boolean;
}

function isLoad(item: Load | Truck): item is Load {
  return item.type === 'load';
}

function isTruck(item: Load | Truck): item is Truck {
  return item.type === 'truck';
}

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">{children}</h3>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center gap-4 py-2 border-b border-border/40 last:border-0">
    <span className="text-sm text-text-muted flex-shrink-0">{label}</span>
    <span className="text-sm text-text-main font-medium text-right">{value}</span>
  </div>
);

const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${className || 'bg-surface border-border text-text-muted'}`}>
    {children}
  </span>
);

export const ListingDetailPanel = ({ item, onClose, canSeePhone }: ListingDetailPanelProps) => {
  if (!item) return null;

  const load = isLoad(item) ? item : null;
  const truck = isTruck(item) ? item : null;

  const hasAdr = (item.adrClasses && item.adrClasses.length > 0) || (truck?.adrCapable);
  const hasTemp = item.temperatureMin != null || item.temperatureMax != null;

  const hasLoadSpecs = load && (
    load.weightTonnes != null ||
    load.loadingMeters != null ||
    load.volumeM3 != null ||
    load.palletCount != null ||
    load.loadType ||
    load.isStackable != null
  );
  const hasTruckSpecs = truck && (
    truck.weightCapacity != null ||
    truck.loadingMeters != null
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col z-50"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {load && <Badge variant="info">Tura</Badge>}
            {truck && <Badge variant="success">Slobodan kamion</Badge>}
            <h2 className="font-semibold text-text-main text-base truncate">{item.companyName}</h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-main hover:border-text-muted transition-all flex-shrink-0"
            aria-label="Zatvori"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6">

          {/* --- Ruta --- */}
          <section className="mb-6">
            <SectionHeader>Ruta</SectionHeader>

            {/* Origin */}
            <div className="rounded-xl border border-border bg-surface/50 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                <MapPin className="h-3.5 w-3.5" />
                {load ? 'Utovar' : 'Lokacija'}
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl">{getFlagEmoji(item.originCountry)}</span>
                <span className="font-bold text-text-main text-lg leading-tight">{item.originCity}</span>
                {item.originPostalCode && (
                  <span className="font-mono text-sm text-text-muted">{item.originPostalCode}</span>
                )}
                <span className="text-sm text-text-muted">{item.originCountry}</span>
              </div>
              {(item.dateFrom || item.loadingTime) && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-3 pt-3 border-t border-border/50">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  {formatDate(item.dateFrom)}
                  {item.dateTo && ` — ${formatDate(item.dateTo)}`}
                  {item.loadingTime && <span className="ml-1 font-mono">{item.loadingTime}</span>}
                </div>
              )}
            </div>

            {/* Arrow connector */}
            <div className="flex items-center justify-center py-2">
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </div>

            {/* Destination */}
            <div className="rounded-xl border border-border bg-surface/50 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                <MapPin className="h-3.5 w-3.5" />
                {load ? 'Istovar' : 'Ide za'}
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                {item.destinationCountry && (
                  <span className="text-xl">{getFlagEmoji(item.destinationCountry)}</span>
                )}
                <span className="font-bold text-text-main text-lg leading-tight">
                  {item.destinationCity || 'Bilo gde'}
                </span>
                {item.destinationPostalCode && (
                  <span className="font-mono text-sm text-text-muted">{item.destinationPostalCode}</span>
                )}
                {item.destinationCountry && (
                  <span className="text-sm text-text-muted">{item.destinationCountry}</span>
                )}
              </div>
              {item.unloadingTime && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-3 pt-3 border-t border-border/50">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="font-mono">{item.unloadingTime}</span>
                </div>
              )}
            </div>
          </section>

          {/* --- Vozilo --- */}
          <section className="mb-6 pt-6 border-t border-border">
            <SectionHeader>Vozilo</SectionHeader>
            <div className="flex flex-wrap gap-2">
              <Chip>{item.truckType}</Chip>
              {load && load.isFtl === false && (
                <Chip>LTL / Grupažno</Chip>
              )}
              {load && load.isFtl !== false && (
                <Chip>FTL</Chip>
              )}
              {truck && (truck.truckCount ?? 1) > 1 && (
                <Chip className="bg-brand-400/10 border-brand-400/20 text-brand-400">
                  {truck.truckCount} kamiona
                </Chip>
              )}
            </div>
          </section>

          {/* --- Specifikacije --- */}
          {(hasLoadSpecs || hasTruckSpecs) && (
            <section className="mb-6 pt-6 border-t border-border">
              <SectionHeader>Specifikacije</SectionHeader>
              <div>
                {load?.weightTonnes != null && (
                  <InfoRow
                    label="Težina"
                    value={
                      <span className="flex items-center gap-1 justify-end">
                        <Weight className="h-3.5 w-3.5 text-text-muted" />
                        {load.weightTonnes} t
                      </span>
                    }
                  />
                )}
                {load?.loadingMeters != null && (
                  <InfoRow
                    label="LDM"
                    value={
                      <span className="flex items-center gap-1 justify-end">
                        <Ruler className="h-3.5 w-3.5 text-text-muted" />
                        {load.loadingMeters} m
                      </span>
                    }
                  />
                )}
                {load?.volumeM3 != null && (
                  <InfoRow label="Volumen" value={`${load.volumeM3} m³`} />
                )}
                {load?.palletCount != null && (
                  <InfoRow
                    label="Palete"
                    value={
                      <span className="flex items-center gap-1 justify-end">
                        <Package className="h-3.5 w-3.5 text-text-muted" />
                        {load.palletCount} pal.
                      </span>
                    }
                  />
                )}
                {load?.loadType && (
                  <InfoRow label="Vrsta tereta" value={load.loadType} />
                )}
                {load?.isStackable != null && (
                  <InfoRow label="Slaganje" value={load.isStackable ? 'Da' : 'Ne'} />
                )}
                {truck?.weightCapacity != null && (
                  <InfoRow
                    label="Nosivost"
                    value={
                      <span className="flex items-center gap-1 justify-end">
                        <Weight className="h-3.5 w-3.5 text-text-muted" />
                        {truck.weightCapacity} t
                      </span>
                    }
                  />
                )}
                {truck?.loadingMeters != null && (
                  <InfoRow
                    label="LDM"
                    value={
                      <span className="flex items-center gap-1 justify-end">
                        <Ruler className="h-3.5 w-3.5 text-text-muted" />
                        {truck.loadingMeters} m
                      </span>
                    }
                  />
                )}
              </div>
            </section>
          )}

          {/* --- Načini utovara --- */}
          {item.loadingMethods && item.loadingMethods.length > 0 && (
            <section className="mb-6 pt-6 border-t border-border">
              <SectionHeader>Načini utovara</SectionHeader>
              <div className="flex flex-wrap gap-2">
                {item.loadingMethods.map(method => (
                  <span key={method} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border bg-surface border-border text-text-muted">
                    {method}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* --- Posebni zahtevi --- */}
          {(hasAdr || hasTemp) && (
            <section className="mb-6 pt-6 border-t border-border">
              <SectionHeader>Posebni zahtevi</SectionHeader>
              <div className="space-y-4">
                {hasAdr && item.adrClasses && item.adrClasses.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-2">ADR klase</p>
                    <div className="flex flex-wrap gap-2">
                      {item.adrClasses.map(cls => (
                        <span
                          key={cls}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {truck?.adrCapable && (!truck.adrClasses || truck.adrClasses.length === 0) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    ADR sposoban
                  </span>
                )}
                {hasTemp && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-text-muted">Temperatura:</span>
                    <span className="text-sm text-blue-400 font-medium">
                      {item.temperatureMin != null ? `${item.temperatureMin}°C` : ''}
                      {item.temperatureMin != null && item.temperatureMax != null ? ' / ' : ''}
                      {item.temperatureMax != null ? `${item.temperatureMax}°C` : ''}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* --- Cena --- (only for loads) */}
          {load && (
            <section className="mb-6 pt-6 border-t border-border">
              <SectionHeader>Cena</SectionHeader>
              <div>
                <InfoRow
                  label="Ponuđena cena"
                  value={
                    load.price
                      ? (
                        <span className="flex items-center gap-1 justify-end text-brand-400 font-bold">
                          <DollarSign className="h-3.5 w-3.5" />
                          {load.price.toLocaleString('sr-RS')} {load.currency}
                        </span>
                      )
                      : <span className="text-text-muted italic">Na upit</span>
                  }
                />
                {load.referenceNumber && (
                  <InfoRow
                    label="Referentni broj"
                    value={
                      <span className="flex items-center gap-1 justify-end font-mono text-xs">
                        <FileText className="h-3.5 w-3.5 text-text-muted" />
                        {load.referenceNumber}
                      </span>
                    }
                  />
                )}
              </div>
            </section>
          )}

          {/* --- Opis --- */}
          {item.description && (
            <section className="mb-6 pt-6 border-t border-border">
              <SectionHeader>Opis</SectionHeader>
              <blockquote className="border-l-2 border-brand-400/40 pl-4 py-2 bg-surface/50 rounded-r-lg">
                <p className="text-sm text-text-muted italic leading-relaxed">"{item.description}"</p>
              </blockquote>
            </section>
          )}

          {/* --- Kontakt --- */}
          <section className="mb-6 pt-6 border-t border-border">
            <SectionHeader>Kontakt</SectionHeader>
            {canSeePhone ? (
              item.contactPhone ? (
                <div className="flex flex-col gap-2">
                  {/* Poziv dugme */}
                  <a href={`tel:${item.contactPhone}`} className="block">
                    <Button variant="primary" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      {item.contactPhone}
                    </Button>
                  </a>
                  {/* WhatsApp dugme */}
                  <a
                    href={`https://wa.me/${item.contactPhone.replace(/[\s\-\(\)\+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white transition-all"
                    style={{ backgroundColor: '#25D366' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1ebe5d')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Kontaktiraj na WhatsApp
                  </a>
                </div>
              ) : (
                <div className="text-sm text-text-muted text-center py-3 bg-surface rounded-xl border border-border">
                  Telefon nije naveden
                </div>
              )
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <div className="blur-[4px] bg-surface p-3.5 text-center text-text-muted select-none font-mono text-sm">
                  +381 6* *** ****
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/70 gap-2">
                  <Lock className="h-5 w-5 text-text-muted" />
                  <span className="text-xs font-semibold text-text-muted">
                    Nadogradite plan za pristup kontaktu
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* --- Footer --- */}
          <p className="text-xs text-text-muted text-center pt-4 border-t border-border pb-2">
            Objavljeno: {formatDateTime(item.createdAt)}
          </p>

        </div>
      </div>
    </>
  );
};
