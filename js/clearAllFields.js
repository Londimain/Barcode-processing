// Функция для очистки всех полей ввода и сброс состояния
function clearAllFields() {
    // Очищаем левое текстовое поле
    textarea.value = '';
    // Очищаем все правые поля ввода
    sumLinesField.value = '';
    sumCalculationField.value = '';
    productNameField.value = '';
    packagesCountField.value = '';
    bottlesPerPackageField.value = '';
    document.getElementById('unitsPerBatch').value = '120'; // Сброс до значения по умолчанию

    // ГАРАНТИРОВАННЫЙ СБРОС отслеживания партий и флагов
    sessionStorage.removeItem('lastPartyNumber');
    sessionStorage.removeItem('wasZeroParties');
    sessionStorage.setItem('lastPartyNumber', '0');
    sessionStorage.setItem('wasZeroParties', 'true'); // Явно указываем, что было нулевое состояние

    // Звуковое оповещение
    playNotificationSound('clear_all');

    console.log('✅ Отслеживание партий полностью сброшено. Следующие партии будут оповещаться с №1.');
}