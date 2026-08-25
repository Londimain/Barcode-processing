// Сохранение результата
// Функция обработчика клика для кнопки сохранения результата
function handleSaveClick() {
  // Проверяем, заблокирована ли какая‑нибудь кнопка — если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="handleSaveClick()"]');
  const statusDiv = document.getElementById('statusInfo'); // Получаем элемент статуса
  const resultsDiv = document.getElementById('results'); // Получаем элемент результатов

  // Визуальная блокировка кнопки с начальным текстом
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Подождите... 3 с';
  }

  // Активируем блокировку на 3 секунды
  disableButtons(3000); // Передаём длительность 3000 мс (3 секунды)

  let countdown = 3; // Начальное значение отсчёта — 3 секунды
  let countdownInterval; // Переменная для хранения ID интервала

  // Запускаем обратный отсчёт
  countdownInterval = setInterval(() => {
    countdown--;

    if (countdown >= 0 && btn) {
      btn.textContent = `Подождите... ${countdown} с`;
    }

    // Когда отсчёт дошёл до 0, останавливаем интервал
    if (countdown === 0) {
      clearInterval(countdownInterval);
    }
  }, 1000); // Обновляем каждую секунду (1000 мс)

  try {
    if (!outputTextarea || !outputTextarea.value) {
      alert('Сначала обработайте файлы!');
      throw new Error('Отсутствуют данные для сохранения');
    }

    if (!window.sourceFileName) {
      alert('Не обнаружено имя исходного файла. Выполните поиск марок сначала.');
      throw new Error('Отсутствует имя исходного файла');
    }

    // Для сохранения берём только обработанную часть (без удалённых символов)
    const saveLines = outputTextarea.value.split('\n').map(line => {
      // Если в строке есть удалённые символы (длина больше 39), берём только обработанную часть
      if (line.length > 39) {
        return line.slice(0, -13);
      }
      return line;
    });

    // Считаем количество строк для имени файла
    const lineCount = saveLines.length;

    // Формируем имя файла: [имя_исходного_файла] (разница: [количество_строк]).txt
    const baseName = window.sourceFileName.replace(/\.txt$/i, '');
    const fileName = `${baseName} (разница: ${lineCount}).txt`;

    // Формируем содержимое файла с CRLF в конце каждой строки
    const fileContent = saveLines.join('\r\n') + '\r\n';

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Явная проверка состояния чекбокса
    if (soundCheckbox && soundCheckbox.checked) {
      stopAllSounds();
      playNotificationSound('download');
      console.log('Звуковое оповещение запущено (чекбокс отмечен)');
    } else {
      console.log('Звуковое оповещение пропущено (чекбокс не отмечен)');
    }

  } catch (error) {
    console.error('Ошибка при сохранении результата:', error);
    alert('Произошла ошибка при сохранении файла. Проверьте данные и попробуйте снова.');

    // При ошибке останавливаем отсчёт и разблокируем кнопку
    clearInterval(countdownInterval);
    isButtonDisabled = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Скачать результат';
    }
  } finally {
    // Гарантированно разблокируем кнопку и остановим отсчёт через 3 секунды
    setTimeout(() => {
      clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = 'Скачать результат'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false;
      console.log('Кнопка разблокирована через 3 секунды');

      // Очистка статуса через 3 секунды (если элемент существует)
      if (statusDiv) {
        statusDiv.textContent = '';
      }
      if (resultsDiv) {
        resultsDiv.textContent = '';
      }
    }, 3000); // Таймер на 3000 мс (3 секунды)
  }
}
