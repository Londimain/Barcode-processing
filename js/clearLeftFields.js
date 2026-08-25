// Функция для очистки левого текстового поля
function clearLeftFields() {
 // Проверяем, заблокирована ли какая нибудь кнопка - если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="clearLeftFields()"]');
  const statusDiv = document.getElementById('statusInfo'); // Получаем элемент статуса
  const resultsDiv = document.getElementById('results'); // Получаем элемент результатов

  // Визуальная блокировка кнопки с начальным текстом
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Подождите... 3 с';
  }

  // Активируем блокировку на 3 секунды
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
    // Очищаем левое текстовое поле
    if (textarea) {
        textarea.value = '';
    }
    // Очищаем поле для поиска товаров
    if (searchInput) {
        searchInput.value = '';
    }

    // ОЧИСТКА УКАЗАННЫХ ЭЛЕМЕНТОВ
    if (statusDiv) {
        statusDiv.textContent = 'Найдено совпадений: 0';
    }
    if (resultsDiv) {
        resultsDiv.textContent = 'Здесь появятся результаты поиска...';
    }

    // ДОБАВЛЕННАЯ СТРОКА: очистка sumPackField
    if (sumPackField) {
        sumPackField.value = 'Собрано: нет; Набрано: нет';
    }

    // Сброс переменных для отслеживания префиксов
    firstPrefix = null;
    notifiedPrefixes = new Set();

    // Сбрасываем отслеживание партий в sessionStorage
    sessionStorage.setItem('lastPartyNumber', '0');
    sessionStorage.setItem('wasZeroParties', 'true');
    sessionStorage.setItem('lastTotalLines', '0');

    // Обновляем отображение информации о партиях
    updateSumLinesWithParties(0);

    stopAllSounds();
    // Воспроизводим звук очистки (clear_left)
    playNotificationSound('clear_left');
}
    catch (error) {
    console.error('Ошибка при очистке поля:', error);

    // При ошибке останавливаем отсчёт и разблокируем кнопку
    clearInterval(countdownInterval);
    isButtonDisabled = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Очистить данные';
    }
  } finally {
    // Гарантированно разблокируем кнопку и остановим отсчёт через 3 секунды
    setTimeout(() => {
      clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = 'Очистить данные'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false;
      console.log('Кнопка разблокирована через 3 секунды');
    }, 3000); // Таймер на 3000 мс (3 секунды)
  }
}
