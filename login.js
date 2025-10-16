
    const form = document.getElementById('loginForm');
    const identifier = document.getElementById('identifier');
    const password = document.getElementById('password');
    const msg = document.getElementById('formMessage');
    const toggle = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const registerBtn = document.getElementById('registerBtn');

    toggle.addEventListener('click', () => {
      const shown = password.type === 'text';
      password.type = shown ? 'password' : 'text';
      toggle.textContent = shown ? 'Показать' : 'Скрыть';
      toggle.setAttribute('aria-pressed', String(!shown));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Вход...';

      const idVal = identifier.value.trim();
      const pwVal = password.value;

      if (!idVal || !pwVal) {
        msg.textContent = 'Заполните все обязательные поля.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
        return;
      }
      if (idVal.includes('@')) {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(idVal)) {
          msg.textContent = 'Введите корректный email или имя пользователя.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Войти';
          return;
        }
      }

      try {
        const payload = { identifier: idVal, password: pwVal, remember: !!document.getElementById('remember').checked };
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const data = await res.json().catch(()=>({message:'Ошибка сервера'}));
          msg.textContent = data?.message || 'Неверный логин или пароль.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Войти';
          return;
        }

        const data = await res.json().catch(() => ({}));
        window.location.href = data?.redirect || '/dashboard';
      } catch (err) {
        msg.textContent = 'Сетевая ошибка. Попробуйте позже.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
      }
    });
    registerBtn.addEventListener('click', () => window.location.href = '/register');
    document.getElementById('googleBtn').addEventListener('click', () => {
      window.location.href = '/auth/google';
    });
    document.getElementById('githubBtn').addEventListener('click', () => {
      window.location.href = '/auth/github';
    });
submitBtn.addEventListener('click', () => {
  const idVal = identifier.value.trim();
  const pwVal = password.value;
  if (!idVal || !pwVal) return;
  setTimeout(() => { window.location.href = 'index.html'; }, 300);
});
registerBtn.addEventListener('click', () => window.location.href = 'reg_page.html');