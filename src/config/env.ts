
// Environment configuration for the application
// Values are loaded from .env file or directly provided

// Eleven Labs configuration
export const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || '';
export const DEFAULT_VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || 'm5qndnI7u4OAdXhH0Mr5';
export const DEFAULT_AGENT_ID = import.meta.env.VITE_ELEVEN_LABS_AGENT_ID || '8OPvpBZArqGy3fVZKjt1';

// Check if Eleven Labs is configured
export const isElevenLabsConfigured = !!ELEVEN_LABS_API_KEY;
