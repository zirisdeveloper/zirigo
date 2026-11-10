"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  AlertCircle,
  Building,
  Bed,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import { Property, RoomUnit, PlatformRate } from "@/lib/types";
import { useI18n, translateAmenity, translatePropertyType, translateCancellation } from "@/lib/i18n";
import styles from "../../app/admin/admin.module.css";

interface PropertyFormProps {
  initialData?: Property;
  isEdit?: boolean;
  mode?: "admin" | "user";
}

const PRESET_AMENITIES = [
  { id: "pool", label: "Piscine privée / partagée" },
  { id: "ocean_view", label: "Vue mer panoramique" },
  { id: "wifi", label: "Wifi haut débit" },
  { id: "air_conditioning", label: "Climatisation" },
  { id: "free_parking", label: "Parking gratuit" },
  { id: "kitchen", label: "Cuisine équipée" },
  { id: "terrace", label: "Terrasse / Balcon" },
  { id: "spa", label: "Spa & Bien-être" },
  { id: "hot_tub", label: "Jacuzzi / Bain à remous" },
  { id: "gym", label: "Salle de sport" },
  { id: "bbq", label: "Barbecue" },
  { id: "concierge", label: "Service de conciergerie" },
  { id: "ski_in_out", label: "Accès skis aux pieds" },
  { id: "fireplace", label: "Cheminée au feu de bois" },
];

const PRESET_LOCATIONS = [
  { city: "Cassis", country: "France", lat: 43.214, lng: 5.539 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Chamonix-Mont-Blanc", country: "France", lat: 45.923, lng: 6.869 },
  { city: "Marrakech", country: "Maroc", lat: 31.6295, lng: -7.9811 },
  { city: "Alger", country: "Algérie", lat: 36.7538, lng: 3.0588 },
  { city: "Nice", country: "France", lat: 43.7102, lng: 7.262 },
];

const SAMPLE_UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
];

