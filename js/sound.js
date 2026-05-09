/* Воспроизведение звукового оповещения с выбором звука */
function playNotificationSound(soundType = 'party') {
    let audioId;

    // Определяем, какой звук воспроизводить
    switch (soundType) {
        case 'save':
            audioId = 'saveSound';
            break;
        case 'split':
            audioId = 'splitSound';
            break;
        case 'split_save':
            audioId = 'processSaveSound';
            break;
        case 'process':
            audioId = 'processSound';
            break;
        case 'download':
            audioId = 'downloadSound';
            break;
        case 'clear_left':
            audioId = 'clearLeftSound';
            break;
        case 'clear_all':
            audioId = 'clearAllSound';
            break;
        case 'party':
            audioId = 'party';
        //default: // 'party' — звук для партий (существующий)
            //audioId = 'notificationSound';
    }

    const audio = document.getElementById(audioId);

    if (!audio) {
        console.error(`Аудиоэлемент с ID "${audioId}" не найден!`);
        return;
    }

    // Проверяем, включён ли звук через чекбокс
    const soundCheckbox = document.getElementById('soundNotification');
    const isSoundEnabled = soundCheckbox && soundCheckbox.checked;

    if (!isSoundEnabled) return; // Если звук отключён, выходим

    // Перематываем на начало
    audio.currentTime = 0;

    // Пытаемся воспроизвести
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`Звук "${soundType}" успешно воспроизведён`);
            })
            .catch(error => {
                console.error('Ошибка воспроизведения звука:', error);
                // Альтернативное уведомление, если звук заблокирован
                if (soundType === 'party') {
                    alert('Новая партия добавлена! (звук заблокирован браузером)');
                }
            });
    }
}