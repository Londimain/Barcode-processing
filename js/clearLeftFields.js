// Функция для очистки левого текстового поля
function clearLeftFields() {
    textarea.value = '';

    // Звуковое оповещение
    playNotificationSound('clear_left');
}