export function PropertyForm({ initialData, isEdit = false, mode = "admin" }: PropertyFormProps) {
  const router = useRouter();
  const { t, ext, language } = useI18n();
  const ad = ext.admin;
  const isUserMode = mode === "user";
  const backPath = isUserMode ? "/espace-perso/annonces" : "/admin/properties";
  const apiBase = isUserMode ? "/api/espace-perso/properties" : "/api/properties";

  // General fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [type, setType] = useState<Property["type"]>(initialData?.type || "villa");
  const [stars, setStars] = useState(initialData?.stars ?? 4);
  const [rating, setRating] = useState(initialData?.rating ?? 4.85);
  const [reviewCount, setReviewCount] = useState(initialData?.reviewCount ?? 12);
  const [description, setDescription] = useState(initialData?.description || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? true);

  // Location fields
  const [address, setAddress] = useState(initialData?.address || "");
  const [city, setCity] = useState(initialData?.city || "Paris");
  const [country, setCountry] = useState(initialData?.country || "France");
  const [latitude, setLatitude] = useState(initialData?.latitude ?? 48.8566);
  const [longitude, setLongitude] = useState(initialData?.longitude ?? 2.3522);

  // Images
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || SAMPLE_UNSPLASH_IMAGES[0]
  );
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [SAMPLE_UNSPLASH_IMAGES[0], SAMPLE_UNSPLASH_IMAGES[1], SAMPLE_UNSPLASH_IMAGES[2]]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Amenities
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities || ["wifi", "air_conditioning", "pool", "terrace"]
  );
  const [customAmenity, setCustomAmenity] = useState("");

  // Check in/out & Policies
  const [checkInTime, setCheckInTime] = useState(initialData?.checkInTime || "15:00");
  const [checkOutTime, setCheckOutTime] = useState(initialData?.checkOutTime || "11:00");
  const [cancellationPolicy, setCancellationPolicy] = useState<Property["cancellationPolicy"]>(
    initialData?.cancellationPolicy || "flexible"
  );

  // Rooms / Units
  const [rooms, setRooms] = useState<RoomUnit[]>(
    initialData?.rooms && initialData.rooms.length > 0
      ? initialData.rooms
      : [
          {
            id: `room-${Date.now()}-1`,
            title: "Suite Prestige",
            description: "Chambre avec lit King Size et vue dégagée.",
            capacityGuests: 2,
            capacityBedrooms: 1,
            capacityBeds: 1,
            capacityBathrooms: 1,
            basePricePerNight: 220,
            cleaningFee: 40,
            images: [featuredImage],
            amenities: ["Lit King", "Salle de bain privée", "Climatisation"],
          },
        ]
  );

  // Platform Rates (Matrix)
  const [rates, setRates] = useState<PlatformRate[]>(
    initialData?.rates && initialData.rates.length > 0
      ? initialData.rates
      : [
          {
            platformName: "Zirigo Direct",
            pricePerNight: 220,
            perks: ["Meilleur tarif garanti", "Annulation gratuite", "Petit-déjeuner offert"],
            isBestPrice: true,
            bookingUrl: "",
          },
          {
            platformName: "Booking.com",
            pricePerNight: 260,
            perks: ["Tarif standard"],
            isBestPrice: false,
            bookingUrl: "https://booking.com",
          },
          {
            platformName: "Airbnb",
            pricePerNight: 275,
            perks: ["Frais de ménage en sus"],
            isBestPrice: false,
            bookingUrl: "https://airbnb.com",
          },
        ]
  );

  // State management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-slug generator
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEdit) {
      const generatedSlug = newTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  // Toggle amenities
  const toggleAmenity = (id: string) => {
    if (amenities.includes(id)) {
      setAmenities(amenities.filter((a) => a !== id));
    } else {
      setAmenities([...amenities, id]);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  // Gallery images
  const addImage = (url: string) => {
    const trimmed = url.trim();
    if (trimmed && !images.includes(trimmed)) {
      setImages([...images, trimmed]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Room management
  const addRoom = () => {
    const newRoom: RoomUnit = {
      id: `room-${Date.now()}-${rooms.length + 1}`,
      title: `Chambre ${rooms.length + 1}`,
      description: "Confort supérieur et prestations de qualité.",
      capacityGuests: 2,
      capacityBedrooms: 1,
      capacityBeds: 1,
      capacityBathrooms: 1,
      basePricePerNight: 180,
      cleaningFee: 30,
      images: [featuredImage],
      amenities: ["Wifi", "Climatisation"],
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (index: number, updates: Partial<RoomUnit>) => {
    const next = [...rooms];
    next[index] = { ...next[index], ...updates };
    setRooms(next);
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 1) {
      showToast("L'annonce doit comporter au moins une chambre ou unité", "error");
      return;
    }
    setRooms(rooms.filter((_, i) => i !== index));
  };

  // Rates management
  const addRate = () => {
    const newRate: PlatformRate = {
      platformName: "Autre plateforme",
      pricePerNight: 200,
      perks: ["Tarif standard"],
      isBestPrice: false,
      bookingUrl: "",
    };
    setRates([...rates, newRate]);
  };

  const updateRate = (index: number, updates: Partial<PlatformRate>) => {
    const next = [...rates];
    next[index] = { ...next[index], ...updates };
    setRates(next);
  };

  const removeRate = (index: number) => {
    if (rates.length <= 1) {
      showToast("Au moins un tarif doit être défini", "error");
      return;
    }
    setRates(rates.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Le titre de l'annonce est obligatoire", "error");
      return;
    }

    if (!city.trim() || !country.trim()) {
      showToast("La ville et le pays sont obligatoires", "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type,
      stars: Number(stars),
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      description,
      address,
      city,
      country,
      latitude: Number(latitude),
      longitude: Number(longitude),
      featuredImage: featuredImage || images[0] || SAMPLE_UNSPLASH_IMAGES[0],
      images: images.length > 0 ? images : [featuredImage],
      amenities,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      isFeatured,
      rooms,
      rates,
    };

    try {
      const url = isEdit ? `${apiBase}/${initialData?.id}` : apiBase;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(isEdit ? "Annonce mise à jour avec succès !" : "Annonce créée avec succès !");
        setTimeout(() => {
          router.push(backPath);
          router.refresh();
        }, 800);
      } else {
        const errData = await res.json();
        showToast(errData.error || "Une erreur est survenue lors de l'enregistrement", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur de connexion au serveur", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Toast */}
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${
              toastMessage.type === "success" ? styles.toastSuccess : styles.toastError
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--deal-green)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--alert-red)" }} />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top action header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href={backPath} className={styles.actionIconBtn} title={ext.cancel}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {isEdit ? ad.formEditTitle : ad.formCreateTitle}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              {isEdit
                ? `ID: ${initialData?.id} • Slug: ${initialData?.slug}`
                : ad.formCreateSub}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href={backPath} className="btn btn-secondary" style={{ padding: "0.65rem 1.25rem" }}>
            {ext.cancel}
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.5rem" }}
          >
            <Save size={17} />
            <span>{isSubmitting ? ext.saving : isEdit ? ad.formUpdateBtn : ad.formPublishBtn}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: General Info */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Building size={20} style={{ color: "var(--brand-primary)" }} />
            <span>{ad.sec1Title}</span>
          </div>
          <div className={styles.sectionDesc}>{ad.sec1Sub}</div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>{ad.titleField}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Villa Luminescence & Infinity Pool"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.slugField}</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="villa-luminescence-cassis"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t.specType}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className={styles.formSelect}
            >
              <option value="villa">{translatePropertyType("villa", language)}</option>
              <option value="hotel">{translatePropertyType("hotel", language)}</option>
              <option value="apartment">{translatePropertyType("apartment", language)}</option>
              <option value="chalet">{translatePropertyType("chalet", language)}</option>
              <option value="resort">{translatePropertyType("resort", language)}</option>
              <option value="dormitory">{translatePropertyType("dormitory", language)}</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.starsField}</label>
            <input
              type="number"
              min={1}
              max={5}
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className={styles.formInput}
            />
          </div>

          {!isUserMode && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{ad.ratingField}</label>
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{ad.reviewsCountField}</label>
                <input
                  type="number"
                  min={0}
                  value={reviewCount}
                  onChange={(e) => setReviewCount(Number(e.target.value))}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t.featured}</label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginTop: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "var(--brand-primary)" }}
                  />
                  <span>{ad.featuredCheckboxLabel}</span>
                </label>
              </div>
            </>
          )}

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>{ad.descField}</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.formTextarea}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Location */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <MapPin size={20} style={{ color: "var(--brand-primary)" }} />
            <span>{ad.sec2Title}</span>
          </div>
          <div className={styles.sectionDesc}>{ad.sec2Sub}</div>
        </div>

        {/* Quick location presets */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {ad.quickCitiesLabel}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.city}
                type="button"
                onClick={() => {
                  setCity(loc.city);
                  setCountry(loc.country);
                  setLatitude(loc.lat);
                  setLongitude(loc.lng);
                  if (!address) setAddress(`Centre-ville, ${loc.city}`);
                }}
                style={{
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.8rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-muted)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {loc.city} ({loc.country})
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>{ad.addressField}</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Route des Crêtes, 13260 Cassis"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.cityField}</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cassis"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.countryField}</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="France"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Latitude GPS</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              placeholder="43.214"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Longitude GPS</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              placeholder="5.539"
              className={styles.formInput}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Media & Gallery */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <ImageIcon size={20} style={{ color: "var(--brand-primary)" }} />
            <span>{ad.sec3Title}</span>
          </div>
          <div className={styles.sectionDesc}>{ad.sec3Sub}</div>
        </div>

        <div className={styles.formGroupFull} style={{ marginBottom: "1.5rem" }}>
          <label className={styles.formLabel}>{ad.mainImageField}</label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="url"
              required
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={styles.formInput}
              style={{ flex: 1 }}
            />
          </div>
          {featuredImage && (
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={featuredImage}
                alt="Preview"
                style={{
                  width: 140,
                  height: 90,
                  borderRadius: "var(--radius-md)",
                  objectFit: "cover",
                  border: "2px solid var(--brand-primary)",
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>{ad.galleryField}</label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder={ad.addImagePlaceholder}
              className={styles.formInput}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => addImage(newImageUrl)}
              className="btn btn-secondary"
              style={{ padding: "0.6rem 1.25rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Plus size={16} />
              <span>{ad.addBtn}</span>
            </button>
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
              {SAMPLE_UNSPLASH_IMAGES.slice(0, 5).map((sampleUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addImage(sampleUrl)}
                  style={{
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-muted)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  + Photo #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.imagePreviewGrid}>
            {images.map((url, idx) => (
              <div key={idx} className={styles.imagePreviewCard}>
                <img src={url} alt={`Photo ${idx + 1}`} className={styles.imagePreviewImg} />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className={styles.imageRemoveBtn}
                  title={ext.delete}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Amenities */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Sparkles size={20} style={{ color: "var(--brand-primary)" }} />
            <span>{ad.sec4Title}</span>
          </div>
          <div className={styles.sectionDesc}>{ad.sec4Sub}</div>
        </div>

        <div className={styles.amenityGrid} style={{ marginBottom: "1.25rem" }}>
          {PRESET_AMENITIES.map((item) => {
            const isChecked = amenities.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleAmenity(item.id)}
                className={`${styles.amenityCheckboxItem} ${
                  isChecked ? styles.amenityCheckboxActive : ""
                }`}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "4px",
                    border: "2px solid",
                    borderColor: isChecked ? "var(--brand-primary)" : "var(--border-medium)",
                    backgroundColor: isChecked ? "var(--brand-primary)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: "0.85rem" }}>{translateAmenity(item.id, language)}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", maxWidth: "420px" }}>
          <input
            type="text"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder={ad.customAmenityPlaceholder}
            className={styles.formInput}
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            className="btn btn-secondary"
            style={{ padding: "0.55rem 1rem" }}
          >
            {ad.addBtn}
          </button>
        </div>
      </div>

      {/* SECTION 5: Check-in / Check-out */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Sparkles size={20} style={{ color: "var(--brand-primary)" }} />
            <span>{ad.sec5Title}</span>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.checkInField}</label>
            <input
              type="text"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              placeholder="15:00"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.checkOutField}</label>
            <input
              type="text"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              placeholder="11:00"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{ad.cancellationField}</label>
            <select
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value as any)}
              className={styles.formSelect}
            >
              <option value="flexible">{translateCancellation("flexible", language)}</option>
              <option value="moderate">{translateCancellation("moderate", language)}</option>
              <option value="strict">{translateCancellation("strict", language)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 6: Rooms */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className={styles.sectionTitle}>
              <Bed size={20} style={{ color: "var(--brand-primary)" }} />
              <span>{ad.sec6Title} ({rooms.length})</span>
            </div>
            <div className={styles.sectionDesc}>{ad.sec6Sub}</div>
          </div>
          <button
            type="button"
            onClick={addRoom}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} />
            <span>{ad.addRoomBtn}</span>
          </button>
        </div>

        {rooms.map((room, index) => (
          <div key={room.id} className={styles.subItemCard}>
            <div className={styles.subItemHeader}>
              <span className={styles.subItemTitle}>Unité #{index + 1} : {room.title}</span>
              <button
                type="button"
                onClick={() => removeRoom(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--alert-red)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <Trash2 size={15} />
                <span>Supprimer cette chambre</span>
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Titre de la chambre / suite *</label>
                <input
                  type="text"
                  required
                  value={room.title}
                  onChange={(e) => updateRoom(index, { title: e.target.value })}
                  placeholder="Ex: Suite Parentale Vue Mer"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Capacité Voyageurs</label>
                <input
                  type="number"
                  min={1}
                  value={room.capacityGuests}
                  onChange={(e) => updateRoom(index, { capacityGuests: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre de Chambres</label>
                <input
                  type="number"
                  min={1}
                  value={room.capacityBedrooms}
                  onChange={(e) => updateRoom(index, { capacityBedrooms: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre de Lits</label>
                <input
                  type="number"
                  min={1}
                  value={room.capacityBeds}
                  onChange={(e) => updateRoom(index, { capacityBeds: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Salles de bain</label>
                <input
                  type="number"
                  min={1}
                  value={room.capacityBathrooms}
                  onChange={(e) => updateRoom(index, { capacityBathrooms: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Prix de base / nuit (€) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={room.basePricePerNight}
                  onChange={(e) => updateRoom(index, { basePricePerNight: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Frais de ménage (€)</label>
                <input
                  type="number"
                  min={0}
                  value={room.cleaningFee}
                  onChange={(e) => updateRoom(index, { cleaningFee: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Description de la chambre</label>
                <input
                  type="text"
                  value={room.description}
                  onChange={(e) => updateRoom(index, { description: e.target.value })}
                  placeholder="Lit king-size, terrasse privée, douche à l'italienne..."
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 7: Price Comparison Matrix */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className={styles.sectionTitle}>
              <TrendingDown size={20} style={{ color: "var(--brand-primary)" }} />
              <span>{ad.sec7Title}</span>
            </div>
            <div className={styles.sectionDesc}>{ad.sec7Sub}</div>
          </div>
          <button
            type="button"
            onClick={addRate}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} />
            <span>{ad.addPlatformBtn}</span>
          </button>
        </div>

        {rates.map((rate, index) => (
          <div key={index} className={styles.subItemCard}>
            <div className={styles.subItemHeader}>
              <span className={styles.subItemTitle}>{rate.platformName}</span>
              <button
                type="button"
                onClick={() => removeRate(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--alert-red)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <Trash2 size={15} />
                <span>{ext.delete}</span>
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Platform *</label>
                <input
                  type="text"
                  required
                  value={rate.platformName}
                  onChange={(e) => updateRate(index, { platformName: e.target.value })}
                  placeholder="Zirigo Direct, Booking.com, Airbnb..."
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>€/night *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={rate.pricePerNight}
                  onChange={(e) => updateRate(index, { pricePerNight: Number(e.target.value) })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>URL</label>
                <input
                  type="text"
                  value={rate.bookingUrl}
                  onChange={(e) => updateRate(index, { bookingUrl: e.target.value })}
                  placeholder="https://..."
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t.lowestPriceVerified}</label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginTop: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rate.isBestPrice}
                    onChange={(e) => updateRate(index, { isBestPrice: e.target.checked })}
                    style={{ width: 17, height: 17, accentColor: "var(--brand-primary)" }}
                  />
                  <span>{t.lowestPriceVerified}</span>
                </label>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Perks (comma-separated)</label>
                <input
                  type="text"
                  value={rate.perks.join(", ")}
                  onChange={(e) =>
                    updateRate(index, {
                      perks: e.target.value
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom submit toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1rem",
          marginTop: "2rem",
          padding: "1.5rem 0",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <Link href={backPath} className="btn btn-secondary" style={{ padding: "0.75rem 1.75rem" }}>
          {ext.cancel}
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.75rem 2rem",
            fontSize: "0.95rem",
          }}
        >
          <Save size={18} />
          <span>{isSubmitting ? ext.saving : isEdit ? ad.formUpdateBtn : ad.formPublishBtn}</span>
        </button>
      </div>
    </form>
  );
}

