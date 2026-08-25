// Поиск недостающих марок с загрузкой папок и для источника, и для вычитаемых
document.addEventListener('DOMContentLoaded', function() {
  const sourceFileInput = document.getElementById('source-file');
  const subtractFolderInput = document.getElementById('subtract-folder');
  window.outputTextarea = document.getElementById('output');
  const processButton = document.getElementById('processBTN');
  const soundCheckbox = document.getElementById('soundNotification');

  if (!sourceFileInput || !subtractFolderInput || !outputTextarea || !processButton) {
    console.error('Не найдены необходимые элементы DOM');
    return;
  }

  outputTextarea.readOnly = true;
  window.sourceFileName = ''; // можно хранить имя первого файла или список файлов

  // Глобальная переменная блокировки кнопок (если она используется в других местах)
  let isButtonDisabled = false;

  function disableButtons(ms) {
    isButtonDisabled = true;
    setTimeout(() => {
      isButtonDisabled = false;
    }, ms);
  }

  async function handleFileProcessing() {
    if (isButtonDisabled) {
      console.log('Кнопка заблокирована на 3 секунды');
      return;
    }

    const btn = processButton;
    const statusDiv = document.getElementById('statusInfo');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Подождите... 3 с';
    }

    disableButtons(3000);

    let countdown = 3;
    let countdownInterval;

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown >= 0 && btn) {
        btn.textContent = `Подождите... ${countdown} с`;
      }
      if (countdown === 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    try {
      const sourceFiles = Array.from(sourceFileInput.files);
      const subtractFiles = Array.from(subtractFolderInput.files);

      if (sourceFiles.length === 0) {
        alert('Пожалуйста, загрузите папку с исходными TXT-файлами!');
        throw new Error('Отсутствует источник (папка с файлами)');
      }
      if (subtractFiles.length === 0) {
        alert('Пожалуйста, выберите папку с вычитаемыми файлами!');
        throw new Error('Отсутствует папка с вычитаемыми файлами');
      }

      document.getElementById('missing-count').textContent = '0';
      window.sourceFileName = sourceFiles.map(f => f.name).join(', ');

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

      // Читаем все исходные файлы и собираем строки
      const allSourceLines = [];
      const sourcePromises = sourceFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function(e) {
            const lines = e.target.result.split('\n')
              .map(line => line.trim())
              .filter(line => line !== '')
              .map(processLine);
            allSourceLines.push(...lines);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      });

      // Читаем все вычитаемые файлы и собираем обработанные строки (только processed)
      const allSubtractLines = [];
      const subtractPromises = subtractFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function(e) {
            const lines = e.target.result.split('\n')
              .map(line => line.trim())
              .filter(line => line !== '')
              .map(processLine)
              .map(item => item.processed);
            allSubtractLines.push(...lines);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      });

      await Promise.all([...sourcePromises, ...subtractPromises]);

      // Фильтруем: оставляем строки из источника, которых нет в вычитаемых (по processed части)
      const resultLines = allSourceLines.filter(item =>
        !allSubtractLines.includes(item.processed)
      );

      const displayLines = resultLines.map(item => {
        if (item.removed) {
          return `${item.processed}${item.removed}`;
        }
        return item.processed;
      });

      outputTextarea.value = displayLines.join('\n');

      const countElement = document.getElementById('missing-count');
      countElement.textContent = displayLines.length;

      if (soundCheckbox && soundCheckbox.checked) {
        stopAllSounds();
        playNotificationSound('search_brand');
        console.log('Звуковое оповещение запущено (чекбокс отмечен)');
      } else {
        console.log('Звуковое оповещение пропущено (чекбокс не отмечен)');
      }
    } catch (error) {
      console.error('Ошибка при обработке файлов:', error);
      alert('Произошла ошибка при обработке файлов. Проверьте данные и попробуйте снова.');
    } finally {
      clearInterval(countdownInterval);
      setTimeout(() => {
        const btn = processButton;
        isButtonDisabled = false;
        if (btn && btn.disabled) {
          btn.disabled = false;
          btn.textContent = 'Поиск марок';
        }
        const statusDiv = document.getElementById('statusInfo');
        if (statusDiv) {
          statusDiv.textContent = '';
        }
        console.log('Кнопка разблокирована через 3 секунды');
      }, 3000);
    }
  }

  processButton.addEventListener('click', handleFileProcessing);
});
