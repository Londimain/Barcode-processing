// Функция подсчёта результатов
function calculateResults() {
  // Проверяем, заблокирована ли кнопка
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const fileInput = document.getElementById('fileInput');
  const excelFileInput = document.getElementById('excelFileInput');

  // Получаем кнопку ДО начала любых операций
  const btn = document.querySelector('button[onclick="calculateResults()"]');
  let countdownInterval;
  const buttonCooldown = 3000; // Время блокировки — 3 секунды

  try {
    // БЛОКИРУЕМ КНОПКУ СРАЗУ В НАЧАЛЕ ФУНКЦИИ
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Подождите...';
    } else {
      console.error('Кнопка для подсчёта результатов не найдена!');
      return;
    }

    // Устанавливаем флаг блокировки
    isButtonDisabled = true;

    // Проверяем загрузку файлов
    if (!fileInput.files || fileInput.files.length === 0) {
      throw new Error('Пожалуйста, загрузите базу данных!');
    }

    if (!excelFileInput.files || excelFileInput.files.length === 0) {
      throw new Error('Сначала загрузите Excel‑файл с базой префиксов!');
    }

    if (Object.keys(prefixDatabase).length === 0) {
      const sound = document.getElementById('miscalculationSound');
      if (sound) sound.play();
      throw new Error('База префиксов не загружена из Excel‑файла!');
    }

    // Инициализируем объект для хранения результатов
    const results = {};
    let totalMatches = 0;
    let processedFiles = 0;

    // Проходим по всем загруженным файлам
    for (let file of selectedFiles) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = e.target.result;
        const lines = data.split('\n');

        for (let line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue; // Пропускаем пустые строки

          // Берём первые 16 символов как префикс
          const linePrefix = trimmedLine.substring(0, 16);

          if (prefixDatabase[linePrefix]) {
            const productName = prefixDatabase[linePrefix];
            results[productName] = (results[productName] || 0) + 1;
            totalMatches++;
          }
        }

        processedFiles++;

        // Если обработали все файлы — выводим результаты
        if (processedFiles === selectedFiles.length) {
          // Очищаем таблицу результатов
          const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
          resultsTable.innerHTML = '';

          // Заполняем таблицу результатов
          for (const [name, count] of Object.entries(results)) {
            const row = resultsTable.insertRow();
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = `${count} шт.`;
          }

          // Отображаем общую сумму
          const totalSumElement = document.getElementById('totalSum');
          totalSumElement.innerHTML = `<strong>Общая сумма составляет:</strong> ${totalMatches} шт.`;

          // Запускаем обратный отсчёт на кнопке
          let countdown = 3;
          countdownInterval = setInterval(() => {
            if (countdown > 0) {
              countdown--;
              if (btn) btn.textContent = `Подождите... ${countdown} с`;
            } else {
              clearInterval(countdownInterval);
            }
          }, 1000);

          stopAllSounds();
          // Воспроизводим звуковое оповещение
          playNotificationSound('miscalculation');

          // Показываем alert с результатами
          alert(`Обработка завершена! Найдено совпадений: ${totalMatches} в ${selectedFiles.length} файлах.`);

          // Разблокируем кнопку через 3 секунды после звукового сигнала
          setTimeout(() => {
            // Гарантированно останавливаем интервал, если он ещё работает
            if (countdownInterval) {
              clearInterval(countdownInterval);
            }

            // Разблокировка кнопки
            if (btn) {
              btn.disabled = false;
              btn.textContent = 'Просчитать'; // Возвращаем исходный текст кнопки
            }
            isButtonDisabled = false; // Сбрасываем флаг блокировки
            console.log('Кнопка разблокирована через 3 секунды');
          }, buttonCooldown);
        }
      };
      reader.readAsText(file);
    }
  } catch (error) {
    console.error('Ошибка при подсчёте результатов:', error);
    alert(error.message);

    // В случае ошибки — разблокируем кнопку
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Просчитать';
    }
    isButtonDisabled = false;
  } finally {
    // Очистка статуса через 3 секунды
    setTimeout(() => {
      if (statusTwoFilesElement) {
        statusTwoFilesElement.textContent = '';
        statusTwoFilesElement.className = 'status';
      }
    }, 3000);
  }
}
