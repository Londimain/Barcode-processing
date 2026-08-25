// Функции для поиска кодов по базе данных
let loadedFiles = [];
let searchResults = [];

// Функция для вставки переносов каждые N символов
function insertLineBreaks(text, maxChars = 65) {
  if (!text) return text;

  const lines = [];
  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.substring(i, i + maxChars));
  }
  return lines.join('<br>');
}

document.getElementById('fileInput').addEventListener('change', function(e) {
  const files = e.target.files;
  loadedFiles = Array.from(files);
  updateStatus();
  // Если уже есть поисковый запрос, выполняем поиск сразу после загрузки файлов
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm) {
    performSearch();
  }
});

function updateStatus() {
  document.getElementById('statusInfo').textContent =
    `Найдено совпадений: ${searchResults.length}`;
}

// --- НАЧАЛО ИЗМЕНЕНИЙ: БЛОКИРОВКА ВВОДА ПОСЛЕ 38 СИМВОЛОВ ---
const MAX_INPUT_LENGTH = 38;
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', function(e) {
  if (this.value.length >= MAX_INPUT_LENGTH) {
    const isAllowedKey = [
      'Backspace', 'Delete',
      'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'
    ].includes(e.key) ||
    (e.ctrlKey && ['a', 'c', 'x'].includes(e.key.toLowerCase())) ||
    e.metaKey;

    if (!isAllowedKey) {
      e.preventDefault();
    }
  }
});

searchInput.addEventListener('input', function() {
  if (this.value.length > MAX_INPUT_LENGTH) {
    this.value = this.value.slice(0, MAX_INPUT_LENGTH);
    this.setSelectionRange(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH);
  }
});

searchInput.setAttribute('maxlength', MAX_INPUT_LENGTH);
// --- КОНЕЦ ИЗМЕНЕНИЙ ---

async function performSearch() {
  const searchTerm = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');

  // Очищаем результаты, если строка поиска пустая
  if (!searchTerm) {
    resultsDiv.textContent = 'Введите строку для поиска';
    searchResults = [];
    updateStatus();
    return;
  }

  if (loadedFiles.length === 0) {
    resultsDiv.textContent = 'Сначала загрузите базу данных';
    return;
  }

  resultsDiv.textContent = 'Поиск...';
  searchResults = [];

  for (const file of loadedFiles) {
    try {
      const content = await file.text();
      if (content.includes(searchTerm)) {
        // Получаем полный путь
        const fullPath = file.webkitRelativePath || file.name;
        searchResults.push(fullPath);
      }
    } catch (error) {
      console.error(`Ошибка при чтении файла ${file.name}:`, error);
    }
  }

  if (searchResults.length > 0) {
    // Применяем перенос каждые 65 символов к каждому результату
    const formattedResults = searchResults.map(result =>
      insertLineBreaks(result, 65)
    );
    resultsDiv.innerHTML = formattedResults.join('<br><hr>');
  } else {
    resultsDiv.textContent = 'Совпадений не найдено';
  }

  updateStatus();
}