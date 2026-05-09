// Функция для загрузки данных из Excel вручную
async function loadProductMapFromExcel() {
    // Очищаем словарь перед загрузкой
    productMap = [];

    const fileInput = document.getElementById('excelFileInput');
    const file = fileInput.files[0];

    if (!file) {
        // Используем резервный словарь
        productMap = [
            { prefix: '0104810178006287', name: 'Берёза квас лайм 1.0' },
            { prefix: '0104810178006188', name: 'Берёза квас лайм 1.5' },
            { prefix: '0104810178006294', name: 'Берёза квас классик 1.0' },
            { prefix: '0104810178007789', name: 'Берёза квас имбирь 1.0' },
            { prefix: '0104810178005921', name: 'Подникольский квас 1.5' },
            { prefix: '0194819008570004', name: 'Берёза квас имбирь 1.5 обычный' }
        ];
        console.log('Используется резервный словарь продуктов');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Получаем все данные листа (включая заголовки)
        const excelData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
        });

        console.log('Сырые данные из Excel:', excelData);

        // Обрабатываем данные, начиная со второй строки (пропускаем заголовки)
        productMap = excelData.slice(1).map(row => {
            // Гарантируем, что берём только первые два столбца
            const prefixCell = row[0];
            const nameCell = row[1];

            // Преобразуем в строку и очищаем от пробелов
            let prefix = '';
            if (prefixCell !== undefined && prefixCell !== null) {
                prefix = String(prefixCell).trim();
            }

            let name = 'Не определено';
            if (nameCell !== undefined && nameCell !== null) {
                name = String(nameCell).trim();
                if (!name) name = 'Не определено';
            }

            return { prefix, name };
        }).filter(item => item.prefix && item.prefix.length > 0);

        console.log('Обработанный словарь productMap:', productMap);
        alert(`Словарь продуктов успешно загружен из файла! Найдено ${productMap.length} записей.`);
    } catch (error) {
        console.error('Ошибка при загрузке Excel-файла:', error);
        alert('Ошибка при загрузке файла. Используется резервный словарь.');
        productMap = [
            { prefix: '0104810178006287', name: 'Берёза квас лайм 1.0' },
            { prefix: '0104810178006188', name: 'Берёза квас лайм 1.5' },
            { prefix: '0104810178006294', name: 'Берёза квас классик 1.0' },
            { prefix: '0104810178007789', name: 'Берёза квас имбирь 1.0' },
            { prefix: '0104810178005921', name: 'Подникольский квас 1.5' },
            { prefix: '0194819008570004', name: 'Берёза квас имбирь 1.5 обычный' }
        ];
    }
}