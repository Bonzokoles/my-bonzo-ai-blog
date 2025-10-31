// HeyGen Streaming Avatar Configuration
const HEYGEN_API_KEY = 'YjI5ZmI5NzMwYmRiNDVhNzk4ZTA3ZmNhNzBhNmI2YzEtMTczMDMzNTgwMg=='; // Replace with your actual key
const AVATAR_ID = 'Wayne_20240711'; // Default avatar
const VOICE_ID = '30e127089cf14adfad2d8d2eed5e3efe'; // Polish male voice

// Knowledge Base
const KNOWLEDGE_BASE = `
PORTA - Katalog Drzwi Wewnętrznych

1. PORTA FOCUS PREMIUM model 5.A - od 1033 PLN netto
   - Wypełnienie: plaster miodu lub płyta wiórowa + płyta HDF
   - Powierzchnia: trwała, odporna na ścieranie, matowa
   - Szyba: szkło hartowane matowe 8mm
   - Kolory: białe lakierowane lub farba akrylowa UV

2. PORTA FACTOR model 5 - od 629 PLN netto
   - Design: minimalistyczny, biały
   - Wypełnienie: płyta wiórowa
   - Możliwość niestandardowych wymiarów

3. PORTA DESIRE 5 - cena po kontakcie
   - Płyta wiórowa + aluminiowe listwy
   - Gwarancja: 2 lata

4. PORTA ART DECO model 5 - cena po kontakcie
   - Styl art deco

5. PORTA VERTE HOME model H.5 - cena po kontakcie
   - Konstrukcja ramiakowa z szybami matowymi

KONTAKT:
Telefon: 790 645 410
Dostępność: po 23:00 w środę
`;

const SYSTEM_PROMPT = `Jesteś Bonzo – sprzedawca drzwi PORTA.

OSOBOWOŚĆ:
- Odpowiadasz po polsku, rzeczowo i konkretnie
- Z lekkim sarkazmem i humorem
- Jesteś ekspertem od drzwi PORTA

ZASADY:
- Podawaj dokładne informacje z bazy wiedzy
- Odpowiadaj KRÓTKO (max 2-3 zdania)
- Proponuj konkretne modele
- Jeśli pytają o zakup, podaj kontakt

BAZA WIEDZY:
${KNOWLEDGE_BASE}`;

// Global state
let avatar = null;
let sessionId = null;
let isAvatarReady = false;

// DOM Elements
const avatarVideo = document.getElementById('avatar-video');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const exampleButtons = document.querySelectorAll('.example-btn');

// Initialize avatar on page load
document.addEventListener('DOMContentLoaded', async () => {
  await initializeAvatar();
  setupEventListeners();
});

// Initialize HeyGen Streaming Avatar
async function initializeAvatar() {
  try {
    updateStatus('Łączenie z awatarem...', false);

    // Create new avatar instance
    avatar = new HeyGenStreamingAvatar.StreamingAvatar({
      apiKey: HEYGEN_API_KEY,
      videoElement: avatarVideo
    });

    // Create new session
    const session = await avatar.createStartAvatar({
      avatarName: AVATAR_ID,
      voice: {
        voiceId: VOICE_ID,
        rate: 1.0,
        emotion: 'Friendly'
      },
      language: 'pl',
      quality: 'high'
    });

    sessionId = session.session_id;
    isAvatarReady = true;

    updateStatus('✅ Bonzo gotowy do rozmowy!', true);
    console.log('Avatar ready:', sessionId);

    // Start avatar greeting
    await speak('Cześć! Jestem Bonzo. Zapytaj mnie o drzwi PORTA!');

  } catch (error) {
    console.error('Avatar initialization error:', error);
    updateStatus('❌ Błąd połączenia z awatarem', false);

    // Show error message
    addMessage('bot', 'Przepraszam, wystąpił problem z połączeniem. Odśwież stronę i spróbuj ponownie.');
  }
}

