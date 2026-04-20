import { supabase } from '../lib/supabase'
import { Load, Truck, User as AppUser, CreateLoadData, CreateTruckData, Notification, Review, CreateReviewData, PublicProfile } from '../types'

export class SupabaseService {
  // Loads
  static async getLoads(): Promise<Load[]> {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((load: any) => ({
      id: load.id,
      userId: load.user_id,
      type: 'load' as const,
      companyName: load.company_name,
      originCountry: load.origin_country,
      originCity: load.origin_city,
      originPostalCode: load.origin_postal_code,
      destinationCountry: load.destination_country,
      destinationCity: load.destination_city,
      destinationPostalCode: load.destination_postal_code,
      dateFrom: load.date_from,
      dateTo: load.date_to,
      loadingTime: load.loading_time,
      unloadingTime: load.unloading_time,
      truckType: load.truck_type,
      isFtl: load.is_ftl,
      capacity: load.capacity,
      weightTonnes: load.weight_tonnes,
      loadingMeters: load.loading_meters,
      volumeM3: load.volume_m3,
      loadType: load.load_type,
      palletCount: load.pallet_count,
      isStackable: load.is_stackable,
      loadingMethods: load.loading_methods,
      adrClasses: load.adr_classes,
      temperatureMin: load.temperature_min,
      temperatureMax: load.temperature_max,
      price: load.price,
      currency: load.currency,
      contactPhone: load.contact_phone,
      referenceNumber: load.reference_number,
      description: load.description,
      views: load.views,
      inquiries: load.inquiries,
      isFeatured: load.is_featured,
      posterPlan: load.poster_plan,
      createdAt: load.created_at,
    }))
  }

  static async getUserLoads(userId: string): Promise<Load[]> {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(load => ({
      id: load.id,
      userId: load.user_id,
      type: 'load' as const,
      companyName: load.company_name,
      originCountry: load.origin_country,
      originCity: load.origin_city,
      originPostalCode: load.origin_postal_code,
      destinationCountry: load.destination_country,
      destinationCity: load.destination_city,
      destinationPostalCode: load.destination_postal_code,
      dateFrom: load.date_from,
      dateTo: load.date_to,
      loadingTime: load.loading_time,
      unloadingTime: load.unloading_time,
      truckType: load.truck_type,
      isFtl: load.is_ftl,
      capacity: load.capacity,
      weightTonnes: load.weight_tonnes,
      loadingMeters: load.loading_meters,
      volumeM3: load.volume_m3,
      loadType: load.load_type,
      palletCount: load.pallet_count,
      isStackable: load.is_stackable,
      loadingMethods: load.loading_methods,
      adrClasses: load.adr_classes,
      temperatureMin: load.temperature_min,
      temperatureMax: load.temperature_max,
      price: load.price,
      currency: load.currency,
      contactPhone: load.contact_phone,
      referenceNumber: load.reference_number,
      description: load.description,
      views: load.views,
      inquiries: load.inquiries,
      isFeatured: load.is_featured,
      createdAt: load.created_at,
    }))
  }

