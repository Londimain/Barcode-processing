// Функция для очистки всех полей ввода и сброс состояния
function clearAllFields() {
 // Проверяем, заблокирована ли какая нибудь кнопка - если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  // Устанавливаем флаг блокировки
  isButtonDisabled = true;

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="clearAllFields()"]');

  // Получаем элементы для очистки
  const statusDiv = document.getElementById('statusInfo'); // Элемент статуса совпадений
  const resultsDiv = document.getElementById('results'); // Элемент результатов поиска

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

    // Обновляем отображение информации о партиях
    updateSumLinesWithParties(0);

    // Очищаем все правые поля ввода
    const sumLinesField = document.getElementById('sumLines');
    const sumCalculationField = document.getElementById('sumCalculation');
    const productNameField = document.getElementById('productName');
    const packagesCountField = document.getElementById('packagesCount');
    const bottlesPerPackageField = document.getElementById('bottlesPerPackage');
    const unitsPerBatchField = document.getElementById('unitsPerBatch');
    const codesPerFileField = document.getElementById('codesPerFile');





    // 1. Сначала очищаем поле «Количество товара в упаковке»
    if (bottlesPerPackageField) {
        bottlesPerPackageField.value = '';
    }

    // 2. Теперь очищаем текстовое поле ввода
    if (textarea) {
        textarea.value = '';
    }

    // 3. Очищаем поле количества отсканированного товара с корректным начальным состоянием
    if (sumLinesField) {
        // После очистки bottlesPerPackage значение будет 0
        const bottlesPerPackage = 0;
        let десятокValue = 0;

        if (bottlesPerPackage > 0) {
            десятокValue = bottlesPerPackage * 10;
        }

        if (десятокValue > 0) {
            sumLinesField.value = `Товара: нет / ${десятокValue}; партий: нет`;
        } else {
            sumLinesField.value = 'Товара: нет / десяток; партий: нет';
        }
    }

// 4. Очищаем остальные поля
if (productNameField) {
    productNameField.value = '';
}
if (sumCalculationField) {
    sumCalculationField.value = '';
}
if (packagesCountField) {
    packagesCountField.value = '';
}
// ДОБАВЛЕННАЯ СТРОКА: очистка sumPackField
if (sumPackField) {
    sumPackField.value = 'Собрано: нет; Набрано: нет';
}

// --- ДОБАВЛЕНО: сброс даты, чекбоксов и результата расчёта ---

// 1. Сброс поля даты
const inDateInput = document.getElementById('in-date');
if (inDateInput) {
  inDateInput.value = '';
}

// 2. Сброс чекбоксов срока годности (только один может быть выбран, но мы снимаем все)
document.querySelectorAll('input[name="days"]').forEach(cb => {
  cb.checked = false;
});

// 3. Сброс результата и data-атрибута
const resultEl = document.getElementById('resultDaysSrok');
if (resultEl) {
  resultEl.textContent = 'Конечная дата срока годности';
  resultEl.dataset.endDate = '';
}
// -------------------------------------------------------------

// Сброс глобальных переменных (остаётся без изменений)
firstPrefix = null;
notifiedPrefixes.clear();
vestovarSoundPlayed = false;
isInputBlocked = false;

    // Очистка sessionStorage (остаётся без изменений)
    sessionStorage.removeItem('lastPartyNumber');
    sessionStorage.removeItem('lastTotalLines');
    sessionStorage.removeItem('lastVestovarParties');
    sessionStorage.removeItem('wasZeroParties');

    console.log('Все поля успешно очищены');

    
    




    if (sumCalculationField) sumCalculationField.value = '';
    if (productNameField) productNameField.value = '';
    if (packagesCountField) packagesCountField.value = '';
    if (bottlesPerPackageField) bottlesPerPackageField.value = '';
    if (unitsPerBatchField) unitsPerBatchField.value = '120'; // Сброс до значения по умолчанию (Количество товара в партии)
    if (codesPerFileField) codesPerFileField.value = '100'; // Сброс указанного количества кодов в одном файле для разделения

    // Сброс чекбоксов
    const regionRB = document.getElementById('regionRB');
    const regionRF = document.getElementById('regionRF');

    if (regionRB) regionRB.checked = false;
    if (regionRF) regionRF.checked = false;

    // Очищаем поля загрузки файлов
    const fileInput = document.getElementById('fileInput');
    const excelFileInput = document.getElementById('excelFileInput');
    const splitFileInput = document.getElementById('splitFileInput');
    const advancedFile = document.getElementById('advancedFile');
    const file1 = document.getElementById('file1');
    const file2 = document.getElementById('file2');

    if (fileInput) fileInput.value = '';
    if (excelFileInput) excelFileInput.value = '';
    if (splitFileInput) splitFileInput.value = '';
    if (advancedFile) advancedFile.value = '';
    if (file1) file1.value = '';
    if (file2) file2.value = '';

    // Очищаем результаты и информацию о файлах
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    const totalSum = document.getElementById('totalSum');
    const splitFileInfo = document.getElementById('splitFileInfo');
    const status = document.getElementById('status');
    const statusTwoFiles = document.getElementById('statusTwoFiles');
    const splitStatus = document.getElementById('splitStatus');

    if (resultsTableBody) resultsTableBody.innerHTML = '';
    if (totalSum) totalSum.textContent = '';
    if (splitFileInfo) splitFileInfo.innerHTML = '';
    if (status) status.textContent = '';
    if (statusTwoFiles) statusTwoFiles.textContent = '';
    if (splitStatus) splitStatus.textContent = '';

    // Скрываем таблицу результатов, если она была видна
    const resultsTable = document.getElementById('resultsTable');
    if (resultsTable) resultsTable.classList.add('hidden');

    // Сброс глобальных переменных
    selectedFiles = [];
    prefixDatabase = {};
    splitFileData = null;
    originalFileName = '';
    currentResult = '';

    // Сброс переменных для отслеживания префиксов
    firstPrefix = null;
    notifiedPrefixes = new Set();

    // Сброс отслеживания партий и флагов
    sessionStorage.setItem('lastPartyNumber', '0');
    sessionStorage.setItem('wasZeroParties', 'true');

    stopAllSounds();
    // Воспроизведение звукового оповещения
    playNotificationSound('clear_all');

    console.log('✅ Все поля и состояния успешно очищены.');
  } catch (error) {
    console.error('Ошибка при очистке полей:', error);

    // При ошибке останавливаем отсчёт и разблокируем кнопку
    clearInterval(countdownInterval);
    isButtonDisabled = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Очистить все поля';
    }
  } finally {
    // Гарантированно разблокируем кнопку и остановим отсчёт через 3 секунды
    setTimeout(() => {
      clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = 'Очистить все поля'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false; // Сбрасываем флаг блокировки
      console.log('Кнопка разблокирована через 3 секунды');
    }, buttonCooldown);
  }

  // Обновление интерфейса
  updateFileList();
}
