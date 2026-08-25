// Обрабатывает воспроизведение звука для русских символов с учётом cooldown и уникальности по строкам
function handleRussianCharacters() {
    const textarea = document.getElementById('dataInput');
    const audio = document.getElementById('simvil_rusSound');

    const currentText = textarea.value;

    // Проверяем, включены ли звуки вообще
    const soundCheckbox = document.getElementById('soundNotification');
    const isSoundEnabled = soundCheckbox && soundCheckbox.checked;

    if (!isSoundEnabled) {
        // Обновляем состояние для следующего ввода
        lastTextValue = currentText;
        return;
    }

    // Проверяем, появились ли новые русские символы в строках
    const hasNewRussian = hasNewRussianCharactersInLines(currentText);

    if (hasNewRussian && !isSimvilRusSoundCooldown) {
        isSimvilRusSoundCooldown = true;

        // Останавливаем только конфликтующие звуки
        stopAllSounds();

        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error('Ошибка воспроизведения звука simvil_rus:', error);
        });

        // Сбрасываем cooldown через заданное время
        setTimeout(() => {
            isSimvilRusSoundCooldown = false;
        }, soundCooldown);
    }

    // Всегда обновляем состояние отслеживания
    lastTextValue = currentText;
}
