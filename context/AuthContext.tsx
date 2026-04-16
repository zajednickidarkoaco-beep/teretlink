import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User as AppUser, UserRole, UserStatus, SubscriptionPlan, Company } from '../types'

interface AuthContextType {
  user: User | null
  profile: AppUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    name: string
    jobTitle?: string
    directPhone?: string
    mobilePhone?: string
    phoneCountryCode?: string
    company: Company
  }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AppUser>) => Promise<void>
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
  isApproved: boolean
  isAdmin: boolean
  canViewContact: (targetUserId: string) => boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Korak 1: učitaj početnu sesiju direktno (bez abort problema)
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (err) {
        console.error('Greška pri init sesiji:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    // Korak 2: slušaj samo naknadne promene (login, logout) — preskoči INITIAL_SESSION
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'INITIAL_SESSION') return // već obrađeno u init()

        console.log('Auth state change:', event, session?.user?.id)

        setSession(session)
        setUser(session?.user ?? null)

        // Proveri email potvrdu
        if (event === 'SIGNED_IN' && session?.user) {
          const urlParams = new URLSearchParams(window.location.hash.substring(1))
          const hasConfirmationParams = urlParams.has('access_token') ||
                                       urlParams.has('type') ||
                                       window.location.hash.includes('confirmation') ||
                                       window.location.hash.includes('email-confirmed')

          if (hasConfirmationParams && !window.location.hash.includes('/email-confirmed')) {
            console.log('Email potvrda detektovana, preusmeravam...')
            window.location.href = '#/email-confirmed'
            return
          }
        }

        if (session?.user) {
          await fetchProfile(session.user.id).catch(error => {
            console.error('Greška pri učitavanju profila:', error)
          })
        } else {
          setProfile(null)
        }

        if (mounted) setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Učitavam profil za korisnika:', userId)

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Uzmi token direktno iz localStorage da bi zaobišli Supabase abort mehanizam
      const storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`
      let token = supabaseKey // fallback na anon key
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          token = parsed?.access_token || supabaseKey
        }
      } catch (_) {}

      // Direktan REST poziv — ne koristi Supabase JS klijent koji abortuje zahteve
      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`,
          }
        }
      )

      if (!res.ok) {
        console.error('Greška pri učitavanju profila:', res.status, res.statusText)
        setProfile(null)
        return
      }

      const rows = await res.json()
      const profileData = Array.isArray(rows) ? rows[0] : null

      console.log('Profil učitan:', profileData)

      if (!profileData) {
        console.log('Profil nije pronađen za korisnika')
        setProfile(null)
        return
      }

      const basicProfile: AppUser = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role as UserRole,
        status: profileData.status as UserStatus,
        plan: profileData.plan as SubscriptionPlan,
        rejectionReason: profileData.rejection_reason,
        jobTitle: profileData.job_title,
        directPhone: profileData.direct_phone,
        mobilePhone: profileData.mobile_phone,
        phoneCountryCode: profileData.phone_country_code,
      }

      setProfile(basicProfile)

      // Učitaj podatke o firmi odvojeno (ne blokira)
      setTimeout(async () => {
        try {
          const companyRes = await fetch(
            `${supabaseUrl}/rest/v1/companies?user_id=eq.${encodeURIComponent(userId)}&select=*`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${token}`,
              }
            }
          )
          if (companyRes.ok) {
            const companyRows = await companyRes.json()
            const companyData = Array.isArray(companyRows) ? companyRows[0] : null
            if (companyData) {
              setProfile({
                ...basicProfile,
                company: {
                  name: companyData.name,
                  registrationNumber: companyData.registration_number,
                  category: companyData.category as any,
                  country: companyData.country,
                  city: companyData.city,
                  address: companyData.address,
                  phone: companyData.phone,
                  phoneCountryCode: companyData.phone_country_code,
                  email: companyData.email,
                  fax: companyData.fax,
                  faxCountryCode: companyData.fax_country_code,
                  website: companyData.website,
                }
              })
            }
          }
        } catch (_) {
          // Firma nije učitana, profil je i dalje validan
        }
      }, 500)

    } catch (error) {
      console.error('Greška pri učitavanju profila:', error)
      setProfile(null)
    }
  }

  const signUp = async (email: string, password: string, userData: {
    name: string
    jobTitle?: string
    directPhone?: string
    mobilePhone?: string
    phoneCountryCode?: string
    company: Company
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name
        }
      }
    })

    if (error) throw error

    // The profile will be created automatically by the trigger
    // Now create the company using the secure function
    if (data.user) {
      // Wait longer for the profile to be created by the trigger
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Use a more robust approach - try multiple times if needed
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            console.log(`Attempting to create company (attempt ${attempts + 1}/${maxAttempts})`);
            
            const { error: companyError } = await supabase.rpc('register_user_with_company', {
              user_id: data.user.id,
              company_name: userData.company.name,
              registration_number: userData.company.registrationNumber,
              category: userData.company.category,
              country: userData.company.country,
              city: userData.company.city,
              address: userData.company.address,
              phone: userData.company.phone,
              email: userData.company.email,
              user_name: userData.name,
              user_job_title: userData.jobTitle || null,
              user_direct_phone: userData.directPhone || null,
              user_mobile_phone: userData.mobilePhone || null,
              user_phone_country_code: userData.phoneCountryCode || '+381',
              phone_country_code: userData.company.phoneCountryCode || '+381',
              fax: userData.company.fax || null,
              fax_country_code: userData.company.faxCountryCode || '+381',
              website: userData.company.website || null,
            });

            if (!companyError) {
              console.log('Company created successfully');
              break; // Success, exit the loop
            }
            
            console.error(`Company creation attempt ${attempts + 1} failed:`, companyError);
            attempts++;
            
            if (attempts < maxAttempts) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (attemptError) {
            console.error(`Company creation attempt ${attempts + 1} error:`, attemptError);
            attempts++;
            
            if (attempts < maxAttempts) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn('Company creation failed after all attempts, but user account was created');
          // Don't throw error - user account is still created, just without company data
        }
        
      } catch (companyError) {
        // If company creation fails, provide a user-friendly error message
        console.error('Company creation error:', companyError);
        console.warn('User account created but company data failed - this is not critical');
        // Don't throw error - user can still login and add company data later
      }
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting Supabase login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Supabase login response:', { data, error });

    if (error) {
      console.error('Supabase login error:', error);
      // Provide user-friendly error messages in Serbian
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Molimo potvrdite vašu email adresu pre prijavljivanja. Proverite vaš email za link za potvrdu.');
      } else if (error.message.includes('Invalid login credentials')) {
        throw new Error('Neispravni podaci za prijavu. Proverite email i lozinku.');
      } else if (error.message.includes('Too many requests')) {
        throw new Error('Previše pokušaja prijavljivanja. Molimo sačekajte nekoliko minuta.');
      } else {
        throw new Error(error.message);
      }
    }
    
    console.log('Login successful, user:', data.user);
    
    // After successful login, check if user is pending and redirect appropriately
    if (data.user) {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', data.user.id)
          .single();
        
        if (profileData && profileData.status === 'pending') {
          // User is pending, they will be redirected by ProtectedRoute
          console.log('User is pending approval');
        }
      } catch (profileError) {
        console.error('Error checking user status:', profileError);
        // Don't throw error - login was successful
      }
    }
    
    return data
  }

  const signOut = async () => {
    try {
      console.log('Pokušavam logout...');
      
      // Prvo obriši lokalno stanje
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Zatim pozovi Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Ne bacaj grešku - lokalno stanje je već obrisano
      }
      
      console.log('Logout uspešan');
      
      // Preusmeri na početnu stranicu
      window.location.href = '/';
      
    } catch (error) {
      console.error('Greška pri logout-u:', error);
      // Čak i ako ima greška, obriši lokalno stanje i preusmeri
      setUser(null);
      setProfile(null);
      setSession(null);
      window.location.href = '/';
    }
  }

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        role: updates.role,
        status: updates.status,
        plan: updates.plan,
        approved_by: updates.status === 'approved' ? user.id : null,
        approved_at: updates.status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', user.id)

    if (error) throw error

    // Refresh profile
    await fetchProfile(user.id)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  const canViewContact = (targetUserId: string) => {
    if (!profile) return false
    if (profile.role === 'admin') return true
    if (profile.id === targetUserId) return true
    if (profile.status !== 'approved') return false
    if (profile.plan === 'free') return false // FREE korisnici ne vide kontakte
    return true
  }

  const isAuthenticated = !!user
  const isApproved = profile?.status === 'approved'
  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      isAuthenticated,
      isApproved,
      isAdmin,
      canViewContact,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}