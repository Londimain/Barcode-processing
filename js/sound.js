/* Воспроизведение звукового оповещения */
function playNotificationSound() {
    const audio = document.getElementById('notificationSound');

    if (!audio) {
        console.error('Аудиоэлемент с ID "notificationSound" не найден!');
        return;
    }

    // Перематываем на начало
    audio.currentTime = 0;

    // Пытаемся воспроизвести
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Звук успешно воспроизведён');
            })
            .catch(error => {
                console.error('Ошибка воспроизведения звука:', error);
                // Альтернативное уведомление, если звук заблокирован
                alert('Новая партия добавлена! (звук заблокирован браузером)');
            });
    }
}