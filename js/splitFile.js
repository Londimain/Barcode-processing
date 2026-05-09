// Функция разделения файла
function splitFile() {
    // Проверяем, загружен ли файл
    if (!splitFileData) {
        showSplitStatus('Пожалуйста, выберите файл для разделения.', 'error');
        return;
    }

    // Получаем количество кодов в одном файле
    const codesPerFile = parseInt(document.getElementById('codesPerFile').value);
    if (isNaN(codesPerFile) || codesPerFile < 1) {
        showSplitStatus('Введите корректное количество кодов (больше 0).', 'error');
        return;
    }

    // Удаляем пустые строки из данных
    const nonEmptyLines = splitFileData.filter(line => line.trim().length > 0);

    const totalLines = nonEmptyLines.length;
    const totalFiles = Math.ceil(totalLines / codesPerFile);

    // Обновляем информацию о файле в интерфейсе
    splitFileInfo.innerHTML = `
        <strong>Файл загружен:</strong> ${originalFileName}<br>
        <strong>Всего строк:</strong> ${totalLines}
    `;

    // Показываем процесс разделения
    showSplitStatus(`Начинаем разделение на ${totalFiles} файлов...`, 'info');

    let currentFileIndex = 1;

    // Разделяем данные на части и создаём файлы
    for (let i = 0; i < totalLines; i += codesPerFile) {
        // Берём часть данных: от i до i + codesPerFile (или до конца массива)
        const chunk = nonEmptyLines.slice(i, i + codesPerFile);

        // Обрабатываем каждую строку в чанке: добавляем  после 31-го символа, если его нет
        const processedChunk = chunk.map(line => {
            // Пропускаем обработку, если строка короче 31 символа
            if (line.length <= 31) {
                return line;
            }

            // Проверяем, есть ли уже  на 32‑й позиции (индекс 31)
            if (line[31] === '') {
                // Если символ уже есть, возвращаем строку без изменений
                return line;
            }

            // Вставляем  после 31‑го символа (индекс 31)
            return line.slice(0, 31) + '' + line.slice(31);
        });

        // Создаём Blob для скачивания
        const blob = new Blob([processedChunk.join('\r\n') + '\r\n'], {
            type: 'text/plain;charset=utf-8'
        });

        // Формируем имя файла: folderName/part_1_of_6.txt, folderName/part_2_of_6.txt и т. д.
        const fileName = `${originalFileName.replace(/\.[^.]+$/, '')}/part_${currentFileIndex}_of_${totalFiles}.txt`;

        // Создаём ссылку для скачивания
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        currentFileIndex++;
    }

    // Звуковое оповещение
    playNotificationSound('split');


    // Показываем итоговое оповещение об успешном выполнении
    showSplitStatus('Файл успешно разделён');
}