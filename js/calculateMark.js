// Формирование и расчёт диапазона GTIN
// Глобальные переменные для блокировки кнопки формирования
let isgeneratebtnDisabled = false;
const generatebtnCooldown = 3000; // 3 секунды в миллисекундах
let generatebtnCountdownInterval = null;

// Переменные для элементов DOM
const startMarkInput = document.getElementById('start-mark');
const endMarkInput = document.getElementById('end-mark');
const resultInput = document.getElementById('result');
const markFileInput = document.getElementById('mark-file');
const generatebtnButton = document.getElementById('generate-btn');

// Функция блокировки кнопки с отсчётом времени
function disableGenerateButton() {
  if (!generatebtnButton) return;

  // Останавливаем предыдущий интервал, если он запущен
  if (generatebtnCountdownInterval) {
    clearInterval(generatebtnCountdownInterval);
  }

  isgeneratebtnDisabled = true;
  generatebtnButton.disabled = true;

  let countdown = 3;
  // Начальное отображение: «Формирование... 3 с»
  generatebtnButton.textContent = `Формирование... ${countdown} с`;

  generatebtnCountdownInterval = setInterval(() => {
    countdown--;

    if (countdown >= 0 && generatebtnButton) {
      // Обновляем текст кнопки с текущим значением отсчёта
      generatebtnButton.textContent = `Формирование... ${countdown} с`;
    }

    // Когда отсчёт дошёл до 0, останавливаем интервал и разблокируем кнопку
    if (countdown === 0) {
      clearInterval(generatebtnCountdownInterval);
      isgeneratebtnDisabled = false;
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
    }
  }, 1000); // Обновляем каждую секунду (1000 мс)
}

// Функция извлечения числовой части из марки (любого префикса + 6 цифр в конце)
function extractNumberFromMark(mark) {
  const match = mark.match(/([A-Z0-9]+)(\d{6})$/);
  if (!match) return null;

  const prefix = match[1]; // префикс (QAA1080, IAA2212 и т. д.)
  const numberPart = parseInt(match[2], 10); // числовая часть (последние 6 цифр)

  return { prefix, number: numberPart };
}

// Проверка соответствия префиксов
function haveSamePrefix(startMark, endMark) {
  const startData = extractNumberFromMark(startMark);
  const endData = extractNumberFromMark(endMark);

  if (!startData || !endData) return false;

  return startData.prefix === endData.prefix;
}

// Расчёт разницы между марками
function calculateMarkRange() {
  const startMark = startMarkInput.value.trim();
  const endMark = endMarkInput.value.trim();

  if (!startMark || !endMark) {
    resultInput.value = '0';
    return;
  }

  // Проверяем, что префиксы совпадают
  if (!haveSamePrefix(startMark, endMark)) {
    resultInput.value = 'Ошибка: префиксы не совпадают';
    return;
  }

  const startNum = extractNumberFromMark(startMark).number;
  const endNum = extractNumberFromMark(endMark).number;

  resultInput.value = Math.max(0, endNum - startNum + 1);
}

