// Воспроизведение звукового оповещения
function playNotificationSound(soundType = 'party') {
    let audioId;

    // Определяем, какой звук воспроизводить
    switch (soundType) {
        case 'party':
            audioId = 'party';
            break;
        case 'vestovar':
            audioId = 'vestovarSound';
            break;
        case 'neverni_tovar':
            audioId = 'neverni_tovarSound';
            break;
        case 'simvil_rus':
            audioId = 'simvil_rusSound';
            break;
        case 'miscalculation':
            audioId = 'miscalculationSound';
            break;
        case 'save_excel':
            audioId = 'save_excelSound';
            break;
        case 'save':
            audioId = 'saveSound';
            break;
        case 'split':
            audioId = 'splitSound';
            break;
        case 'process':
            audioId = 'processSound';
            break;
        case 'split_save':
            audioId = 'processSaveSound';
            break;
        case 'download':
            audioId = 'downloadSound';
            break;
        case 'search_brand':
            audioId = 'search_brandSound';
            break;
        case 'clear_left':
            audioId = 'clearLeftSound';
            break;
        case 'clear_all':
            audioId = 'clearAllSound';
            break;
        case 'processing_Code':
            audioId = 'processing_CodeSound';
            break;
        case 'forming':
            audioId = 'formingSound';
            break;
        case 'expiration_Date':
            audioId = 'expiration_DateSound';
            break;
        default:
            console.error(`Неизвестный тип звука: "${soundType}"`);
            return;
    }

    const audio = document.getElementById(audioId);

    if (!audio) {
        console.error(`Аудиоэлемент с ID "${audioId}" не найден!`);
        return;
    }

    // Проверяем, включён ли звук через чекбокс
    const soundCheckbox = document.getElementById('soundNotification');
    const isSoundEnabled = soundCheckbox && soundCheckbox.checked;

    if (!isSoundEnabled) {
        console.log(`Звуковое оповещение отключено пользователем (чекбокс не отмечен) для типа "${soundType}"`);
        return;
    }

    // ВЗАИМНОЕ ИСКЛЮЧЕНИЕ: останавливаем все конфликтующие звуки
    // Только для party, vestovarSound и neverni_tovarSound
    if (['party', 'vestovarSound', 'neverni_tovarSound'].includes(audioId)) {
        stopAllSounds();
        console.log(`Активировано взаимное исключение для "${soundType}" (${audioId})`);
    }

    // Перематываем на начало
    audio.currentTime = 0;

    // Пытаемся воспроизвести
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`Звук "${soundType}" (${audioId}) успешно воспроизведён`);
            })
            .catch(error => {
                console.error('Ошибка воспроизведения звука:', error);
            });
    }
}