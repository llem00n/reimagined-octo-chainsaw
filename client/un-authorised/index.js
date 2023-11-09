const submit = document.getElementById('submit');
const password = document.getElementById('password');

submit.addEventListener('click', () => {
  fetch(window.origin + '/api/login', {
    method: 'GET',
    headers: {
      'Authorization': toBinary(password.value),
    },
  })
  .then(response => {
    if (response.status === 200) {
      localStorage.setItem('password', password.value);
      const reader = response.body.getReader();
      reader.read().then(({ value }) => {
        const { next } = JSON.parse(new TextDecoder('utf-8').decode(value));
        window.location.href = window.origin + next;
      });
    } else {
      password.classList.add('error');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

password.addEventListener('input', () => {
  password.classList.remove('error')
});