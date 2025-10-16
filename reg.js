// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const agree = document.getElementById('agree');
  const msg = document.getElementById('formMessage');
  const registerBtn = document.getElementById('registerBtn');

  const cLen = document.getElementById('cLen');
  const cUpper = document.getElementById('cUpper');
  const cLower = document.getElementById('cLower');
  const cDigit = document.getElementById('cDigit');
  const cSpec = document.getElementById('cSpec');

  function validatePassword(pw){
    const rules = {
      len: pw.length >= 8,
      upper: /[A-ZА-ЯЁ]/.test(pw),
      lower: /[a-zа-яё]/.test(pw),
      digit: /\d/.test(pw),
      spec: /[!@#\$%\^&\*\(\),.\?":{}\|<>\[\]\/\-_+=]/.test(pw)
    };
    if (cLen) cLen.className = rules.len ? 'ok' : 'bad';
    if (cUpper) cUpper.className = rules.upper ? 'ok' : 'bad';
    if (cLower) cLower.className = rules.lower ? 'ok' : 'bad';
    if (cDigit) cDigit.className = rules.digit ? 'ok' : 'bad';
    if (cSpec) cSpec.className = rules.spec ? 'ok' : 'bad';
    return Object.values(rules).every(Boolean);
  }

  if (password) {
    password.addEventListener('input', () => validatePassword(password.value));
  }

  function validEmail(em){ return /\S+@\S+\.\S+/.test(em); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword || !agree || !registerBtn || !msg) return;

    msg.textContent = '';

    // Клиентская валидация
    if (username.value.trim().length < 3){
      msg.textContent = 'Имя пользователя должно быть не менее 3 символов.';
      return;
    }
    if (!validEmail(email.value.trim())){
      msg.textContent = 'Введите корректный email.';
      return;
    }
    if (!validatePassword(password.value)){
      msg.textContent = 'Пароль не соответствует требованиям.';
      return;
    }
    if (password.value !== confirmPassword.value){
      msg.textContent = 'Пароли не совпадают.';
      return;
    }
    if (!agree.checked){
      msg.textContent = 'Нужно принять условия.';
      return;
    }

    // Всё прошло — блокируем кнопку и пробуем зарегистрировать
    registerBtn.disabled = true;
    registerBtn.textContent = 'Регистрация...';

    try {
      const payload = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value
      };

      // Если у вас нет сервера, можно закомментировать fetch — тогда будет обычный переход
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(()=>({message:'Ошибка регистрации'}));
        msg.textContent = data.message || 'Ошибка регистрации';
        registerBtn.disabled = false;
        registerBtn.textContent = 'Зарегистрироваться';
        return;
      }

      // Успех — переходим на окно входа
      window.location.href = 'login_page.html';
    } catch (err) {
      // Если сервер недоступен, считаем, что регистрация локально прошла и переходим
      window.location.href = 'login_page.html';
    }
  });
});
// ...existing code...