// Send message and get AI response
async function sendMessage(userMessage) {
  if (!userMessage.trim() || !isAvatarReady) return;

  // Add user message to chat
  addMessage('user', userMessage);
  chatInput.value = '';
  sendButton.disabled = true;

  try {
    // Get AI response from OpenAI
    const aiResponse = await getAIResponse(userMessage);

    // Add bot message to chat
    addMessage('bot', aiResponse);

    // Make avatar speak the response
    await speak(aiResponse);

  } catch (error) {
    console.error('Message error:', error);
    addMessage('bot', 'Przepraszam, wystąpił problem. Spróbuj ponownie.');
  } finally {
    sendButton.disabled = false;
    chatInput.focus();
  }
}

// Get AI response from OpenAI
async function getAIResponse(userMessage) {
  try {
    // Call OpenAI API via Cloudflare Workers
    // For now, use a simple mock response
    // TODO: Implement actual API call

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_KEY' // Replace with actual key
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('AI response error:', error);

    // Fallback: Simple pattern matching
    return getSimpleResponse(userMessage);
  }
}

// Simple fallback responses
function getSimpleResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('model') || lower.includes('jaki')) {
    return 'Mamy 5 modeli: FOCUS PREMIUM (od 1033 PLN), FACTOR (od 629 PLN), DESIRE 5, ART DECO i VERTE HOME. Który Cię interesuje?';
  }

  if (lower.includes('cena') || lower.includes('koszt') || lower.includes('ile')) {
    return 'FOCUS PREMIUM od 1033 PLN, FACTOR od 629 PLN. Pozostałe modele - cena po kontakcie. Zadzwoń: 790 645 410.';
  }

  if (lower.includes('szkło') || lower.includes('szyba')) {
    return 'FOCUS PREMIUM ma szkło hartowane matowe 8mm. VERTE HOME też ma szyby matowe 4mm. Interesują Cię?';
  }

  if (lower.includes('gwarancja')) {
    return 'DESIRE 5 ma 2 lata gwarancji. Pozostałe modele - szczegóły pod tel: 790 645 410.';
  }

  if (lower.includes('zamów') || lower.includes('kupić') || lower.includes('kontakt')) {
    return 'Zadzwoń: 790 645 410 (dostępność: po 23:00 w środę). Chętnie pomogę!';
  }

  return 'Mogę odpowiedzieć na pytania o modele, ceny, parametry techniczne. Czego potrzebujesz?';
}

// Make avatar speak
async function speak(text) {
  if (!avatar || !isAvatarReady) {
    console.error('Avatar not ready');
    return;
  }

  try {
    updateStatus('🗣️ Bonzo mówi...', true);

    await avatar.speak({
      text: text,
      taskType: 'talk',
      taskMode: 'async'
    });

    // Wait for avatar to finish speaking
    await new Promise(resolve => setTimeout(resolve, text.length * 50));

    updateStatus('✅ Bonzo gotowy do rozmowy!', true);

  } catch (error) {
    console.error('Speak error:', error);
    updateStatus('✅ Bonzo gotowy do rozmowy!', true);
  }
}

// Add message to chat
function addMessage(type, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;

  const senderDiv = document.createElement('div');
  senderDiv.className = 'message-sender';
  senderDiv.textContent = type === 'bot' ? 'Bonzo' : 'Ty';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = text;

  messageDiv.appendChild(senderDiv);
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update avatar status
function updateStatus(text, ready) {
  statusText.textContent = text;
  if (ready) {
    statusDot.classList.add('ready');
  } else {
    statusDot.classList.remove('ready');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Send button click
  sendButton.addEventListener('click', () => {
    sendMessage(chatInput.value);
  });

  // Enter key press
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(chatInput.value);
    }
  });

  // Example buttons
  exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      chatInput.value = question;
      sendMessage(question);
    });
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
  if (avatar && sessionId) {
    try {
      await avatar.stopAvatar();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});
