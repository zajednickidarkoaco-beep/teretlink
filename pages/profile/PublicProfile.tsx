import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/UIComponents';
import {
  User as UserIcon,
  Building2,
  MapPin,
  Globe,
  ArrowLeft,
  MessageSquare,
  Star,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';
import { StarRating } from '../../components/StarRating';
import { ReviewsList } from '../../components/ReviewsList';
import { ReviewForm } from '../../components/ReviewForm';
import { PosterBadges } from '../../components/PosterBadges';
import type { PublicProfile as PublicProfileType, Review } from '../../types';

const formatCreated = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

export const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, isApproved } = useAuth();

  const [profile, setProfile] = useState<PublicProfileType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isSelf = authUser?.id === id;

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [p, revs, mine] = await Promise.all([
        SupabaseService.getPublicProfile(id),
        SupabaseService.getReviewsForUser(id),
        authUser && !isSelf ? SupabaseService.getMyReviewFor(id) : Promise.resolve(null),
      ]);
      if (!p) {
        setNotFound(true);
        return;
      }
      setProfile(p);
      setReviews(revs);
      setMyReview(mine);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authUser?.id]);

  const handleReviewSuccess = () => {
    setShowForm(false);
    loadAll();
  };

  const handleDeleteMyReview = async () => {
    if (!myReview) return;
    if (!confirm('Obrisati vašu recenziju?')) return;
    try {
      await SupabaseService.deleteReview(myReview.id);
      setMyReview(null);
      await loadAll();
    } catch {
      alert('Greška pri brisanju recenzije.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="h-14 w-14 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">Profil nije pronađen</h2>
        <p className="text-sm text-text-muted mb-6">
          Korisnik ne postoji ili njegov nalog još nije odobren.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Nazad
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-fade-in">
      {/* Nazad */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-main transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Nazad
      </button>

      {/* Header kartica */}
      <Card className="p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="h-24 w-24 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center text-brand-400 font-bold text-4xl flex-shrink-0 overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-text-main">{profile.name}</h1>
                {profile.jobTitle && (
                  <p className="text-sm text-text-muted mt-0.5">{profile.jobTitle}</p>
                )}
              </div>
              {isSelf && (
                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Uredi profil
                </Button>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <PosterBadges
                posterPlan={profile.plan}
                size="md"
                showExtended
                avgRating={profile.avgRating}
                reviewCount={profile.reviewCount}
                avgResponseTimeMinutes={profile.avgResponseTimeMinutes}
                memberSinceIso={profile.createdAt}
              />
            </div>

            {profile.reviewCount > 0 && (
              <div className="mt-3">
                <StarRating
                  value={profile.avgRating}
                  readOnly
                  size={18}
                  count={profile.reviewCount}
                  showValue
                />
              </div>
            )}

            <p className="text-xs text-text-muted mt-3">
              Član od <span className="text-text-main font-medium">{formatCreated(profile.createdAt)}</span>
            </p>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-sm text-text-main/90 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}
      </Card>

      {/* Podaci o firmi */}
      {profile.company && (
        <Card className="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
            <div className="h-9 w-9 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 text-brand-400" />
            </div>
            <div>
              <h3 className="font-bold text-text-main">{profile.company.name}</h3>
              {profile.company.category && (
                <p className="text-xs text-text-muted">{profile.company.category}</p>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {(profile.company.city || profile.company.country) && (
              <div className="flex items-center gap-2 text-text-muted">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {[profile.company.city, profile.company.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {profile.company.website && (
              <div className="flex items-center gap-2 text-text-muted">
                <Globe className="h-3.5 w-3.5" />
                <a
                  href={profile.company.website.startsWith('http') ? profile.company.website : `https://${profile.company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:underline truncate"
                >
                  {profile.company.website}
                </a>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Ostavi recenziju */}
      {!isSelf && authUser && isApproved && (
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
                <Star className="h-4 w-4 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-text-main">
                  {myReview ? 'Vaša recenzija' : 'Ostavite recenziju'}
                </h3>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  {myReview ? 'Već ste ocenili ovu firmu' : 'Podelite iskustvo sa drugima'}
                </p>
              </div>
            </div>
            {myReview && !showForm && (
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Izmeni
                </Button>
                <button
                  type="button"
                  onClick={handleDeleteMyReview}
                  className="h-8 w-8 rounded-lg border border-border hover:border-red-400/40 hover:bg-red-400/10 text-text-muted hover:text-red-400 flex items-center justify-center transition-colors"
                  title="Obriši recenziju"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {showForm || !myReview ? (
            <ReviewForm
              revieweeId={profile.id}
              revieweeName={profile.name}
              existingReviewId={myReview?.id}
              initialRating={myReview?.rating || 0}
              initialComment={myReview?.comment || ''}
              onSuccess={handleReviewSuccess}
              onCancel={myReview ? () => setShowForm(false) : undefined}
            />
          ) : (
            <div className="bg-surface/50 border border-border rounded-lg p-4">
              <StarRating value={myReview.rating} readOnly size={16} />
              {myReview.comment && (
                <p className="mt-2 text-sm text-text-main/90 whitespace-pre-wrap">{myReview.comment}</p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Sve recenzije */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          <div className="h-9 w-9 rounded-lg bg-brand-400/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-brand-400" />
          </div>
          <div>
            <h3 className="font-bold text-text-main">Recenzije</h3>
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {profile.reviewCount > 0
                ? `Prosek: ${profile.avgRating.toFixed(1)}/5 · ${profile.reviewCount} ukupno`
                : 'Još nema recenzija'}
            </p>
          </div>
        </div>
        <ReviewsList reviews={reviews} emptyText="Još nema recenzija za ovu firmu." />
      </Card>
    </div>
  );
};
