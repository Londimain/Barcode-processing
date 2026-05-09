// Сохранение результата для двух файлов (с ENTER в последней строке)
function saveResult() {
    if (!currentResult) {
        alert('Сначала обработайте файлы.');
        return;
    }

    // Создаём имя файла на основе имён исходных файлов
    let fileName = 'result_';
    if (originalFileName1 && originalFileName2) {
        // Берём имена без расширений и объединяем
        const name1 = originalFileName1.replace(/\.[^.]+$/, '');
        const name2 = originalFileName2.replace(/\.[^.]+$/, '');
        fileName += `${name1}_${name2}`;
    } else {
        fileName += 'merged';
    }
    fileName += '.txt';

    // Создаём Blob с добавлением \r\n в конце файла (ENTER в последней строке)
    const blob = new Blob([currentResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Добавляем ссылку в документ, имитируем клик и удаляем ссылку
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    //Звуковое оповещение
    playNotificationSound('download');

    // Освобождаем память
    URL.revokeObjectURL(url);
}