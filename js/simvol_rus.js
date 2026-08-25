/**
 * Проверяет, появились ли новые русские символы в каких‑либо строках
 * @param {string} currentText — текущее содержимое textarea
 * @returns {boolean} — true, если в какой‑либо строке впервые появились русские символы
 */
function hasNewRussianCharactersInLines(currentText) {
    const currentLines = currentText.split('\n');
    let hasNew = false;

    // Обновляем состояние для всех строк
    for (let i = 0; i < currentLines.length; i++) {
        const line = currentLines[i];
        const hasRussian = /[а-яёА-ЯЁ]/.test(line);

        // Получаем предыдущее состояние для этой строки
        const prevState = lineStates.get(i) || { hasRussian: false };

        // Если в строке появились русские символы, которых раньше не было
        if (hasRussian && !prevState.hasRussian) {
            hasNew = true;
            // Обновляем состояние
            lineStates.set(i, { hasRussian: true });
        }

        // Если строка очищена от русских символов — сбрасываем флаг
        if (!hasRussian && prevState.hasRussian) {
            lineStates.set(i, { hasRussian: false });
        }
    }

    return hasNew;
}
