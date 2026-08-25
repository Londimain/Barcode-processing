// Функция расчёта и отображения количества упакованного товара на основе содержимого textarea
function updatePackedQuantity() {
    // Получаем содержимое textarea и разбиваем на строки
    const textareaValue = textarea.value.trim();
    const lines = textareaValue ? textareaValue.split('\n') : [];

    // Удаляем пустые строки и считаем уникальные непустые строки
    const uniqueLines = new Set();
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            uniqueLines.add(trimmedLine);
        }
    });
    const totalLines = uniqueLines.size;

    // Получаем количество товара в упаковке
    const bottlesPerPackage = parseFloat(bottlesPerPackageField.value) || 0;

    let resultText = '';

    if (totalLines === 0 || bottlesPerPackage === 0) {
        resultText = 'Собрано: нет; Набрано: нет';
    } else {
        const packedPackages = Math.floor(totalLines / bottlesPerPackage);
        const remainingItems = totalLines % bottlesPerPackage;

        let collectedText = 'нет';
        let typedText = 'нет';

        if (packedPackages > 0) {
            collectedText = `${packedPackages} уп.`;
        }

        if (remainingItems > 0) {
            typedText = `${remainingItems} ед.`;
        }

        resultText = `Собрано: ${collectedText}; Набрано: ${typedText}`;
    }

    // Обновляем поле sumPack
    sumPackField.value = resultText;
}
