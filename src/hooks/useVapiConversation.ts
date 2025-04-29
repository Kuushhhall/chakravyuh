
import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Define the message type for our internal use
type VapiMessage = {
  text: string;
  isUser: boolean;
};

// Define correct Vapi event names based on their updated SDK
type VapiEventName = 'speech.start' | 'speech.end' | 'error' | 'connected' | 'disconnected' | 'transcription' | 'message';

// Define the configuration for starting a conversation
interface StartSessionOptions {
  apiKey: string;
  assistantId: string;
  initialMessage?: string;
}

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
  }: StartSessionOptions) => {
    try {
      setStatus('connecting');
      
      // Create the Vapi client with API key
      const client = new Vapi(apiKey);
      
      // Setup event listeners for the client
      // Using the correct event names based on the updated Vapi SDK
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
      
      // Handle disconnection
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

      // Configure and start the conversation using the correct format
      await client.start({
        assistantID: assistantId, // Use assistantID instead of model
        stream: true,      // Enable streaming for real-time responses
        audio: true,       // Enable audio
        ...(initialMessage ? { firstMessage: initialMessage } : {})
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
      if (onDisconnect) onDisconnect();
    } catch (error) {
      console.error('Failed to end Vapi session:', error);
      if (onError && error instanceof Error) onError(error);
    }
  }, [onError, onDisconnect]);

  const adjustVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    // Note: Direct volume control may not be supported in the Vapi SDK
    // This is just storing the volume level for our app's state
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (clientRef.current && status === 'connected') {
      try {
        // Send a message using the correct format for the updated Vapi SDK
        clientRef.current.send({
          type: 'say',
          data: {
            content: message
          }
        });
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
