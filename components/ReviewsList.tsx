import React from 'react';
import { StarRating } from './StarRating';
import { User as UserIcon, MessageSquare } from 'lucide-react';
import type { Review } from '../types';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
  emptyText?: string;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  loading = false,
  emptyText = 'Još uvek nema recenzija.',
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-surface/50 rounded-lg p-4 h-24 border border-border" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <MessageSquare className="h-10 w-10 text-text-muted/40 mb-2" />
        <p className="text-sm text-text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-surface/50 border border-border rounded-lg p-4 hover:border-border/80 transition-colors"
        >
          <div className="flex items-start gap-3">
            {/* Avatar reviewer-a */}
            <div className="h-10 w-10 rounded-full bg-brand-400/10 border border-brand-400/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {review.reviewerAvatarUrl ? (
                <img
                  src={review.reviewerAvatarUrl}
                  alt={review.reviewerName || 'Reviewer'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="h-4 w-4 text-brand-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <p className="font-semibold text-text-main text-sm truncate">
                    {review.reviewerName || 'Anonimni korisnik'}
                  </p>
                  {review.reviewerCompanyName && (
                    <p className="text-xs text-text-muted truncate">
                      {review.reviewerCompanyName}
                    </p>
                  )}
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <div className="mt-1.5">
                <StarRating value={review.rating} readOnly size={14} />
              </div>

              {review.comment && (
                <p className="mt-2 text-sm text-text-main/90 leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
