// Lol.js
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function addMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = who === 'user' ? 'msg-user' : 'msg-bot';
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  input.value = '';
  try {
    const res = await fetch('/api/lol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Request error');
    }
    const data = await res.json();
    addMsg(data.reply || '(tidak ada balasan)');
  } catch (err) {
    addMsg('❌ Gagal: ' + err.message);
  }
});