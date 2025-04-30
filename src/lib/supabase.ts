
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

// Re-export the supabase client and configuration flag
export { supabase, isSupabaseConfigured };

// Create a storage bucket for avatars if it doesn't exist
async function createAvatarsBucketIfNotExists() {
  if (!isSupabaseConfigured) return;

  try {
    // Try to get the avatars bucket
    const { data: buckets } = await supabase
      .storage
      .listBuckets();

    // Check if the avatars bucket exists
    const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');

    // If it doesn't exist, create it
    if (!avatarsBucketExists) {
      const { error } = await supabase
        .storage
        .createBucket('avatars', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
        });

      if (error) {
        console.error('Error creating avatars bucket:', error);
      } else {
        console.log('Created avatars bucket successfully');
      }
    }
  } catch (error) {
    console.error('Error checking/creating avatars bucket:', error);
  }
}

// Initialize the avatars bucket
createAvatarsBucketIfNotExists();
