// Сортировка GTIN приёмки с БСО
(function() {
  'use strict';

  let processCodesButton = null;
  let processCodesCountdownInterval = null;
  let isProcessCodesDisabled = false;
  const processCodesCooldown = 3000;

  console.log('[Init] Ожидаю загрузки DOM...');

  document.addEventListener('DOMContentLoaded', () => {
    console.log('[DOM] DOM загружен.');
    processCodesButton = document.getElementById('processCodesBtn');

    if (!processCodesButton) {
      console.error('[Error] Кнопка с id="processCodesBtn" НЕ найдена в DOM!');
      return;
    }

    console.log('[OK] Кнопка найдена:', processCodesButton);
    processCodesButton.addEventListener('click', processCodes);
  });

  function processCodes() {
    console.log('[Click] Кнопка нажата.');

    const statusDiv = document.getElementById('status');
    const resultsDiv = document.getElementById('results');
    const outputTextarea = document.getElementById('sorting-output');
    const groupsCountSpan = document.getElementById('groups-count');

    // Проверка кнопки
    if (!processCodesButton) {
      console.error('[Error] processCodesButton не инициализирована.');
      showStatus('Кнопка обработки не найдена', 'error');
      return;
    }

    if (isProcessCodesDisabled) {
      console.log('[Skip] Кнопка уже заблокирована.');
      return;
    }

    // Сброс интерфейса
    if (statusDiv) {
      statusDiv.style.display = 'none';
      statusDiv.className = '';
    }
    if (resultsDiv) resultsDiv.textContent = '';
    if (outputTextarea) outputTextarea.value = '';
    if (groupsCountSpan) groupsCountSpan.textContent = '0';

    const fileInputSingle = document.getElementById('fileInputSingle');
    const fileInputDir = document.getElementById('fileInputDir');

    console.log('[Files] Проверка инпутов:', fileInputSingle, fileInputDir);

    const allFiles = [];
    if (fileInputSingle && fileInputSingle.files.length > 0) {
      for (let i = 0; i < fileInputSingle.files.length; i++) {
        allFiles.push(fileInputSingle.files[i]);
      }
    }
    if (fileInputDir && fileInputDir.files.length > 0) {
      for (let i = 0; i < fileInputDir.files.length; i++) {
        allFiles.push(fileInputDir.files[i]);
      }
    }

    console.log('[Files] Всего файлов для обработки:', allFiles.length);

    if (allFiles.length === 0) {
      showStatus('Пожалуйста, выберите файл (.txt) или папку с TXT-файлами', 'error');
      return;
    }

    disableProcessCodesButton();

    let processedFilesCount = 0;
    const allCodes = [];

    allFiles.forEach((file, index) => {
      const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
      if (!isTxt) {
        console.warn('[Warn] Пропущен файл (не TXT):', file.name);
        processedFilesCount++;
        if (processedFilesCount === allFiles.length && allCodes.length === 0) {
          showStatus('Не найдено подходящих TXT-файлов для обработки', 'error');
          unlockProcessCodesButton();
        }
        return;
      }

      console.log(`[Read] Читаем файл ${index + 1}:`, file.name);

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const codes = e.target.result
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
          allCodes.push(...codes);
          console.log(`[Read OK] Файл ${file.name}: прочитано строк ${codes.length}`);
        } catch (err) {
          console.error('[Read Error] Ошибка разбора файла:', file.name, err);
          showStatus(`Ошибка при обработке файла: ${file.name}`, 'error');
        } finally {
          processedFilesCount++;
          checkAllFilesProcessed();
        }
      };
      reader.onerror = function() {
        console.error('[Read Error] Ошибка чтения файла:', file.name);
        showStatus(`Ошибка чтения файла: ${file.name}`, 'error');
        processedFilesCount++;
        checkAllFilesProcessed();
      };
      reader.readAsText(file, 'utf-8');
    });

    function checkAllFilesProcessed() {
      if (processedFilesCount !== allFiles.length) return;

      console.log('[Process] Все файлы прочитаны. Всего строк:', allCodes.length);

      if (allCodes.length === 0) {
        showStatus('Файлы прочитаны, но не найдено ни одной строки с кодом', 'error');
        unlockProcessCodesButton();
        return;
      }

      processCodeList(allCodes, statusDiv, resultsDiv, outputTextarea, groupsCountSpan);
      // Не разблокируем кнопку здесь: она разблокируется по таймеру в disableProcessCodesButton
    }
  }

  function disableProcessCodesButton() {
    if (!processCodesButton) return;
    clearInterval(processCodesCountdownInterval);
    processCodesCountdownInterval = null;

    isProcessCodesDisabled = true;
    processCodesButton.disabled = true;

    let countdown = 3;
    processCodesButton.textContent = `Обработка... ${countdown} с`;

    console.log('[Timer] Таймер запущен:', countdown);

    processCodesCountdownInterval = setInterval(() => {
      countdown--;
      if (countdown >= 0 && processCodesButton) {
        processCodesButton.textContent = `Обработка... ${countdown} с`;
      }
      if (countdown === 0) {
        clearInterval(processCodesCountdownInterval);
        processCodesCountdownInterval = null;
        isProcessCodesDisabled = false;
        processCodesButton.disabled = false;
        processCodesButton.textContent = 'Обработать коды';
        console.log('[Timer] Таймер завершён, кнопка разблокирована.');
      }
    }, 1000);
  }

  function unlockProcessCodesButton() {
    if (!processCodesButton) return;
    clearInterval(processCodesCountdownInterval);
    processCodesCountdownInterval = null;
    isProcessCodesDisabled = false;
    processCodesButton.disabled = false;
    processCodesButton.textContent = 'Обработать коды';
  }

  function processCodeList(codes, statusDiv, resultsDiv, outputTextarea, groupsCountSpan) {
    console.log('[Grouping] Начинаем группировку строк...');
    const groups = {};

    codes.forEach(code => {
      if (code.length >= 16) {
        const key = code.substring(2, 16);
        if (!groups[key]) groups[key] = [];
        groups[key].push(code);
      }
    });

    let output = '';
    for (const key in groups) {
      output += `${key}=${groups[key].length} шт.\n`;
    }
    if (outputTextarea) outputTextarea.value = output;
    if (groupsCountSpan) groupsCountSpan.textContent = Object.keys(groups).length;

    for (const key in groups) {
      groups[key].sort((a, b) => {
        const numStrA = a.slice(-13);
        const numStrB = b.slice(-13);
        const numA = parseInt(numStrA, 10);
        const numB = parseInt(numStrB, 10);

        if (isNaN(numA) || isNaN(numB)) {
          return numStrA.localeCompare(numStrB);
        }
        return numA - numB;
      });

      const filename = `${key} (${groups[key].length}).txt`;
      createDownloadLink(filename, groups[key]);
    }

    if (typeof soundCheckbox !== 'undefined' && soundCheckbox && soundCheckbox.checked) {
      if (typeof stopAllSounds === 'function') stopAllSounds();
      if (typeof playNotificationSound === 'function') playNotificationSound('processing_Code');
    }

    console.log('[Done] Обработка завершена.');
  }

  function createDownloadLink(filename, content) {
    try {
      const blob = new Blob([content.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      showStatus('Ошибка при подготовке файла для скачивания', 'error');
    }
  }

  function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    if (type === 'error') {
      alert(message);
    } else if (statusDiv) {
      statusDiv.style.display = 'none';
    }
  }
})();
