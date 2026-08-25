// Функция сохранения результатов в Excel для сортировки общего количества товара
function saveToExcel() {
  // Проверяем, заблокирована ли какая‑нибудь кнопка — если да, то не запускать
  if (isButtonDisabled) {
    console.log('Кнопка заблокирована на 3 секунды');
    return;
  }

  const textarea = document.getElementById('dataInput');
  const btn = document.querySelector('button[onclick="saveToExcel()"]');

  try {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    if (!resultsTable.rows.length) {
      alert('Нет результатов для экспорта!');
      return;
    }

    let data = [['Название продукта', 'Количество']]; // Заголовок таблицы

    // Собираем данные из таблицы результатов
    for (let i = 0; i < resultsTable.rows.length; i++) {
      const name = resultsTable.rows[i].cells[0].textContent;
      const count = resultsTable.rows[i].cells[1].textContent.replace(' шт.', '');
      data.push([name, parseInt(count)]);
    }

    // Добавляем строку с общей суммой
    const totalSumElement = document.getElementById('totalSum');
    const totalSumText = totalSumElement.textContent; // Например: «Общая сумма составляет: 25 шт.»
    // Извлекаем число из текста
    const totalSumMatch = totalSumText.match(/\d+/);
    const totalSum = totalSumMatch ? parseInt(totalSumMatch[0]) : 0;

    data.push(['', '']); // Пустая строка для разделения
    data.push(['Общая сумма', `${totalSum} шт.`]);

    // Создаём workbook и лист
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(data);

    // Настраиваем ширину колонок
    sheet['!cols'] = [
      { wch: 30 }, // Ширина колонки «Название продукта» (30 символов)
      { wch: 12 }  // Ширина колонки «Количество» (12 символов)
    ];

    // Добавляем лист в workbook
    XLSX.utils.book_append_sheet(workbook, sheet, 'Результаты');

    // Генерируем и скачиваем файл
    XLSX.writeFile(workbook, 'результаты_проверки.xlsx');

    // Звуковое оповещение
    playNotificationSound('save_excel');

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
      console.error('Кнопка для сохранения в Excel не найдена!');
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

    // Разблокируем кнопку и сбросим флаг через 3 секунды после звукового сигнала
    setTimeout(() => {
      // Гарантированно останавливаем интервал, если он ещё работает
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      // Разблокировка кнопки
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Сохранить в Excel'; // Возвращаем исходный текст кнопки
      }
      isButtonDisabled = false; // Сбрасываем флаг блокировки
      console.log('Кнопка разблокирована через 3 секунды');
    }, buttonCooldown);

  } catch (error) {
    console.error('Ошибка при сохранении в Excel:', error);
    alert('Произошла ошибка при экспорте в Excel. Проверьте данные и попробуйте снова.');
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
