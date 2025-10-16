/**
 * Hooks Index
 * 
 * Exporta todos os hooks customizados da aplicação.
 * Facilita importações centralizadas.
 * 
 * @module hooks
 */

// Auth hooks
export { useAuth } from '@/contexts/AuthContext';
export { useSupabase, useUser } from '@/hooks/use-supabase';

// Content hooks
export {
  useContent,
  useContentBySection,
  useContentByKey,
  useSections,
  useUpsertContent,
  useUpsertManyContent,
  useDeleteContent,
  contentKeys,
} from '@/hooks/use-content';

// Gallery hooks
export {
  useGallery,
  useGalleryItem,
  useGalleryCount,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  useToggleGalleryItem,
  useReorderGallery,
  galleryKeys,
} from '@/hooks/use-gallery';

// Testimonials hooks
export {
  useTestimonials,
  useTestimonial,
  useTestimonialsByRating,
  useAverageRating,
  useRatingStats,
  useTestimonialsCount,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonial,
  useReorderTestimonials,
  testimonialsKeys,
} from '@/hooks/use-testimonials';

// Settings hooks
export {
  useSettings,
  useSetting,
  useSettingsByKeys,
  useSEOSettings,
  useThemeSettings,
  useSettingsObject,
  useUpsertSetting,
  useUpsertManySettings,
  useDeleteSetting,
  settingsKeys,
} from '@/hooks/use-settings';

// UI hooks
export { useToast, toast } from '@/hooks/use-toast';
export { useMobile } from '@/hooks/use-mobile';
