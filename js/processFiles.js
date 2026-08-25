// Обработка двух файлов
function processFiles() {
 // Проверяем, заблокирована ли какая нибудь кнопка - если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (file1 && file2) {
        
        originalFileName1 = file1.name;
        originalFileName2 = file2.name;

  // Устанавливаем флаг блокировки
  isButtonDisabled = true;

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="processFiles()"]');

  // Время блокировки — 3 секунды (3000 мс)
  const buttonCooldown = 3000;

  // Визуальная блокировка кнопки
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Подождите... 3 с';
  }

  let countdown = 3; // Начальное значение отсчёта
  let countdownInterval; // Переменная для хранения ID интервала

  // Запускаем обратный отсчёт
  countdownInterval = setInterval(() => {
    countdown--;

    if (countdown >= 0 && btn) {
      btn.textContent = `Подождите... ${countdown} с`;
    }

    // Когда отсчёт дошёл до 0, останавливаем интервал
    if (countdown === 0) {
      clearInterval(countdownInterval);
    }
  }, 1000); // Обновляем каждую секунду (1000 мс)

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

                // Вывод статуса во всплывающем окне
                alert(`Обработано: удалено ${deletedLines.length} строк.`);

                // Звуковое оповещение
                stopAllSounds();
                playNotificationSound('process');

                    // Разблокируем кнопку и остановим отсчёт через 3 секунды
  setTimeout(() => {
    clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
    if (btn && btn.disabled) {
      btn.disabled = false;
      btn.textContent = 'Обработать данные'; // Возвращаем исходный текст кнопки
    }
    isButtonDisabled = false; // Сбрасываем флаг блокировки
    console.log('Кнопка разблокирована через 3 секунды');
  }, buttonCooldown);
            };

            reader2.readAsText(file2);
        };

        reader1.readAsText(file1);
    } else {
        alert('Пожалуйста, выберите оба файла.');
    }

}