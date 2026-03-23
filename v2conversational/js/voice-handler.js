// Voice Handler - Web Speech API integration
// Phase 3 Implementation - Speech recognition for hands-free input

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

let recognition = null;
let isListening = false;
let transcriptionCallback = null;
let interimTranscript = '';
let finalTranscript = '';

// Initialize speech recognition
function initialize() {
  if (!isSupported) {
    console.warn('Speech recognition not supported in this browser');
    return false;
  }

  recognition = new SpeechRecognition();

  // Configuration
  recognition.continuous = true; // Keep listening until stopped
  recognition.interimResults = true; // Get partial results as user speaks
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  // Event handlers
  recognition.onstart = handleStart;
  recognition.onend = handleEnd;
  recognition.onerror = handleError;
  recognition.onresult = handleResult;

  return true;
}

// Start listening
function startListening() {
  if (!isSupported) {
    if (transcriptionCallback) {
      transcriptionCallback({
        type: 'error',
        error: 'Speech recognition not supported in this browser'
      });
    }
    return false;
  }

  if (!recognition) {
    initialize();
  }

  if (isListening) {
    console.log('Already listening');
    return false;
  }

  try {
    interimTranscript = '';
    finalTranscript = '';
    recognition.start();
    return true;
  } catch (error) {
    console.error('Error starting recognition:', error);
    if (transcriptionCallback) {
      transcriptionCallback({
        type: 'error',
        error: error.message || 'Failed to start voice recognition'
      });
    }
    return false;
  }
}

// Stop listening
function stopListening() {
  if (!recognition || !isListening) {
    return false;
  }

  try {
    recognition.stop();
    return true;
  } catch (error) {
    console.error('Error stopping recognition:', error);
    return false;
  }
}

// Toggle listening state
function toggleListening() {
  if (isListening) {
    return stopListening();
  } else {
    return startListening();
  }
}

// Handle recognition start
function handleStart() {
  console.log('Voice recognition started');
  isListening = true;

  if (transcriptionCallback) {
    transcriptionCallback({
      type: 'start'
    });
  }
}

// Handle recognition end
function handleEnd() {
  console.log('Voice recognition ended');
  isListening = false;

  if (transcriptionCallback) {
    transcriptionCallback({
      type: 'end',
      transcript: finalTranscript
    });
  }

  // Auto-restart if it stops unexpectedly (browser timeout)
  // This happens after ~15 seconds of silence in Chrome
  // Disabled for now - let user manually restart
  // setTimeout(() => {
  //   if (isListening) {
  //     recognition.start();
  //   }
  // }, 100);
}

// Handle recognition errors
function handleError(event) {
  console.error('Voice recognition error:', event.error);
  isListening = false;

  let errorMessage = 'Voice recognition error';

  switch (event.error) {
    case 'no-speech':
      errorMessage = 'No speech detected. Please try again.';
      break;
    case 'audio-capture':
      errorMessage = 'No microphone detected. Please check your device.';
      break;
    case 'not-allowed':
      errorMessage = 'Microphone access denied. Please allow microphone access.';
      break;
    case 'network':
      errorMessage = 'Network error. Speech recognition requires internet connection.';
      break;
    case 'aborted':
      errorMessage = 'Speech recognition aborted.';
      break;
    case 'service-not-allowed':
      errorMessage = 'Speech recognition service not allowed.';
      break;
  }

  if (transcriptionCallback) {
    transcriptionCallback({
      type: 'error',
      error: errorMessage,
      code: event.error
    });
  }
}

// Handle recognition results
function handleResult(event) {
  interimTranscript = '';

  // Process all results
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      // Final result - user finished speaking a phrase
      finalTranscript += transcript + ' ';

      if (transcriptionCallback) {
        transcriptionCallback({
          type: 'final',
          transcript: transcript.trim(),
          confidence: event.results[i][0].confidence,
          fullTranscript: finalTranscript.trim()
        });
      }
    } else {
      // Interim result - user still speaking
      interimTranscript += transcript;

      if (transcriptionCallback) {
        transcriptionCallback({
          type: 'interim',
          transcript: interimTranscript
        });
      }
    }
  }
}

// Set callback for transcription events
function onTranscription(callback) {
  transcriptionCallback = callback;
}

// Get current state
function getState() {
  return {
    isSupported,
    isListening,
    finalTranscript,
    interimTranscript
  };
}

// Reset transcripts
function reset() {
  interimTranscript = '';
  finalTranscript = '';
}

// Export voice handler interface
export const VoiceHandler = {
  isSupported,
  startListening,
  stopListening,
  toggleListening,
  onTranscription,
  getState,
  reset
};

// Initialize on load
if (isSupported) {
  initialize();
}

window.VoiceHandler = VoiceHandler;