// Основная функция обработки генерации с блокировкой кнопки
async function handleGenerate() {
  // Проверка существования кнопки
  if (!generatebtnButton) {
    console.error('Кнопка generate-btn не найдена');
    return;
  }

  // Проверяем, заблокирована ли кнопка — если да, то не запускать
  if (isgeneratebtnDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  // Валидация входных данных
  const startMark = startMarkInput.value.trim();
  const endMark = endMarkInput.value.trim();

  if (!startMark || !endMark) {
    alert('Пожалуйста, введите начальную и конечную марки');
    return;
  }

  if (startMark.length !== 12 || endMark.length !== 12) {
    alert('Номер марки должен содержать ровно 12 символов');
    return;
  }

  // Получаем файл
  const file = markFileInput.files[0];
  if (!file) {
    alert('Пожалуйста, загрузите файл');
    return;
  }

  // Блокируем кнопку перед началом обработки
  disableGenerateButton();

  try {
    // Читаем содержимое файла
    const text = await file.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Извлекаем данные начальной и конечной марок
    const startData = extractNumberFromMark(startMark);
    const endData = extractNumberFromMark(endMark);

    // Проверяем корректность ввода
    if (!startData || !endData) {
      alert('Ошибка: начальная или конечная марка имеют некорректный формат');
      // Разблокируем кнопку при ошибке
      clearInterval(generatebtnCountdownInterval);
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
      isgeneratebtnDisabled = false;
      return;
    }

    // Проверяем совпадение префиксов
    if (startData.prefix !== endData.prefix) {
      alert('Ошибка: префиксы начальной и конечной марки не совпадают');
      // Разблокируем кнопку при ошибке
      clearInterval(generatebtnCountdownInterval);
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
      isgeneratebtnDisabled = false;
      return;
    }

    const startNum = startData.number;
    const endNum = endData.number;
    const prefix = startData.prefix;

    // Фильтруем строки: оставляем только те, где префикс совпадает и числовая часть в диапазоне
    const filteredLines = lines.filter(line => {
      const lineData = extractNumberFromMark(line);
      if (!lineData) return false; // пропускаем некорректные строки
      return lineData.prefix === prefix && lineData.number >= startNum && lineData.number <= endNum;
    });

    // Сортируем по возрастанию числовой части
    filteredLines.sort((a, b) => {
      const aNum = extractNumberFromMark(a).number;
      const bNum = extractNumberFromMark(b).number;
      return aNum - bNum;
    });

    // Если нет подходящих строк
    if (filteredLines.length === 0) {
      alert('Не найдено строк в указанном диапазоне');
      // Разблокируем кнопку
      clearInterval(generatebtnCountdownInterval);
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
      isgeneratebtnDisabled = false;
      return;
    }

    // Формируем новое имя файла
    let newFileName = file.name;
    const match = newFileName.match(/(.*)\s*\(\d+\)\.txt$/);
    if (match) {
      newFileName = `${match[1]} (${filteredLines.length}).txt`;
    } else {
      newFileName = newFileName.replace(/\.txt$/i, ` (${filteredLines.length}).txt`);
    }

    // Создаём новый файл и инициируем скачивание
    const fileContent = filteredLines.join('\n') + '\n';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

        // Воспроизводим звук формирования (используем внешнюю функцию из sound.js)
    playNotificationSound('forming');


    alert(`Файл сохранён как: ${newFileName}\nОбработано строк: ${filteredLines.length}`);
  } catch (error) {
    console.error('Ошибка при обработке файла:', error);
    alert('Произошла ошибка при обработке файла');

    // При ошибке разблокируем кнопку
    if (generatebtnButton) {
      clearInterval(generatebtnCountdownInterval);
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
      isgeneratebtnDisabled = false;
    }
  }

  // Гарантированная разблокировка кнопки через 3 секунды после завершения обработки
  setTimeout(() => {
    if (generatebtnButton && isgeneratebtnDisabled) {
      clearInterval(generatebtnCountdownInterval);
      generatebtnButton.disabled = false;
      generatebtnButton.textContent = 'Формировать';
      isgeneratebtnDisabled = false;
    }
  }, generatebtnCooldown);
}

// Слушатели событий
startMarkInput.addEventListener('input', calculateMarkRange);
endMarkInput.addEventListener('input', calculateMarkRange);
generatebtnButton.addEventListener('click', handleGenerate);

// Инициализация: проверяем, что все элементы найдены
document.addEventListener('DOMContentLoaded', function() {
  if (!startMarkInput) console.error('Элемент start-mark не найден');
  if (!endMarkInput) console.error('Элемент end-mark не найден');
  if (!resultInput) console.error('Элемент result не найден');
  if (!markFileInput) console.error('Элемент mark-file не найден');
  if (!generatebtnButton) console.error('Кнопка generate-btn не найдена');
});