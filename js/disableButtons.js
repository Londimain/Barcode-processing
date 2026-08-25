// Функция активации блокировки кнопок
function disableButtons(duration = buttonCooldown) {
  isButtonDisabled = true;
  setTimeout(() => {
    isButtonDisabled = false;
  }, duration);
}