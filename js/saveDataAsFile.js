// Функция для сохранения результата
function saveDataAsFile() {
  // Получаем элементы регионов
  const regionRB = document.getElementById('regionRB');
  const regionRF = document.getElementById('regionRF');

  // Определяем суффикс региона (только если выбран какой‑то регион)
  let regionSuffix = '';
  if (regionRB.checked) {
    regionSuffix = ' РБ';
  } else if (regionRF.checked) {
    regionSuffix = ' РФ';
  }

  let data = textarea.value;

  if (!data) {
    alert('Поле для сохранения пустое!');
    return;
  }

  // Получаем название продукта из соответствующего поля
  const productName = productNameField.value.trim();

  // Проверяем, заполнено ли поле названия продукта
  if (!productName || productName === 'Не определено') {
    alert('Не удалось определить название продукта. Проверьте данные в поле "Название продукта"');
    return;
  }

  // Разделяем на строки, удаляем пустые и строки с пробелами
  const lines = data.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  const totalLines = nonEmptyLines.length;

  if (totalLines === 0) {
    alert('Нет данных для сохранения — все строки пустые!');
    return;
  }

  // Обрабатываем каждую строку: вставляем символ  после 31‑го символа только если его там ещё нет
  const processedLines = nonEmptyLines.map(line => {
    // Пропускаем обработку, если строка короче 31 символа
    if (line.length <= 31) {
      return line;
    }

    // Проверяем, есть ли уже  на 32‑й позиции (индекс 31)
    if (line[31] === '') {
      // Если символ уже есть, возвращаем строку без изменений
      return line;
    }

    // Вставляем  после 31‑го символа
    return line.slice(0, 31) + '' + line.slice(31);
  });

  // Собираем строки обратно с CRLF
  data = processedLines.join('\r\n') + '\r\n';

  // Преобразуем строку в Uint8Array для гарантированной корректной кодировки
  const uint8Array = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    uint8Array[i] = data.charCodeAt(i);
  }

  // Создаём Blob с данными, явно указывая кодировку
  const blob = new Blob([uint8Array], { type: 'text/plain;charset=utf-8' });

  // Формируем имя файла: "Название (количество) Регион.txt" (регион добавится только если выбран)
  const fileName = `${productName} (${totalLines})${regionSuffix}.txt`;

  // Создаём ссылку для скачивания
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Добавляем ссылку в документ, имитируем клик и удаляем ссылку
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Звуковое оповещение
  playNotificationSound('save');

  // Освобождаем память
  URL.revokeObjectURL(link.href);
}