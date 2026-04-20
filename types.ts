export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum SubscriptionPlan {
  FREE = 'free',
  STANDARD = 'standard',
  PRO = 'pro',
}

export enum CompanyCategory {
  CARRIER = 'Transportna firma / Autoprevoznik',
  FORWARDER = 'Špediterska firma / Špediter',
  LOGISTICS = 'Transportna / Špediterska firma / Logistička firma',
  MANUFACTURER = 'Trgovinska firma / Proizvođač',
  IMPORTER_EXPORTER = 'Trgovinska firma / Uvoznik, izvoznik',
  MOVING = 'Firme za prevoz i selidbe robe',
  OTHER = 'Drugo',
}

export interface PersonalContact {
  jobTitle?: string;
  directPhone?: string;
  mobilePhone?: string;
  phoneCountryCode?: string;
}

export interface Company {
  name: string;
  registrationNumber: string;
  category: CompanyCategory;
  country: string;
  city: string;
  address: string;
  phone: string;
  phoneCountryCode?: string;
  email: string;
  fax?: string;
  faxCountryCode?: string;
  website?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  plan: SubscriptionPlan;
  company?: Company;
  rejectionReason?: string;
  // Personal contact info
  jobTitle?: string;
  directPhone?: string;
  mobilePhone?: string;
  phoneCountryCode?: string;
  // Profile enrichment
  avatarUrl?: string | null;
  bio?: string | null;
  avgRating?: number;
  reviewCount?: number;
  avgResponseTimeMinutes?: number | null;
  createdAt?: string;
}

// Javni profil korisnika — ono što drugi korisnici vide
export interface PublicProfile {
  id: string;
  name: string;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  plan: SubscriptionPlan;
  avgRating: number;
  reviewCount: number;
  avgResponseTimeMinutes?: number | null;
  createdAt: string;
  company?: {
    name: string;
    category?: string;
    country?: string;
    city?: string;
    website?: string | null;
  } | null;
}

export interface Listing {
  id: string;
  userId: string;
  companyName: string;
  createdAt: string;

  // Ruta - Utovar
  originCountry: string;
  originCity: string;
  originPostalCode?: string;

  // Ruta - Istovar
  destinationCountry?: string;
  destinationCity?: string;
  destinationPostalCode?: string;

  // Datumi i vreme
  dateFrom: string;
  dateTo?: string;
  loadingTime?: string;
  unloadingTime?: string;

  // Vozilo
  truckType: string;
  isFtl?: boolean; // full truck load vs groupage/LTL

  // Detalji tereta / kapaciteta
  capacity?: string;         // legacy text polje (backward compat)
  weightTonnes?: number;     // težina u tonama
  loadingMeters?: number;    // LDM - dužina utovara u metrima
  volumeM3?: number;         // volumen u m³
  loadType?: string;         // vrsta tereta
  palletCount?: number;      // broj paleta
  isStackable?: boolean;     // slaganje

  // Načini utovara
  loadingMethods?: string[]; // ['Zadnje', 'Bocno', 'Gornje']

  // Posebni zahtevi
  adrClasses?: string[];     // ADR klase opasne robe
  temperatureMin?: number;   // min temperatura (za hladnjače)
  temperatureMax?: number;   // max temperatura

  // Cena i kontakt
  price?: number;
  currency?: string;
  contactPhone?: string;
  referenceNumber?: string;
  description?: string;

  // Meta
  views: number;
  inquiries: number;
  isFeatured?: boolean; // Premium isticanje oglasa (Pro plan)
  posterPlan?: 'free' | 'standard' | 'pro'; // Plan korisnika koji je objavio — za prikaz Verifikovan/Top Partner badge-a
}

export interface Load extends Listing {
  type: 'load';
}

export interface Truck extends Listing {
  type: 'truck';
  weightCapacity?: number;  // nosivost kamiona u tonama
  truckCount?: number;      // broj kamiona
  adrCapable?: boolean;     // da li može ADR
}

// Helper types za forme
export type CreateLoadData = Omit<Load, 'id' | 'userId' | 'createdAt' | 'companyName' | 'views' | 'inquiries' | 'type'>;
export type CreateTruckData = Omit<Truck, 'id' | 'userId' | 'createdAt' | 'companyName' | 'views' | 'inquiries' | 'type'>;

// =============================================
// Notifikacije (matching alarmi za Standard/Pro)
// =============================================
export type NotificationType = 'match_load' | 'match_truck' | 'system' | 'contact';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedLoadId?: string | null;
  relatedTruckId?: string | null;
  relatedUserId?: string | null;
  isRead: boolean;
  createdAt: string;
}

// =============================================
// Recenzije (ocene korisnika — 1-5 zvezdica)
// =============================================
export type ReviewListingType = 'load' | 'truck';

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  listingId?: string | null;
  listingType?: ReviewListingType | null;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  // Denormalized reviewer info (joined at read time)
  reviewerName?: string;
  reviewerAvatarUrl?: string | null;
  reviewerCompanyName?: string | null;
}

export interface CreateReviewData {
  revieweeId: string;
  listingId?: string | null;
  listingType?: ReviewListingType | null;
  rating: number;
  comment?: string;
}
