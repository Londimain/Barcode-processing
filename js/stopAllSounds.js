// Отключает звук party для воспроизведения звука simvil_rusSound
// Функция для остановки всех звуков
function stopAllSounds() {
    // Сначала останавливаем звуки по ID (старый способ)
    const sounds = [
        'party',
        'vestovarSound',
        'neverni_tovarSound',
        'simvil_rusSound',
        'miscalculationSound',
        'save_excelSound',
        'saveSound',
        'splitSound',
        'processSound',
        'processSaveSound',
        'downloadSound',
        'clearLeftSound',
        'clearAllSound',
        'search_brandSound',
        'processing_CodeSound',
        'formingSound',
        'expirationDateSound'
    ];

    sounds.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio && !audio.paused && audio.currentTime > 0) {
            try {
                audio.pause();
                audio.currentTime = 0;
                console.log(`Звук "${soundId}" остановлен`);
            } catch (e) {
                console.warn(`Не удалось остановить звук ${soundId}:`, e);
            }
        }
    });

    // Затем ищем все аудиоэлементы в DOM и останавливаем их
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        if (!audio.paused && audio.currentTime > 0) {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.warn('Не удалось остановить аудиоэлемент:', e);
            }
        }
    });
}
