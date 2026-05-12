document.getElementById('loginTab').addEventListener('click', () => {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
});
document.getElementById('registerTab').addEventListener('click', () => {
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const message = document.getElementById('loginMessage');
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      window.location.href = '/dashboard';
    } 
    else {
      message.textContent = data.message;
      message.className = 'form-message error';
    }
  } 
  catch (err) {
    message.textContent = 'Something went wrong. Try again.';
    message.className = 'form-message error';
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const message = document.getElementById('registerMessage');
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      message.textContent = 'Account created! Please login.';
      message.className = 'form-message success';
      document.getElementById('loginTab').click();
    } 
    else {
      message.textContent = data.message;
      message.className = 'form-message error';
    }
  } 
  catch (err) {
    message.textContent = 'Something went wrong. Try again.';
    message.className = 'form-message error';
  }
});

if (localStorage.getItem('token')) {
  window.location.href = '/dashboard';
}