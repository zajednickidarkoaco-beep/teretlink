import React, { useState, useEffect, useRef } from 'react';
import { searchCities, City } from '../utils/cities';
import { searchCitiesWithGoogle } from '../services/googlePlacesService';

interface CityAutocompleteProps {
  name: string;
  label: string;
  value: string;
  country: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCitySelect?: (city: City) => void;
  placeholder?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  name,
  label,
  value,
  country,
  required = false,
  onChange,
  onCitySelect,
  placeholder = ''
}) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCities = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        setSelectedIndex(-1);
        return;
      }

      // 1) Prvo lokalni rezultati (instant) — odmah ih pokaži
      const localResults = searchCities(value, country);
      if (!cancelled) {
        if (localResults.length > 0) {
          setSuggestions(localResults);
          setShowSuggestions(true);
          setLoading(false); // ne spinuj ako imaš lokalne rezultate
        } else {
          setLoading(true); // samo kad nema lokalnih, probaj Google
        }
        setSelectedIndex(-1);
      }

      // 2) Google Places pokušaj sa hard timeout-om od 3s (da ne visi beskonačno)
      if (localResults.length === 0) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 3000)
          );
          const googleResults = await Promise.race([
            searchCitiesWithGoogle(value, country),
            timeoutPromise,
          ]) as Awaited<ReturnType<typeof searchCitiesWithGoogle>>;

          if (cancelled) return;

          if (googleResults.length > 0) {
            setSuggestions(googleResults);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          if (cancelled) return;
          // Google ne radi → ostani prazan, ali skloni loading
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchCities, 200);
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [value, country]);

  // Close suggestions + loading when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setLoading(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: City) => {
    // Format: "PostalCode, CityName" (e.g., "11000, Beograd")
    const cityValue = `${city.postalCode}, ${city.name}`;
    
    const syntheticEvent = {
      target: {
        name,
        value: cityValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    onCitySelect?.(city);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectCity(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full group">
      {label && (
        <label className="block text-sm font-medium text-text-muted mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-lg shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <button
              key={`${city.name}-${city.postalCode}`}
              type="button"
              onClick={() => handleSelectCity(city)}
              className={`w-full px-4 py-3 text-left hover:bg-brand-500/10 transition-colors flex justify-between items-center ${
                index === selectedIndex ? 'bg-brand-500/10' : ''
              }`}
            >
              <span className="text-text-main font-medium">{city.postalCode}, {city.name}</span>
              <span className="text-text-muted text-xs">{city.country}</span>
            </button>
          ))}
        </div>
      )}
      
      {loading && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-lg shadow-2xl p-3 text-center">
          <span className="text-text-muted text-xs">Pretraga...</span>
        </div>
      )}
      
      {value.length > 0 && value.length < 2 && (
        <p className="mt-1 text-xs text-text-muted">
          Unesite bar dva simbola za pretragu
        </p>
      )}
    </div>
  );
};