  static async createLoad(userId: string, companyName: string, data: CreateLoadData): Promise<Load> {
    const { data: result, error } = await supabase
      .from('loads')
      .insert({
        user_id: userId,
        company_name: companyName,
        origin_country: data.originCountry,
        origin_city: data.originCity,
        origin_postal_code: data.originPostalCode,
        destination_country: data.destinationCountry,
        destination_city: data.destinationCity,
        destination_postal_code: data.destinationPostalCode,
        date_from: data.dateFrom,
        date_to: data.dateTo,
        loading_time: data.loadingTime,
        unloading_time: data.unloadingTime,
        truck_type: data.truckType,
        is_ftl: data.isFtl,
        capacity: data.capacity,
        weight_tonnes: data.weightTonnes,
        loading_meters: data.loadingMeters,
        volume_m3: data.volumeM3,
        load_type: data.loadType,
        pallet_count: data.palletCount,
        is_stackable: data.isStackable,
        loading_methods: data.loadingMethods,
        adr_classes: data.adrClasses,
        temperature_min: data.temperatureMin,
        temperature_max: data.temperatureMax,
        price: data.price,
        currency: data.currency,
        contact_phone: data.contactPhone,
        reference_number: data.referenceNumber,
        description: data.description,
      })
      .select()
      .single()

    if (error) throw error

    const load: Load = {
      id: result.id,
      userId: result.user_id,
      type: 'load',
      companyName: result.company_name,
      originCountry: result.origin_country,
      originCity: result.origin_city,
      originPostalCode: result.origin_postal_code,
      destinationCountry: result.destination_country,
      destinationCity: result.destination_city,
      destinationPostalCode: result.destination_postal_code,
      dateFrom: result.date_from,
      dateTo: result.date_to,
      loadingTime: result.loading_time,
      unloadingTime: result.unloading_time,
      truckType: result.truck_type,
      isFtl: result.is_ftl,
      capacity: result.capacity,
      weightTonnes: result.weight_tonnes,
      loadingMeters: result.loading_meters,
      volumeM3: result.volume_m3,
      loadType: result.load_type,
      palletCount: result.pallet_count,
      isStackable: result.is_stackable,
      loadingMethods: result.loading_methods,
      adrClasses: result.adr_classes,
      temperatureMin: result.temperature_min,
      temperatureMax: result.temperature_max,
      price: result.price,
      currency: result.currency,
      contactPhone: result.contact_phone,
      referenceNumber: result.reference_number,
      description: result.description,
      views: result.views,
      inquiries: result.inquiries,
      isFeatured: result.is_featured,
      createdAt: result.created_at,
    }

    // Pošalji email alarm korisnicima čiji kamioni odgovaraju ovoj turi (fire-and-forget)
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ type: 'load', listing: result }),
    }).catch(() => {})

    return load
  }

  // Brojači pregleda (fire-and-forget, ne blokira UI)
  static incrementLoadViews(loadId: string): void {
    supabase.rpc('increment_load_views', { load_id: loadId }).then(
      () => {},
      () => {}
    )
  }

  static incrementTruckViews(truckId: string): void {
    supabase.rpc('increment_truck_views', { truck_id: truckId }).then(
      () => {},
      () => {}
    )
  }

  // Brojači kontakata (inquiries) — kad neko klikne na telefon/WhatsApp
  static incrementLoadInquiries(loadId: string): void {
    supabase.rpc('increment_inquiries', { table_name: 'loads', row_id: loadId }).then(
      () => {},
      () => {}
    )
  }

  static incrementTruckInquiries(truckId: string): void {
    supabase.rpc('increment_inquiries', { table_name: 'trucks', row_id: truckId }).then(
      () => {},
      () => {}
    )
  }

  // Featured / Premium oglasi (admin-only)
  static async setLoadFeatured(loadId: string, isFeatured: boolean): Promise<void> {
    const { error } = await supabase
      .from('loads')
      .update({ is_featured: isFeatured })
      .eq('id', loadId)
    if (error) throw error
  }

  static async setTruckFeatured(truckId: string, isFeatured: boolean): Promise<void> {
    const { error } = await supabase
      .from('trucks')
      .update({ is_featured: isFeatured })
      .eq('id', truckId)
    if (error) throw error
  }

  // Plan limits
  static async getMonthlyPostCount(userId: string, type: 'load' | 'truck'): Promise<number> {
    const { data, error } = await supabase.rpc('get_monthly_post_count', {
      p_user_id: userId,
      p_type: type,
    })
    if (error) {
      console.error('getMonthlyPostCount error:', error)
      return 0
    }
    return data ?? 0
  }

  // Featured credits za Pro plan
  static async getFeaturedCreditsRemaining(userId: string): Promise<number> {
    // Auto-reset ako je prošao mesec
    const { data, error } = await supabase.rpc('reset_featured_credits_if_needed', {
      p_user_id: userId,
    })
    if (error) {
      console.error('getFeaturedCreditsRemaining error:', error)
      return 0
    }
    return data ?? 0
  }

  static async useFeaturedCredit(userId: string, listingType: 'load' | 'truck', listingId: string): Promise<boolean> {
    // Atomski: ako ima credit, smanji ga i postavi listing kao featured
    const remaining = await this.getFeaturedCreditsRemaining(userId)
    if (remaining <= 0) return false

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ featured_credits_remaining: remaining - 1 })
      .eq('id', userId)
    if (updateError) {
      console.error('useFeaturedCredit profile update error:', updateError)
      return false
    }

    if (listingType === 'load') {
      await this.setLoadFeatured(listingId, true)
    } else {
      await this.setTruckFeatured(listingId, true)
    }

    return true
  }

  // Trucks
  static async getTrucks(): Promise<Truck[]> {
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((truck: any) => ({
      id: truck.id,
      userId: truck.user_id,
      type: 'truck' as const,
      companyName: truck.company_name,
      originCountry: truck.origin_country,
      originCity: truck.origin_city,
      originPostalCode: truck.origin_postal_code,
      destinationCountry: truck.destination_country,
      destinationCity: truck.destination_city,
      destinationPostalCode: truck.destination_postal_code,
      dateFrom: truck.date_from,
      dateTo: truck.date_to,
      truckType: truck.truck_type,
      capacity: truck.capacity,
      weightCapacity: truck.weight_capacity,
      loadingMeters: truck.loading_meters,
      truckCount: truck.truck_count,
      adrCapable: truck.adr_capable,
      adrClasses: truck.adr_classes,
      loadingMethods: truck.loading_methods,
      temperatureMin: truck.temperature_min,
      temperatureMax: truck.temperature_max,
      contactPhone: truck.contact_phone,
      description: truck.description,
      views: truck.views,
      inquiries: truck.inquiries,
      isFeatured: truck.is_featured,
      posterPlan: truck.poster_plan,
      createdAt: truck.created_at,
    }))
  }

  static async getUserTrucks(userId: string): Promise<Truck[]> {
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(truck => ({
      id: truck.id,
      userId: truck.user_id,
      type: 'truck' as const,
      companyName: truck.company_name,
      originCountry: truck.origin_country,
      originCity: truck.origin_city,
      originPostalCode: truck.origin_postal_code,
      destinationCountry: truck.destination_country,
      destinationCity: truck.destination_city,
      destinationPostalCode: truck.destination_postal_code,
      dateFrom: truck.date_from,
      dateTo: truck.date_to,
      truckType: truck.truck_type,
      capacity: truck.capacity,
      weightCapacity: truck.weight_capacity,
      loadingMeters: truck.loading_meters,
      truckCount: truck.truck_count,
      adrCapable: truck.adr_capable,
      adrClasses: truck.adr_classes,
      loadingMethods: truck.loading_methods,
      temperatureMin: truck.temperature_min,
      temperatureMax: truck.temperature_max,
      contactPhone: truck.contact_phone,
      description: truck.description,
      views: truck.views,
      inquiries: truck.inquiries,
      isFeatured: truck.is_featured,
      createdAt: truck.created_at,
    }))
  }

  static async createTruck(userId: string, companyName: string, data: CreateTruckData): Promise<Truck> {
    const { data: result, error } = await supabase
      .from('trucks')
      .insert({
        user_id: userId,
        company_name: companyName,
        origin_country: data.originCountry,
        origin_city: data.originCity,
        origin_postal_code: data.originPostalCode,
        destination_country: data.destinationCountry,
        destination_city: data.destinationCity,
        destination_postal_code: data.destinationPostalCode,
        date_from: data.dateFrom,
        date_to: data.dateTo,
        truck_type: data.truckType,
        capacity: data.capacity,
        weight_capacity: (data as any).weightCapacity,
        loading_meters: data.loadingMeters,
        truck_count: (data as any).truckCount,
        adr_capable: (data as any).adrCapable,
        adr_classes: data.adrClasses,
        loading_methods: data.loadingMethods,
        temperature_min: data.temperatureMin,
        temperature_max: data.temperatureMax,
        contact_phone: data.contactPhone,
        description: data.description,
      })
      .select()
      .single()

    if (error) throw error

    const truck: Truck = {
      id: result.id,
      userId: result.user_id,
      type: 'truck',
      companyName: result.company_name,
      originCountry: result.origin_country,
      originCity: result.origin_city,
      originPostalCode: result.origin_postal_code,
      destinationCountry: result.destination_country,
      destinationCity: result.destination_city,
      destinationPostalCode: result.destination_postal_code,
      dateFrom: result.date_from,
      dateTo: result.date_to,
      truckType: result.truck_type,
      capacity: result.capacity,
      weightCapacity: result.weight_capacity,
      loadingMeters: result.loading_meters,
      truckCount: result.truck_count,
      adrCapable: result.adr_capable,
      adrClasses: result.adr_classes,
      loadingMethods: result.loading_methods,
      temperatureMin: result.temperature_min,
      temperatureMax: result.temperature_max,
      contactPhone: result.contact_phone,
      description: result.description,
      views: result.views,
      inquiries: result.inquiries,
      isFeatured: result.is_featured,
      createdAt: result.created_at,
    }

    // Pošalji email alarm korisnicima čije ture odgovaraju ovom kamionu (fire-and-forget)
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ type: 'truck', listing: result }),
    }).catch(() => {})

    return truck
  }

  // Users (for admin)
  static async getPendingUsers(): Promise<AppUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch company data separately for each user
    const usersWithCompanies = await Promise.all(
      data.map(async (user) => {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          plan: user.plan,
          rejectionReason: user.rejection_reason,
          jobTitle: user.job_title,
          directPhone: user.direct_phone,
          mobilePhone: user.mobile_phone,
          phoneCountryCode: user.phone_country_code,
          company: companyData ? {
            name: companyData.name,
            registrationNumber: companyData.registration_number,
            category: companyData.category,
            country: companyData.country,
            city: companyData.city,
            address: companyData.address,
            phone: companyData.phone,
            phoneCountryCode: companyData.phone_country_code,
            email: companyData.email,
            fax: companyData.fax,
            faxCountryCode: companyData.fax_country_code,
            website: companyData.website,
          } : undefined
        }
      })
    )

    return usersWithCompanies
  }

  static async getAllUsers(): Promise<AppUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch company data separately for each user
    const usersWithCompanies = await Promise.all(
      data.map(async (user) => {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          plan: user.plan,
          rejectionReason: user.rejection_reason,
          jobTitle: user.job_title,
          directPhone: user.direct_phone,
          mobilePhone: user.mobile_phone,
          phoneCountryCode: user.phone_country_code,
          company: companyData ? {
            name: companyData.name,
            registrationNumber: companyData.registration_number,
            category: companyData.category,
            country: companyData.country,
            city: companyData.city,
            address: companyData.address,
            phone: companyData.phone,
            phoneCountryCode: companyData.phone_country_code,
            email: companyData.email,
            fax: companyData.fax,
            faxCountryCode: companyData.fax_country_code,
            website: companyData.website,
          } : undefined
        }
      })
    )

    return usersWithCompanies
  }

  static async deleteLoad(loadId: string): Promise<void> {
    const { error } = await supabase.from('loads').delete().eq('id', loadId)
    if (error) throw error
  }

  static async deleteTruck(truckId: string): Promise<void> {
    const { error } = await supabase.from('trucks').delete().eq('id', truckId)
    if (error) throw error
  }

  static async updateUserStatus(userId: string, status: 'approved' | 'rejected', approvedBy: string, rejectionReason?: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        status,
        approved_by: status === 'approved' ? approvedBy : null,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        rejection_reason: status === 'rejected' ? rejectionReason : null,
      })
      .eq('id', userId)

    if (error) throw error

    // Get user email for notifications
    const { data: userData } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', userId)
      .single()

    if (!userData) return

    // Pošalji email notifikaciju preko Edge Function
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          status,
          rejectionReason,
        }),
      })

      console.log(`Email notifikacija poslata na ${userData.email}`)
    } catch (emailError) {
      console.error('Greška pri slanju email notifikacije:', emailError)
      // Ne bacamo grešku — status je i dalje ažuriran
    }
  }

  static async updateUserPlan(userId: string, plan: 'free' | 'standard' | 'pro'): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('id', userId)

    if (error) throw error
  }

  // =============================================
  // Notifications (matching alarmi za Standard/Pro)
  // =============================================

  static async getNotifications(limit = 20): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return (data || []).map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      relatedLoadId: n.related_load_id,
      relatedTruckId: n.related_truck_id,
      relatedUserId: n.related_user_id,
      isRead: n.is_read,
      createdAt: n.created_at,
    }))
  }

  static async getUnreadNotificationCount(): Promise<number> {
    const { data, error } = await supabase.rpc('get_unread_notification_count')
    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
    return (data as number) || 0
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
    if (error) console.error('Error marking notification read:', error)
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    const { error } = await supabase.rpc('mark_all_notifications_read')
    if (error) console.error('Error marking all read:', error)
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
    if (error) console.error('Error deleting notification:', error)
  }

  /**
   * Email hook — za sada samo log.
   * TODO: Kad se doda SMTP/Resend, ovde pozvati Edge Function koja šalje email.
   */
  static async sendMatchNotificationEmail(_userId: string, _notification: Notification): Promise<void> {
    // Placeholder — biće implementirano nakon setup-a SMTP-a
    return
  }

  // =============================================
  // Avatar upload (Supabase Storage)
  // =============================================

  /**
   * Upload avatar slike u bucket 'avatars'. Fajl se čuva kao `{userId}/avatar.{ext}`.
   * Vraća public URL avatar-a.
   */
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    // Validacija veličine (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Slika je prevelika. Maksimalno 2 MB.')
    }

    // Validacija tipa
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Dozvoljeni su samo JPG, PNG, WebP ili GIF formati.')
    }

    // Izvuci ekstenziju
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/avatar.${ext}`

    // Upload sa upsert=true (zameni staru sliku)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    // Dobij public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}` // cache-buster

    // Sačuvaj URL u profiles tabeli
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) throw updateError

    return publicUrl
  }

  /** Ukloni avatar — obriše fajl iz storage-a i očisti avatar_url u profilima. */
  static async removeAvatar(userId: string): Promise<void> {
    // Probaj da obrišeš sve varijante (jpg/png/webp/gif)
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const paths = extensions.map((ext) => `${userId}/avatar.${ext}`)
    await supabase.storage.from('avatars').remove(paths)

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId)
    if (error) throw error
  }

  /** Ažuriraj bio (opis firme) — max 500 karaktera. */
  static async updateBio(userId: string, bio: string): Promise<void> {
    const trimmed = bio.trim().slice(0, 500)
    const { error } = await supabase
      .from('profiles')
      .update({ bio: trimmed || null })
      .eq('id', userId)
    if (error) throw error
  }

  // =============================================
  // Reviews (recenzije korisnika)
  // =============================================

  /** Sve recenzije za zadatog korisnika (reviewee) — sa osnovnim podacima reviewer-a. */
  static async getReviewsForUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(id, name, avatar_url)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    // Paralelno povuci company name za svakog reviewer-a
    const reviewerIds = Array.from(new Set((data || []).map((r: any) => r.reviewer_id)))
    const companyMap = new Map<string, string>()
    if (reviewerIds.length > 0) {
      const { data: companies } = await supabase
        .from('companies')
        .select('user_id, name')
        .in('user_id', reviewerIds)
      ;(companies || []).forEach((c: any) => companyMap.set(c.user_id, c.name))
    }

    return (data || []).map((r: any) => ({
      id: r.id,
      reviewerId: r.reviewer_id,
      revieweeId: r.reviewee_id,
      listingId: r.listing_id,
      listingType: r.listing_type,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      reviewerName: r.reviewer?.name,
      reviewerAvatarUrl: r.reviewer?.avatar_url,
      reviewerCompanyName: companyMap.get(r.reviewer_id) || null,
    }))
  }

  /** Proveri da li je trenutni korisnik već ostavio recenziju konkretnom korisniku. */
  static async getMyReviewFor(revieweeId: string, listingId?: string | null, listingType?: 'load' | 'truck' | null): Promise<Review | null> {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return null

    let query = supabase
      .from('reviews')
      .select('*')
      .eq('reviewer_id', auth.user.id)
      .eq('reviewee_id', revieweeId)

    if (listingId) query = query.eq('listing_id', listingId)
    else query = query.is('listing_id', null)

    if (listingType) query = query.eq('listing_type', listingType)
    else query = query.is('listing_type', null)

    const { data, error } = await query.maybeSingle()
    if (error) {
      console.error('Error fetching my review:', error)
      return null
    }
    if (!data) return null

    return {
      id: data.id,
      reviewerId: data.reviewer_id,
      revieweeId: data.reviewee_id,
      listingId: data.listing_id,
      listingType: data.listing_type,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  static async createReview(data: CreateReviewData): Promise<Review> {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) throw new Error('Morate biti prijavljeni.')

    if (data.revieweeId === auth.user.id) {
      throw new Error('Ne možete oceniti sami sebe.')
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Ocena mora biti između 1 i 5.')
    }

    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: auth.user.id,
        reviewee_id: data.revieweeId,
        listing_id: data.listingId || null,
        listing_type: data.listingType || null,
        rating: data.rating,
        comment: data.comment?.trim().slice(0, 300) || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: inserted.id,
      reviewerId: inserted.reviewer_id,
      revieweeId: inserted.reviewee_id,
      listingId: inserted.listing_id,
      listingType: inserted.listing_type,
      rating: inserted.rating,
      comment: inserted.comment,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
    }
  }

  static async updateReview(reviewId: string, rating: number, comment?: string): Promise<void> {
    if (rating < 1 || rating > 5) throw new Error('Ocena mora biti između 1 i 5.')
    const { error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment: comment?.trim().slice(0, 300) || null,
      })
      .eq('id', reviewId)
    if (error) throw error
  }

  static async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    if (error) throw error
  }

  // =============================================
  // Public profile (šta drugi korisnici vide)
  // =============================================

  static async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, job_title, avatar_url, bio, plan, avg_rating, review_count, avg_response_time_minutes, created_at')
      .eq('id', userId)
      .eq('status', 'approved')
      .maybeSingle()

    if (error) {
      console.error('Error fetching public profile:', error)
      return null
    }
    if (!data) return null

    // Dohvati podatke o firmi
    const { data: companyData } = await supabase
      .from('companies')
      .select('name, category, country, city, website')
      .eq('user_id', userId)
      .maybeSingle()

    return {
      id: data.id,
      name: data.name,
      jobTitle: data.job_title,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      plan: data.plan,
      avgRating: Number(data.avg_rating) || 0,
      reviewCount: data.review_count || 0,
      avgResponseTimeMinutes: data.avg_response_time_minutes,
      createdAt: data.created_at,
      company: companyData
        ? {
            name: companyData.name,
            category: companyData.category,
            country: companyData.country,
            city: companyData.city,
            website: companyData.website,
          }
        : null,
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      console.log('Deleting user completely (auth + profile):', userId);
      
      // Use the PostgreSQL function to completely delete the user
      const { data, error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
      });
      
      if (error) {
        console.error('Error calling admin_delete_user:', error);
        throw error;
      }
      
      console.log('User deleted completely:', data);
      
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  // Increment view count
  static async incrementViews(type: 'loads' | 'trucks', id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', {
      table_name: type,
      row_id: id
    })

    if (error) {
      // Fallback if RPC doesn't exist
      const { data, error: fetchError } = await supabase
        .from(type)
        .select('views')
        .eq('id', id)
        .single()

      if (fetchError) return

      const { error: updateError } = await supabase
        .from(type)
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      if (updateError) console.error('Error incrementing views:', updateError)
    }
  }

  // Add test data for development
  static async addTestData(): Promise<void> {
    // Add test loads
    const testLoads = [
      {
        user_id: '00000000-0000-0000-0000-000000000001', // Will be replaced with real admin ID
        company_name: 'TeretLink Transport',
        origin_country: 'Srbija',
        origin_city: 'Beograd',
        destination_country: 'Nemačka',
        destination_city: 'Berlin',
        date_from: '2025-01-15',
        date_to: '2025-01-17',
        truck_type: 'Mega trailer',
        capacity: '24 paleta',
        price: 1200,
        currency: 'EUR',
        description: 'Potreban mega trailer za transport robe iz Beograda do Berlina. Roba je pakovana na 24 palete.',
        views: 15,
        inquiries: 3
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Balkan Logistics',
        origin_country: 'Srbija',
        origin_city: 'Novi Sad',
        destination_country: 'Austrija',
        destination_city: 'Beč',
        date_from: '2025-01-20',
        date_to: '2025-01-22',
        truck_type: 'Hladnjača',
        capacity: '20 tona',
        price: 800,
        currency: 'EUR',
        description: 'Transport zamrznutih proizvoda. Potrebna hladnjača sa temperaturom -18°C.',
        views: 8,
        inquiries: 1
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Express Cargo',
        origin_country: 'Srbija',
        origin_city: 'Niš',
        destination_country: 'Italija',
        destination_city: 'Milano',
        date_from: '2025-01-25',
        date_to: '2025-01-27',
        truck_type: 'Cerada',
        capacity: '22 palete',
        price: 950,
        currency: 'EUR',
        description: 'Hitna pošiljka tekstila. Potreban pouzdan prevoznik.',
        views: 22,
        inquiries: 5
      }
    ];

    // Add test trucks
    const testTrucks = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Miloš Transport',
        origin_country: 'Srbija',
        origin_city: 'Kragujevac',
        destination_country: 'Francuska',
        destination_city: 'Pariz',
        date_from: '2025-01-18',
        date_to: '2025-01-20',
        truck_type: 'Mega trailer',
        capacity: '24 palete',
        description: 'Slobodan mega trailer vraća se iz Pariza. Mogu da primim teret za povratak.',
        views: 12,
        inquiries: 2
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Danube Shipping',
        origin_country: 'Srbija',
        origin_city: 'Pančevo',
        destination_country: 'Holandija',
        destination_city: 'Amsterdam',
        date_from: '2025-01-22',
        date_to: '2025-01-24',
        truck_type: 'Hladnjača',
        capacity: '18 tona',
        description: 'Hladnjača slobodna za transport. Temperatura od -25°C do +25°C.',
        views: 18,
        inquiries: 4
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Sava Logistics',
        origin_country: 'Srbija',
        origin_city: 'Subotica',
        destination_country: 'Mađarska',
        destination_city: 'Budimpešta',
        date_from: '2025-01-16',
        date_to: '2025-01-17',
        truck_type: 'Cerada',
        capacity: '20 paleta',
        description: 'Kratka relacija, brza dostava. Iskusni vozač.',
        views: 9,
        inquiries: 1
      }
    ];

    try {
      // Get the first admin user ID to use for test data
      const { data: adminUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .eq('status', 'approved')
        .limit(1)
        .single();

      if (!adminUser) {
        console.log('No admin user found, skipping test data creation');
        return;
      }

      // Update test data with real admin ID
      const loadsWithRealId = testLoads.map(load => ({
        ...load,
        user_id: adminUser.id
      }));

      const trucksWithRealId = testTrucks.map(truck => ({
        ...truck,
        user_id: adminUser.id
      }));

      // Insert test loads
      const { error: loadsError } = await supabase
        .from('loads')
        .insert(loadsWithRealId);

      if (loadsError) {
        console.error('Error inserting test loads:', loadsError);
      } else {
        console.log('Test loads inserted successfully');
      }

      // Insert test trucks
      const { error: trucksError } = await supabase
        .from('trucks')
        .insert(trucksWithRealId);

      if (trucksError) {
        console.error('Error inserting test trucks:', trucksError);
      } else {
        console.log('Test trucks inserted successfully');
      }

    } catch (error) {
      console.error('Error adding test data:', error);
    }
  }
}