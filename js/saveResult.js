// Сохранение результата для двух файлов (с ENTER в последней строке)
function saveResult() {
  // Проверяем, заблокирована ли какая‑нибудь кнопка — если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="saveResult()"]');

  try {
    if (!currentResult) {
      alert('Сначала обработайте файлы.');
      return;
    }

    // Считаем количество строк: удаляем завершающий перенос, затем разбиваем
    let trimmedContent = currentResult.replace(/[\r\n]+$/, '');
    const lineCount = trimmedContent ? trimmedContent.split(/\r\n|\r|\n/).length : 0;

    // Берём имя только от первого файла
    let fileName = originalFileName1 || 'result';

    // Убираем расширение из имени файла и сохраняем его отдельно
    const extensionMatch = fileName.match(/\.[^.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '.txt';
    const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '');

    // Ищем в имени уже существующее количество строк в формате (число)
    const parenthesesRegex = /\(\d+\)/;
    const hasParentheses = parenthesesRegex.test(nameWithoutExtension);

    let baseName;
    if (hasParentheses) {
      // Если скобки уже есть — заменяем число внутри скобок на актуальное количество строк
      baseName = nameWithoutExtension.replace(parenthesesRegex, `(${lineCount})`);
    } else {
      // Если скобок нет — просто добавляем количество строк в скобках
      baseName = `${nameWithoutExtension} (${lineCount})`;
    }

    // Определяем, какой регион выбран
    const regionRB = document.getElementById('regionRB');
    const regionRF = document.getElementById('regionRF');
    let selectedRegion = '';

    if (regionRB.checked) {
      selectedRegion = ' РБ';
    } else if (regionRF.checked) {
      selectedRegion = ' РФ';
    }

    // Если регион выбран, заменяем существующий маркер региона или добавляем новый
    let finalName;
    if (selectedRegion) {
      // Удаляем любой существующий маркер региона (РБ/РФ) в конце строки (с пробелом перед ним)
      const regionRegex = /(\sРБ|\sРФ)$/;
      finalName = baseName.replace(regionRegex, '') + selectedRegion;
    } else {
      // Если ни один чекбокс не отмечен — оставляем имя как есть, без добавления региона
      finalName = baseName;
    }

    // Собираем полное имя файла с расширением
    fileName = finalName + extension;

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

    // Освобождаем память
    URL.revokeObjectURL(url);

    // Звуковое оповещение — выполняется сразу после сохранения файла
    stopAllSounds();
    playNotificationSound('download');

    // --- БЛОКИРОВКА И ОТСЧЁТ НАЧИНАЮТСЯ ПОСЛЕ ЗВУКОВОГО СИГНАЛА ---
    // Устанавливаем флаг блокировки
    isButtonDisabled = true;

    // Время блокировки — 3 секунды (3000 мс)
    const buttonCooldown = 3000;

    // Визуальная блокировка кнопки
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Подождите... 3 с';
    } else {
      console.error('Кнопка для сохранения результата не найдена!');
      isButtonDisabled = false;
      return;
    }

    let countdown = 3; // Начальное значение отсчёта
    let countdownInterval; // Переменная для хранения ID интервала

    // Запускаем обратный отсчёт
    countdownInterval = setInterval(() => {
      if (countdown > 0) {
        countdown--;
        btn.textContent = `Подождите... ${countdown} с`;
      } else {
        // Когда отсчёт дошёл до 0, останавливаем интервал
        clearInterval(countdownInterval);
      }
    }, 1000); // Обновляем каждую секунду (1000 мс)

    // Разблокируем кнопку и сбросим флаг через 3 секунды
    setTimeout(() => {
      // Гарантированно останавливаем интервал, если он ещё работает
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      // Разблокировка кнопки
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Скачать результат'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false; // Сбрасываем флаг блокировки
      console.log('Кнопка разблокирована через 3 секунды');
    }, buttonCooldown);

  } catch (error) {
    console.error('Ошибка при сохранении результата:', error);
    alert('Произошла ошибка при сохранении файла. Проверьте данные и попробуйте снова.');
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



