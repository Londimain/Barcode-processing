// Функция для сохранения результата
function saveDataAsFile() {
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="saveDataAsFile()"]');
  const statusTwoFilesElement = document.getElementById('statusTwoFiles');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Подождите... 3 с';
  } else {
    console.error('Кнопка для сохранения не найдена!');
    return;
  }

  isButtonDisabled = true;
  let countdown = 3;
  let countdownInterval;

  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown >= 0 && btn) {
      btn.textContent = `Подождите... ${countdown} с`;
    }
    if (countdown === 0) clearInterval(countdownInterval);
  }, 1000);

  try {
    const regionRB = document.getElementById('regionRB');
    const regionRF = document.getElementById('regionRF');

    let regionSuffix = '';
    if (regionRB && regionRB.checked) regionSuffix = ' РБ';
    else if (regionRF && regionRF.checked) regionSuffix = ' РФ';

    let data = textarea.value;
    if (!data) {
      alert('Поле для сохранения пустое!');
      throw new Error('Отсутствуют данные для сохранения');
    }

    const productName = productNameField.value.trim();
    if (!productName || productName === 'Не определено') {
      alert('Не удалось определить название продукта. Проверьте данные в поле "Название продукта"');
      throw new Error('Отсутствует название продукта');
    }

    // --- Опциональные даты ---
    let datesPart = '';

    const inDateInput = document.getElementById('in-date');
    const resultEl = document.getElementById('resultDaysSrok');

    if (
      inDateInput && inDateInput.value &&
      resultEl && resultEl.dataset.endDate
    ) {
      const startDateObj = new Date(inDateInput.value);
      const startDateStr = formatDateForFilename(startDateObj);
      const endDateStr = resultEl.dataset.endDate;
      datesPart = ` ${startDateStr} - ${endDateStr}`;
    }
    // Если даты не заданы — datesPart останется пустой строкой
    // ------------------------

    const lines = data.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const totalLines = nonEmptyLines.length;

    if (totalLines === 0) {
      alert('Нет данных для сохранения — все строки пустые!');
      throw new Error('Нет данных для сохранения');
    }

    const processedLines = nonEmptyLines.map(line => {
      let processedLine = line;
      if (processedLine.startsWith(']d2')) {
        processedLine = processedLine.substring(3);
      }
      processedLine = processedLine.replace(//g, '');
      if (processedLine.length > 31 && processedLine[31] !== '') {
        processedLine = processedLine.slice(0, 31) + '' + processedLine.slice(31);
      }
      return processedLine;
    });

    data = processedLines.join('\r\n') + '\r\n';

    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'text/plain;charset=utf-8' });

    // Имя файла: если даты есть — добавляем их, иначе просто Название (кол-во) Регион.txt
    const fileName = `${productName} (${totalLines})${regionSuffix}${datesPart}.txt`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    stopAllSounds();
    playNotificationSound('save');
    URL.revokeObjectURL(link.href);

  } catch (error) {
    console.error('Ошибка при сохранении результата:', error);
    alert('Произошла ошибка при сохранении файла. Проверьте данные и попробуйте снова.');

    clearInterval(countdownInterval);
    isButtonDisabled = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Сохранить';
    }
  } finally {
    setTimeout(() => {
      clearInterval(countdownInterval);
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = 'Сохранить';
      }
      isButtonDisabled = false;
      console.log('Кнопка разблокирована через 3 секунды');

      if (statusTwoFilesElement) {
        statusTwoFilesElement.textContent = '';
        statusTwoFilesElement.className = 'status';
      }
    }, 3000);
  }
}

