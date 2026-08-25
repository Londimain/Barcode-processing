// Поиск недостающих марок с загрузкой папки
document.addEventListener('DOMContentLoaded', function() {
  const sourceFileInput = document.getElementById('source-file');
  const subtractFolderInput = document.getElementById('subtract-folder');
  window.outputTextarea = document.getElementById('output'); // Делаем доступной глобально
  const processButton = document.getElementById('processBTN');
  const soundCheckbox = document.getElementById('soundNotification');

  if (!sourceFileInput || !subtractFolderInput || !outputTextarea || !processButton) {
    console.error('Не найдены необходимые элементы DOM');
    return;
  }

  outputTextarea.readOnly = true;
  window.sourceFileName = ''; // Глобальная переменная для имени файла

  async function handleFileProcessing() {
    // Проверяем, заблокирована ли какая‑нибудь кнопка — если да, то не запускать
    if (isButtonDisabled) {
      console.log('Кнопка заблокирована на 3 секунды');
      return;
    }

    const btn = processButton;
    const statusDiv = document.getElementById('statusInfo'); // Получаем элемент статуса

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
      if (!sourceFileInput.files[0]) {
        alert('Пожалуйста, загрузите файл источника!');
        throw new Error('Отсутствует файл источника');
      }
      if (subtractFolderInput.files.length === 0) {
        alert('Пожалуйста, выберите папку с вычитаемыми файлами!');
        throw new Error('Отсутствует папка с вычитаемыми файлами');
      }

      // Сбрасываем счётчик перед новой обработкой
      document.getElementById('missing-count').textContent = '0';

      // Сохраняем имя исходного файла
      window.sourceFileName = sourceFileInput.files[0].name;

      // Функция обработки строки: возвращает объект с обрезанной частью и последними 13 символами
      function processLine(line) {
        if (line.length > 39) {
          return {
            processed: line.slice(0, -13),
            removed: line.slice(-13)
          };
        }
        return {
          processed: line,
          removed: null
        };
      }

      // Читаем файл источника
      const sourceReader = new FileReader();
      sourceReader.onload = function(e) {
        const sourceLines = e.target.result.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');

        // Обрабатываем строки источника: получаем и обрезанную часть, и удалённые символы
        const processedSource = sourceLines.map(processLine);

        // Обрабатываем все файлы из папки вычитаемых
        const allSubtractLines = [];
        const promises = [];

        for (const file of subtractFolderInput.files) {
          const fileReader = new FileReader();
          const promise = new Promise((resolve) => {
            fileReader.onload = function(e2) {
              const lines = e2.target.result.split('\n')
                .map(line => line.trim())
                .filter(line => line !== '')
                .map(processLine)
                .map(item => item.processed); // Берём только обработанную часть для сравнения
              allSubtractLines.push(...lines);
              resolve();
            };
            fileReader.readAsText(file);
          });
          promises.push(promise);
        }

        Promise.all(promises).then(() => {
          // Удаляем из источника строки, которые есть в вычитаемых (сравниваем обработанные части)
          const resultLines = processedSource.filter(item =>
            !allSubtractLines.includes(item.processed)
          );

          // Формируем результат для отображения: сливаем обработанную часть и удалённые символы без разделителя
          const displayLines = resultLines.map(item => {
            if (item.removed) {
              return `${item.processed}${item.removed}`;
            }
            return item.processed;
          });

          outputTextarea.value = displayLines.join('\n');

          // Обновляем счётчик найденных недостающих марок
          const countElement = document.getElementById('missing-count');
          countElement.textContent = displayLines.length;

          // Воспроизводим звук поиска (search)
          if (soundCheckbox && soundCheckbox.checked) {
            stopAllSounds();
            playNotificationSound('search_brand');
            console.log('Звуковое оповещение запущено (чекбокс отмечен)');
          } else {
            console.log('Звуковое оповещение пропущено (чекбокс не отмечен)');
          }
        });
      };

      sourceReader.readAsText(sourceFileInput.files[0]);

    } catch (error) {
      console.error('Ошибка при обработке файлов:', error);
      alert('Произошла ошибка при обработке файлов. Проверьте данные и попробуйте снова.');

      // При ошибке останавливаем отсчёт и разблокируем кнопку
      clearInterval(countdownInterval);
      isButtonDisabled = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Поиск марок';
      }
    } finally {
      // Гарантированно разблокируем кнопку и остановим отсчёт через 3 секунды
      setTimeout(() => {
        clearInterval(countdownInterval); // Останавливаем отсчёт, если он ещё идёт
        if (btn && btn.disabled) {
          btn.disabled = false;
          btn.textContent = 'Поиск марок'; // Возвращаем исходный текст кнопки
        }
        isButtonDisabled = false;
        console.log('Кнопка разблокирована через 3 секунды');

        // Очистка статуса через 3 секунды (если элемент существует)
        if (statusDiv) {
          statusDiv.textContent = '';
        }
      }, 3000); // Таймер на 3000 мс (3 секунды)
    }
  }

  processButton.addEventListener('click', handleFileProcessing);
});
