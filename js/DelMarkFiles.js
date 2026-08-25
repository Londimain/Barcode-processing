// Удаление марок с файла
const fileInput = document.getElementById('fileInput');
      const statusEl = document.getElementById('status');

      fileInput.addEventListener('change', async () => {
        statusEl.textContent = 'Обработка...';
        const file = fileInput.files[0];
        if (!file) {
          statusEl.textContent = '';
          return;
        }

        try {
          const text = await file.text();
          const lines = text.split(/\r?\n/);
          const newLines = lines.map(line => {
            return line.length > 13 ? line.slice(0, -13) : line;
          });
          const processedContent = newLines.join('\n');

          // Формируем имя файла: исходное имя + "-NoMark" перед расширением
          let newFileName = file.name;
          const dotIndex = newFileName.lastIndexOf('.');
          if (dotIndex > 0) {
            newFileName = newFileName.slice(0, dotIndex) + '-NoMark' + newFileName.slice(dotIndex);
          } else {
            newFileName += '-NoMark';
          }

          const blob = new Blob([processedContent], { type: file.type || 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = newFileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          statusEl.textContent = `Файл "${newFileName}" успешно сохранён!`;
        } catch (err) {
          statusEl.textContent = 'Ошибка при обработке файла: ' + err.message;
        }
      });