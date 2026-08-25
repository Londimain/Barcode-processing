// Функция разделения файла
function splitFile() {
  // Проверяем, заблокирована ли кнопка
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 5 секунд');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="splitFile()"]');

  // Устанавливаем время блокировки (5 секунд)
  const buttonCooldown = 5000;

  // Устанавливаем флаг блокировки
  isButtonDisabled = true;

  // Визуальная блокировка кнопки
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Подождите... (5 с)';
  }

  let countdown = 5; // Начальное значение отсчёта (5 секунд)
  let countdownInterval; // Переменная для хранения ID интервала

  // Запускаем обратный отсчёт
  countdownInterval = setInterval(() => {
    countdown--;

    if (countdown >= 0 && btn) {
      btn.textContent = `Подождите... (${countdown} с)`;
    }

    // Когда отсчёт дошёл до 0, останавливаем интервал
    if (countdown === 0) {
      clearInterval(countdownInterval);
    }
  }, 1000); // Обновляем каждую секунду (1000 мс)

  // Активируем блокировку на 5 секунд
  disableButtons();

  // Проверяем, загружен ли файл
  if (!splitFileData) {
    alert('Выберите файл для разделения');
    // Гарантированно разблокируем кнопку при ошибке
    clearInterval(countdownInterval);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Разделить файл';
    }
    isButtonDisabled = false;
    return;
  }

  // Получаем количество кодов в одном файле
  const codesPerFile = parseInt(document.getElementById('codesPerFile').value);
  if (isNaN(codesPerFile) || codesPerFile < 1) {
    alert('Введите корректное количество кодов (больше 0).');
    // Гарантированно разблокируем кнопку при ошибке
    clearInterval(countdownInterval);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Разделить файл';
    }
    isButtonDisabled = false;
    return;
  }

  // Удаляем пустые строки из данных
  const nonEmptyLines = splitFileData.filter(line => line.trim().length > 0);

  const totalLines = nonEmptyLines.length;
  const totalFiles = Math.ceil(totalLines / codesPerFile);

  // Обновляем информацию о файле в интерфейсе
  const splitFileInfo = document.getElementById('splitFileInfo');
  if (splitFileInfo) {
    splitFileInfo.innerHTML = `
      <strong>Разделено на:</strong> ${totalFiles} шт.
    `;
  }
// Остальные оповещения
// <strong>Файл загружен:</strong> ${originalFileName}<br>
// <strong>Всего строк:</strong> ${totalLines}
// Показываем процесс разделения
// showSplitStatus(`Начинаем разделение на ${totalFiles} файлов...`, 'status success');

  let currentFileIndex = 1;

  // Разделяем данные на части и создаём файлы
  for (let i = 0; i < totalLines; i += codesPerFile) {
    // Берём часть данных: от i до i + codesPerFile (или до конца массива)
    const chunk = nonEmptyLines.slice(i, i + codesPerFile);

// Сначало удаляются все  символы, далее все строки разбиваются по 37 символа, а потом во свех строках после 31 символа добавляется  символ.
const processedChunk = chunk.map(line => {
  // Удаляем все символы  из строки
  const cleanLine = line.replace(//g, '');

  // Разбиваем строку на части по 37 символов
  const linesBy37 = [];
  for (let j = 0; j < cleanLine.length; j += 37) {
    linesBy37.push(cleanLine.slice(j, j + 37));
  }

  // Обрабатываем каждую часть: если длина ≥ 32, добавляем  после 31‑го символа
  const processedLines = linesBy37.map(subLine => {
    if (subLine.length <= 31) {
      return subLine;
    }
    if (subLine[31] === '') {
      return subLine;
    }
    return subLine.slice(0, 31) + '' + subLine.slice(31);
  });

  return processedLines.join('\r\n');
});

    // Создаём Blob для скачивания
    const blob = new Blob([processedChunk.join('\r\n') + '\r\n'], {
      type: 'text/plain;charset=utf-8'
    });

    // Формируем имя файла: folderName/part_1_of_6.txt, folderName/part_2_of_6.txt и т. д.
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
  stopAllSounds();
  playNotificationSound('split');

  // Показываем итоговое оповещение об успешном выполнении
  alert(`Файл успешно разделён на ${totalFiles} шт...`);

  // Разблокируем кнопку и остановим отсчёт через 5 секунд
  setTimeout(() => {
    clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
    if (btn && btn.disabled) {
      btn.disabled = false;
      btn.textContent = 'Разделить файл'; // Возвращаем исходный текст кнопки
    }
    isButtonDisabled = false; // Сбрасываем флаг блокировки
    console.log('Кнопка разблокирована через 5 секунд');
  }, buttonCooldown);
}
