// Обработка двух файлов
function processFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (file1 && file2) {
        originalFileName1 = file1.name;
        originalFileName2 = file2.name;

        const reader1 = new FileReader();
        reader1.onload = function() {
            const text1 = reader1.result;
            const lines1 = text1.split('\n').map(line => line.trim());

            const reader2 = new FileReader();
            reader2.onload = function() {
                const text2 = reader2.result;
                const lines2 = text2.split('\n').map(line => line.trim());

                // Шаг 1: Удаление символа  из всех строк в обоих файлах
                const cleanLines1 = lines1.map(line => line.replace(//g, ''));
                const cleanLines2 = lines2.map(line => line.replace(//g, ''));

                // Шаг 2: Разбиение строк длиннее 38 символов на части
                const splitLines1 = splitLongLines(cleanLines1);
                const splitLines2 = splitLongLines(cleanLines2);

                // Шаг 3: Удаление пустых строк
                const nonEmptyLines1 = splitLines1.filter(line => line !== '');
                const nonEmptyLines2 = splitLines2.filter(line => line !== '');

                // Шаг 4: Удаление дубликатов внутри каждого файла
                const uniqueLines1 = [...new Set(nonEmptyLines1)];
                const uniqueLines2 = [...new Set(nonEmptyLines2)];

                // Уникальная логика: удаление строк из первого файла, которые есть во втором
                const finalUniqueLines = new Set(uniqueLines1);
                const deletedLines = [];

                uniqueLines1.forEach(line => {
                    if (uniqueLines2.includes(line)) {
                        finalUniqueLines.delete(line);
                        deletedLines.push(line);
                    }
                });

                // Шаг 5: Добавление символа  после 31-го символа
                const processedLines = Array.from(finalUniqueLines).map(line => {
                    if (line.length <= 31) {
                        return line;
                    }

                    if (line[31] === '') {
                        return line;
                    }

                    return line.slice(0, 31) + '' + line.slice(31);
                });

                // Финальная сборка результата
                currentResult = processedLines.join('\r\n') + '\r\n';

                // Показываем количество удалённых строк
                statusTwoFilesElement.textContent = `Обработано: удалено ${deletedLines.length} строк.`;
                statusTwoFilesElement.className = 'status success';

                // Звуковое оповещение
                playNotificationSound('process');


                setTimeout(() => {
                    statusTwoFilesElement.textContent = '';
                    statusTwoFilesElement.className = 'status';
                }, 5000);
            };

            reader2.readAsText(file2);
        };

        reader1.readAsText(file1);
    } else {
        alert('Пожалуйста, выберите оба файла.');
    }
}