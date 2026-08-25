// Чтобы курсор не ставился в поле ввода, но при этом можно было выделять текст
const input = document.getElementById('sumCalculation');
// Отключаем фокус через JS
input.addEventListener('focus', (e) => {
  e.preventDefault();
  input.blur();
});
// Разрешаем выделение
input.style.userSelect = 'text';