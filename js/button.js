// Эффект сжимания кнопки при клике
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mousedown', () => button.classList.add('pressed'));
  button.addEventListener('mouseup', () => button.classList.remove('pressed'));
  button.addEventListener('mouseleave', () => button.classList.remove('pressed'));
});
// Эффект сжимания кнопки при клике на кнопку очистить все поля
document.addEventListener('DOMContentLoaded', function() {
  const clearButtons = document.querySelectorAll('.clear-button');

  clearButtons.forEach(button => {
    button.addEventListener('mousedown', () => {
      button.classList.add('pressed');
    });

    button.addEventListener('mouseup', () => {
      button.classList.remove('pressed');
    });

    // Дополнительно: убираем класс, если курсор ушёл с кнопки во время нажатия
    button.addEventListener('mouseleave', () => {
      button.classList.remove('pressed');
    });
  });
});