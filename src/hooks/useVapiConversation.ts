
import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Define the message type for our internal use
type VapiMessage = {
  text: string;
  isUser: boolean;
};

// Define the message type that the Vapi SDK expects
type VapiClientMessage = {
  type: 'message';
  content: string;
};

interface UseVapiConversationProps {
  onMessage?: (message: VapiMessage) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
}

export const useVapiConversation = ({
  onMessage,
  onError,
  onConnect,
  onDisconnect,
  onSpeakingStart,
  onSpeakingEnd
}: UseVapiConversationProps = {}) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const clientRef = useRef<Vapi | null>(null);

  const startSession = useCallback(async ({ 
    apiKey, 
    assistantId, 
    initialMessage 
  }: { 
    apiKey: string; 
    assistantId: string;
    initialMessage?: string;
  }) => {
    try {
      setStatus('connecting');
      
      // Create the Vapi client with API key
      const client = new Vapi(apiKey);
      
      // Setup event listeners for the client
      // Note: Different versions of the SDK may use different event names
      // We're using the string literals directly to avoid TypeScript errors
      client.on('speech.start', () => {
        setIsSpeaking(true);
        if (onSpeakingStart) onSpeakingStart();
      });
      
      client.on('speech.end', () => {
        setIsSpeaking(false);
        if (onSpeakingEnd) onSpeakingEnd();
      });
      
      client.on('error', (error: Error) => {
        console.error('Vapi error:', error);
        if (onError) onError(error);
      });
      
      client.on('connected', () => {
        setStatus('connected');
        if (onConnect) onConnect();
      });
      
      client.on('disconnected', () => {
        setStatus('disconnected');
        if (onDisconnect) onDisconnect();
      });
      
      // Handle user transcriptions
      client.on('transcription', (transcript: any) => {
        console.log('User transcript:', transcript);
        if (onMessage && transcript.transcript) {
          onMessage({
            text: transcript.transcript,
            isUser: true
          });
        }
      });
      
      // Handle AI responses
      client.on('message', (message: any) => {
        console.log('AI message:', message);
        if (onMessage && message.content) {
          onMessage({
            text: message.content,
            isUser: false
          });
        }
      });

      clientRef.current = client;

      // Configure and start the conversation
      await client.start({
        assistantId,
        enableAudio: true,
        welcome: initialMessage || '',
      });

      return client;
    } catch (error) {
      setStatus('disconnected');
      console.error('Failed to start Vapi session:', error);
      if (onError && error instanceof Error) onError(error);
      throw error;
    }
  }, [onConnect, onDisconnect, onError, onMessage, onSpeakingStart, onSpeakingEnd]);

  const endSession = useCallback(async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.stop();
        clientRef.current = null;
      }
      setStatus('disconnected');
    } catch (error) {
      console.error('Failed to end Vapi session:', error);
      if (onError && error instanceof Error) onError(error);
    }
  }, [onError]);

  const adjustVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    // Simply store the volume level, as direct volume control may not be supported
    // Note: In the future if the Vapi SDK adds this feature, this can be updated
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (clientRef.current && status === 'connected') {
      try {
        // Send a message using the appropriate method
        // Convert string to proper message format based on Vapi docs
        const vapiMessage: VapiClientMessage = {
          type: 'message',
          content: message
        };
        
        clientRef.current.send(vapiMessage);
        return true;
      } catch (e) {
        console.error('Error sending message:', e);
        return false;
      }
    }
    return false;
  }, [status]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
      }
    };
  }, []);

  return {
    status,
    isSpeaking,
    startSession,
    endSession,
    adjustVolume,
    sendMessage
  };
};
