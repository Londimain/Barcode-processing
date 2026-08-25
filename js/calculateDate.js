// Калькулятор дней
function calculateDate() {
    const startDateInput = document.getElementById('start-date');
    const add360 = document.getElementById('add-360');
    const add180 = document.getElementById('add-180');
    const add150 = document.getElementById('add-150'); // Новый чекбокс

    // Ищем кнопку по атрибуту onclick
    const calculateButton = document.querySelector('button[onclick="calculateDate()"]');

    if (!calculateButton) {
        console.error('Кнопка "Рассчитать" не найдена');
        return;
    }

    if (!startDateInput.value) {
        alert('Пожалуйста, выберите начальную дату');
        return;
    }

    // Проверяем, что выбран только один вариант
    const checkedCount = (add360.checked ? 1 : 0) +
                        (add180.checked ? 1 : 0) +
                        (add150.checked ? 1 : 0);

    if (checkedCount > 1) {
        if (add360.checked) add360.checked = false;
        if (add180.checked) add180.checked = false;
        if (add150.checked) add150.checked = false;
        alert('Можно выбрать только один вариант: 360, 180 или 150 дней');
        return;
    }

    const startDate = new Date(startDateInput.value);
    let resultDate;

    if (add360.checked) {
        resultDate = new Date(startDate);
        resultDate.setDate(resultDate.getDate() + 360);
    } else if (add180.checked) {
        resultDate = new Date(startDate);
        resultDate.setDate(resultDate.getDate() + 180);
    } else if (add150.checked) {
        resultDate = new Date(startDate);
        resultDate.setDate(resultDate.getDate() + 150);
    } else {
        alert('Пожалуйста, выберите срок годности');
        return;
    }

    // Блокируем кнопку и запускаем отсчёт
    disableCalculateButton(calculateButton);

    // Форматируем дату в читаемый вид
    const day = resultDate.getDate().toString().padStart(2, '0');
    const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
    const year = resultDate.getFullYear();
    const formattedDate = `${day}.${month}.${year} срока годности`;

    document.getElementById('resultDays').innerHTML = `
        <strong>Конечная дата:</strong> ${formattedDate}
    `;

    // Воспроизводим звук расчёта даты
    if (soundCheckbox && soundCheckbox.checked) {
        stopAllSounds();
        playNotificationSound('expiration_Date');
        console.log('Звуковое оповещение запущено (чекбокс отмечен)');
    } else {
        console.log('Звуковое оповещение пропущено (чекбокс не отмечен)');
    }
}

function disableCalculateButton(button) {
    if (!button) return;

    let countdown = 3;
    button.disabled = true;
    button.textContent = `Рассчитываю... ${countdown} с`;

    let countdownInterval = setInterval(() => {
        countdown--;

        if (countdown >= 0) {
            button.textContent = `Рассчитываю... ${countdown} с`;
        }

        if (countdown === 0) {
            clearInterval(countdownInterval);
            button.disabled = false;
            button.textContent = 'Рассчитать';
        }
    }, 1000); // Обновляем каждую секунду
}

// Обработчик для снятия выбора при выборе другого чекбокса
document.querySelectorAll('input[name="days"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        document.querySelectorAll('input[name="days"]').forEach(otherCheckbox => {
            if (otherCheckbox !== this) {
                otherCheckbox.checked = false;
            }
        });
    });
});
