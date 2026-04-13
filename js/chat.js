/**
 * AXAM Demo — Chat Module
 * Shows the user's message, then triggers the demo modal instead of calling an LLM.
 */
const ChatModule = (() => {
  let history = [];

  function send() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    input.style.height = 'auto';
    sendMessage(msg);
  }

  function sendMessage(message) {
    // Hide welcome
    const welcome = document.getElementById('chat-welcome');
    if (welcome) welcome.style.display = 'none';

    // Show user message
    appendMessage('user', message);
    history.push({ role: 'user', content: message });

    // Show assistant placeholder with typing animation briefly
    const assistantEl = appendMessage('assistant', '', true);
    const bubbleEl = assistantEl.querySelector('.message-bubble');

    bubbleEl.innerHTML = `<div class="typing-indicator">
      <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
    </div>`;

    // After a short delay, replace with demo message and show modal
    setTimeout(() => {
      bubbleEl.innerHTML = renderMarkdown(
        '**This is a demo preview.** In the full AXAM app, I would search through 7,600+ MIT lecture transcripts ' +
        'to find the most relevant content, then generate a detailed answer using a local AI model running on your machine.\n\n' +
        'The full offline package includes 3 LLM tiers that auto-select based on your hardware \u2014 no internet required.'
      );
      scrollToBottom();
      AXAM.showDemoModal('AI Chat', '\uD83D\uDCAC');
    }, 1200);
  }

  function appendMessage(role, text, isPlaceholder = false) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message message-${role}`;

    const avatarContent = role === 'user'
      ? 'U'
      : '<img src="img/icon.png" alt="AXAM">';
    div.innerHTML = `
      <div class="message-avatar">${avatarContent}</div>
      <div class="message-bubble">${isPlaceholder ? '' : renderMarkdown(text)}</div>
    `;
    container.appendChild(div);
    scrollToBottom();
    return div;
  }

  function renderMarkdown(text) {
    if (!text) return '';
    let html = AXAM.esc(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
  }

  // Auto-resize textarea
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
      });
    }
  });

  return { send, sendMessage };
})();
