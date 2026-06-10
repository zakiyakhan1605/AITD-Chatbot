const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const sendIcon = document.getElementById('send-icon');
const loadingDots = document.getElementById('loading-dots');
const vaccinationBtn = document.getElementById('vaccination-btn');
const outbreakBtn = document.getElementById('outbreak-btn');
const micBtn = document.getElementById('mic-btn');

// 1. Your Manually Embedded Questions & Answers
const qaDatabase = {
    "check number of branch": "AITD offers 6 primary engineering branches:<br>1. <b>Computer Science & Engineering</b><br>2.Artificial Inteligence and Machine Learning<br>3. Electronics Engineering<br>4. Information Technology<br>5. Chemical Engineering<br>6. Biotechnology",
    "check fee structure": "The fee structure varies by quota (General/TFW/Management). The average fee is approximately ₹80,000 to ₹1,200,000 per annum. Contact the administration desk for a detailed breakdown.",
    "hi": "Hello! Welcome to the AITD-ASSISTANT. How can I help you today?",
    "hello": "Hi there! Feel free to ask me about AITD branches or fees.",
    "help": "You can ask me questions like 'What branches are there?' or click the quick buttons below.",
    "hostel":"There are hostel for both boys and girls",
    "girls hostel fee":"Girls' Hostel Accommodation Fees <br>Room Rent: ₹22,000 per month<br>Mess Charges: Approximately ₹3,700 per month",
    "girl hostel":"Girls' Hostel Accommodation Fees <br>Room Rent: ₹22,000 per month<br>Mess Charges: Approximately ₹3,700 per month",
    "placement":"Several companies, including TCS, Coforge, and Amazon, visited our campus for recruitment",
    "Placement":"Several companies, including TCS, Coforge, and Amazon, visited our campus for recruitment",
    "boys hostel":"yes there is a hostel for boys but having the mess as the private",
    "number of sheat per branch":"1. Computer Science and Engineering - 120 <br> 2. Aritificial Inteligence and Mechine Learning - 60<br> 3.Information Technology - 60<br> 4.Electronic Engineering - 60  <br> 5. Chemical Engineering - 60<br>6. Biotechnology - 60",
    "girls hostel": "Girls' Hostel Accommodation Fees <br>Room Rent: ₹22,000 per month<br>Mess Charges: Approximately ₹3,700 per month",
    "aitd location":"Located in Awadhpuri, opposite Rama Dental College, Khyora, Kanpur, Uttar Pradesh 208024",
    "location":"Located in Awadhpuri, opposite Rama Dental College, Khyora, Kanpur, Uttar Pradesh 208024",
    "where is aitd":"Located in Awadhpuri, opposite Rama Dental College, Khyora, Kanpur, Uttar Pradesh 208024",
    "no. of sheat":"1. Computer Science and Engineering - 120 <br> 2. Aritificial Inteligence and Mechine Learning - 60<br> 3.Information Technology - 60<br> 4.Electronic Engineering - 60  <br> 5. Chemical Engineering - 60<br>6. Biotechnology - 60",
    "number of sheats":"1. Computer Science and Engineering - 120 <br> 2. Aritificial Inteligence and Mechine Learning - 60<br> 3.Information Technology - 60<br> 4.Electronic Engineering - 60  <br> 5. Chemical Engineering - 60<br>6. Biotechnology - 60",
    "Location": "Located in Awadhpuri, opposite Rama Dental College, Khyora, Kanpur, Uttar Pradesh 208024",
     "about hostel":"There are hostel for both boys and girl",
};


// --- Event Listeners ---
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Quick Action Buttons
vaccinationBtn.addEventListener('click', () => handleQuickReply('Check Number of Branch'));
outbreakBtn.addEventListener('click', () => handleQuickReply('Check Fee Structure'));

// Microphone Placeholder
micBtn.addEventListener('click', () => {
    alert('Voice input functionality can be integrated here. Voice output is active for responses.');
});

function handleQuickReply(text) {
    userInput.value = text;
    sendMessage();
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'p-3', 'max-w-[80%]', 'shadow-sm', 'break-words', sender);
    messageDiv.innerHTML = text; // Allows bold (<b>) and line breaks (<br>)
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scrolls container down
}

function toggleLoading(isLoading) {
    if (isLoading) {
        sendIcon.classList.add('hidden');
        loadingDots.classList.remove('hidden');
        sendBtn.disabled = true;
        userInput.disabled = true;
    } else {
        sendIcon.classList.remove('hidden');
        loadingDots.classList.add('hidden');
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// Browser Text-to-Speech Feature
function speakResponse(text) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";

    if ('speechSynthesis' in window && cleanText) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        speechSynthesis.cancel(); 
        speechSynthesis.speak(utterance);
    }
}

// 2. Purely Manual Local Search Engine
function getLocalAnswer(message) {
    const cleanQuery = message.trim().toLowerCase();

    // Strategy A: Check for an exact dictionary match
    if (qaDatabase[cleanQuery]) {
        return qaDatabase[cleanQuery];
    }

    // Strategy B: Keyword search fallback rules
    if (cleanQuery.includes('branch') || cleanQuery.includes('branches') || cleanQuery.includes('computer science') || cleanQuery.includes('cse')) {
        return qaDatabase["check number of branch"];
    }
    if (cleanQuery.includes('fee') || cleanQuery.includes('fees') || cleanQuery.includes('structure') || cleanQuery.includes('cost')) {
        return qaDatabase["check fee structure"];
    }
    if (cleanQuery.includes('hi') || cleanQuery.includes('hello') || cleanQuery.includes('hey')) {
        return qaDatabase["hi"];
    }

    // Strategy C: Default message if the question isn't in your manual script
    return "I am a simple helper bot and don't have the answer to that specific question yet. Try asking about our <b>branches</b> or <b>fee structure</b>!";
}

// 3. Main Send Message Workflow
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Show what the user typed
    appendMessage(message, 'user');
    userInput.value = '';
    toggleLoading(true);

    // 2. Fetch the manual answer and display it after a tiny natural delay
    setTimeout(() => {
        const botResponse = getLocalAnswer(message);
        
        appendMessage(botResponse, 'bot');
        speakResponse(botResponse);
        toggleLoading(false);
    }, 400); // 400ms delay makes the typing indicator flash briefly for realism
}