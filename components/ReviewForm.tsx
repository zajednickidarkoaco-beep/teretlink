import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from './UIComponents';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { SupabaseService } from '../services/supabaseService';
import type { ReviewListingType } from '../types';

interface ReviewFormProps {
  revieweeId: string;
  revieweeName?: string;
  listingId?: string | null;
  listingType?: ReviewListingType | null;
  /** Postojeća ocena (ako korisnik već ima recenziju) — za update mode. */
  existingReviewId?: string;
  initialRating?: number;
  initialComment?: string;
  /** Poziva se nakon uspešnog submit-a. */
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  revieweeId,
  revieweeName,
  listingId = null,
  listingType = null,
  existingReviewId,
  initialRating = 0,
  initialComment = '',
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isEdit = !!existingReviewId;
  const maxComment = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (rating < 1 || rating > 5) {
      setAlert({ type: 'error', message: 'Odaberite ocenu od 1 do 5 zvezdica.' });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && existingReviewId) {
        await SupabaseService.updateReview(existingReviewId, rating, comment);
      } else {
        await SupabaseService.createReview({
          revieweeId,
          listingId,
          listingType,
          rating,
          comment,
        });
      }
      setAlert({ type: 'success', message: isEdit ? 'Recenzija je ažurirana.' : 'Recenzija je sačuvana.' });
      setTimeout(() => onSuccess?.(), 800);
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err?.message || 'Greška pri čuvanju recenzije. Pokušajte ponovo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {revieweeName && (
        <p className="text-sm text-text-muted">
          Ocenjujete: <span className="text-text-main font-semibold">{revieweeName}</span>
        </p>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Vaša ocena *
        </label>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Komentar (opciono)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, maxComment))}
          placeholder="Kako je prošla saradnja? (npr. profesionalna komunikacija, brza dostava...)"
          rows={4}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-colors resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-text-muted">Budite fer i konkretni.</span>
          <span className={`text-xs ${comment.length >= maxComment - 30 ? 'text-amber-400' : 'text-text-muted'}`}>
            {comment.length}/{maxComment}
          </span>
        </div>
      </div>

      {alert && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
          alert.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {alert.type === 'success'
            ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
            : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
          {alert.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            Otkaži
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={loading || rating < 1}>
          {loading ? (
            <>Čuvanje...</>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {isEdit ? 'Ažuriraj' : 'Pošalji recenziju'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
