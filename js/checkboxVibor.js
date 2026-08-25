// Функция для чекбоксов в начальной и конечной дате срока годности (один выбранный чекбокс + мгновенный пересчёт)
function formatDateForFilename(dateObj) {
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = String(dateObj.getFullYear()).slice(-2).padStart(2, '0');
  return `${d}.${m}.${y}`;
}

// Функция расчёта даты
function recalcExpiryDate() {
  const inDateInput = document.getElementById('in-date');
  const resultEl = document.getElementById('resultDaysSrok');
  
  if (!resultEl) return;

  const c360 = document.getElementById('in-360');
  const c180 = document.getElementById('in-180');
  const c150 = document.getElementById('in-150');

  const checkboxes = [c360, c180, c150].filter(Boolean);

  // Находим, какой сейчас отмечен (после того как click-обработчик уже почистил остальные)
  const selected = checkboxes.find(cb => cb.checked);

  // Если ничего не выбрано
  if (!selected) {
    resultEl.textContent = 'Конечная дата срока годности';
    resultEl.dataset.endDate = '';
    return;
  }

  // Если дата не выбрана
  if (!inDateInput || !inDateInput.value) {
    resultEl.textContent = 'Укажите дату розлива';
    resultEl.dataset.endDate = '';
    return;
  }

  // Расчёт
  const startDate = new Date(inDateInput.value);
  const daysToAdd = Number(selected.value);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysToAdd);

  const formattedEnd = formatDateForFilename(endDate);
  resultEl.textContent = `Конечная дата срока годности: ${formattedEnd}`;
  resultEl.dataset.endDate = formattedEnd;
}

document.addEventListener('DOMContentLoaded', () => {
  const inDateInput = document.getElementById('in-date');
  
  // 1. Слушаем изменение даты
  if (inDateInput) {
    inDateInput.addEventListener('change', recalcExpiryDate);
  }

  // 2. ГЛАВНОЕ: Слушаем клик по чекбоксам
  document.querySelectorAll('input[name="days"]').forEach(cb => {
    cb.addEventListener('click', (event) => {
      const target = event.target; // Тот, по которому кликнули
      
      // Снимаем галочки со ВСЕХ чекбоксов этой группы
      document.querySelectorAll('input[name="days"]').forEach(other => {
        if (other !== target) {
          other.checked = false;
        }
      });

      // После принудительной очистки запускаем расчёт
      recalcExpiryDate();
    });
  });
});

