// Функции описания инструкций
// Ввод данных
function DataEntry() {
const instructions = document.getElementById('instructions');
const text =
    '1. Перевести раскладку клавиатуры на ENG\n' +
    '2. Указать количество в одной партии\n' +
    '3. Указать количество товара в упаковке\n' +
    '4. Включить звуковое оповещение\n' +
    '5. Выбрать страну для реализации товара\n' +
    '6. Выбрать начальную дату розлива и указать срок годности\n' +
    '7. Установить курсор в поле данных\n' +
    '8. Начать сканирование штрихкодов\n' +
    '9. По завершении — сохранить\n' +
    '10. Для нового ввода — очистить данные';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Поиск кодов
function search() {
const instructions = document.getElementById('instructions');
const text =
    '1. Загрузить словарь продуктов\n' +
    '2. Выгрузить каталог базы данных\n' +
    '3. Ввести в поле поиска полный штрихкод товара\n' +
    '3. В результате поиска отобразится количество найденных совпадений, а также путь к найденным файлам';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Сортировка
function Sorting() {
const instructions = document.getElementById('instructions');
const text =
    '1. Загрузить словарь продуктов\n' +
    '2. Выгрузить каталог базы данных\n' +
    '3. Просчитать\n' +
    '4. Сохранить в Excel';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Разделение файла
function Splitting() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл для обработки\n' +
    '2. В поле отобразится количество строк в файле\n' +
    '3. Выставить нужное количество кодов в одном файле\n' +
    '4. Разделить файлы\n' +
    '5. Коды разделятся на файлы и сохранятся';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Обработка файла
function Processing() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл для обработки\n' +
    '2. Файл автоматически обработается и сохранится';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Обработка файлов
function ProcessingFULL() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл со всеми кодами\n' +
    '2. Загрузить файл с кодами для вычитания\n' +
    '3. Обработать данные\n' +
    '4. Сохранить результат';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Поиск недостающих марок
function SearchMARK() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл со всеми кодами\n' +
    '2. Загрузить папку с файлами в которых находятся коды для вычитания\n' +
    '3. Поиск марок (отобразаится результат)\n' +
    '4. Скачать результат';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Формирование и расчёт диапазона GTIN
function CalculationMARK() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл (содержащий любые нумерации марок)\n' +
    '2. Указать начальную марку (указать полный номер марки)\n' +
    '3. Указать конечную марку (указать полный номер марки)\n' +
    '4. Отобразится результат разницы (между начальной и конечной маркой)\n' +
    '5. Формировать (произойдёт сохранение файла с найденым содержимым выбранного диапазона марок)';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Сортировка GTIN приёмки с БСО
function sortingMARK() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл (содержащий любые GTIN с номерами марок)\n' +
    '2. В поле отобразятся найденые GTIN и их количество\n' +
    '3. Ниже отобразится количество найденых групп кодов\n' +
    '4. Обработать коды (произойдёт сохранение файлов с каждым отдельным GTIN + последовательность марок)';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Калькулятор дней (срок годности)
function expirationDate() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Выбрать начальную дату\n' +
    '2. Указать количество дней для срока годности\n' +
    '3. Рассчитать (ниже в поле оторбазится конечная дата срока годности)';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}

// Удаление марок с файла
function DelsMarkFiles() {
  const instructions = document.getElementById('instructions');
  const text =
    '1. Загрузить файл с GTIN содержащие марки\n' +
    '2. Произойдёт удаление марок с файла и сохраниться файл';

  const formattedText = text.replace(/(\d+\.)/g, '<strong><span class="step-number">$1</span></strong>');

  instructions.innerHTML = formattedText.replace(/\n/g, '<br>'); // Заменяем \n на <br>
  instructions.style.display = 'block';
}