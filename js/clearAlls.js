// Функция для полной очистки всех данных на странице
function clearAlls() {
  // Проверяем, заблокирована ли какая‑нибудь кнопка — если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const btn = document.querySelector('button[onclick="clearAlls()"]');
  let countdownInterval; // Переменная для хранения ID интервала

  // Визуальная блокировка кнопки и запуск таймера
  if (btn) {
    btn.disabled = true;
    let countdown = 3; // Начальное значение отсчёта — 3 секунды
    btn.textContent = `Очистка... ${countdown} с`;

    // Запускаем обратный отсчёт
    countdownInterval = setInterval(() => {
      countdown--;

      if (countdown >= 0 && btn) {
        btn.textContent = `Очистка... ${countdown} с`;
      }

      // Когда отсчёт дошёл до 0, останавливаем интервал
      if (countdown === 0) {
        clearInterval(countdownInterval);
      }
    }, 1000); // Обновляем каждую секунду (1000 мс)
  }

try {
    // Очищаем текстовые поля и поля с числами
    const textInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    textInputs.forEach(input => {
        input.value = '';
    });

    // Очищаем поля загрузки файлов
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(fileInput => {
        fileInput.value = ''; // Сбрасываем значение поля файла
    });

    // Очищаем текстовую область вывода
    const outputTextarea = document.getElementById('output');
    if (outputTextarea) {
        outputTextarea.value = 'Здесь отобразится результат после обработки...';
    }

    // Обновим текстовое поле для сортировки GTIN
    const sortingOutput = document.getElementById('sorting-output');
    if (sortingOutput) {
        sortingOutput.value = 'Здесь отобразится результат после обработки...';
    }

    // Обновим счётчик групп GTIN
    const groupsCount = document.getElementById('groups-count');
    if (groupsCount) {
        groupsCount.textContent = '0';
    }

    // Очистим поле загрузки файла для GTIN
    const gtinFileInput = document.getElementById('fileInput');
    if (gtinFileInput) {
        gtinFileInput.value = '';
    }

    // Очистим дополнительные результаты
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.textContent = '';
    }

    // Обнуляем счётчик недостающих марок
    const missingCount = document.getElementById('missing-count');
    if (missingCount) {
        missingCount.textContent = '0';
    }

    // Сбрасываем результат расчёта акцизной марки
    const resultField = document.getElementById('result');
    if (resultField) {
        resultField.value = '';
    }

    // Очищаем элементы калькулятора дней
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        startDateInput.value = '';
    }

    const add360 = document.getElementById('add-360');
    const add180 = document.getElementById('add-180');
    const add150 = document.getElementById('add-150');

    if (add360) add360.checked = false;
    if (add180) add180.checked = false;
    if (add150) add150.checked = false;

    const resultDays = document.getElementById('resultDays');
    if (resultDays) {
        resultDays.innerHTML = 'Здесь отобразится конечная дата срока годности';
    }

    // Дополнительные глобальные переменные, которые нужно сбросить
    window.sourceFileName = undefined; // Если есть такая переменная

    // Визуальные обновления (убираем возможные подсказки или статусы)
    const statusDiv = document.getElementById('statusInfo');
    if (statusDiv) {
        statusDiv.textContent = '';
    }

    // Воспроизводим звук очистки (если функция доступна)
    if (typeof stopAllSounds === 'function') {
        stopAllSounds();
    }
    if (typeof playNotificationSound === 'function') {
        playNotificationSound('clear_left');
    }

    console.log('Все данные успешно очищены, включая результат сортировки GTIN и расчёт акцизной марки');
}

    catch (error) {
    console.error('Ошибка при очистке поля:', error);

    // При ошибке останавливаем отсчёт и разблокируем кнопку
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Очистить';
    }
  } finally {
    // Гарантированно разблокируем кнопку и остановим отсчёт через 3 секунды
    setTimeout(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = 'Очистить'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false;
      console.log('Кнопка разблокирована через 3 секунды');
    }, 3000); // Таймер на 3000 мс (3 секунды)
  }
}