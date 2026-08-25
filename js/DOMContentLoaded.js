// Функция чтобы при клике на ячейку в колонке «Email» содержимое копировалось в буфер обмена для contacts.html
document.addEventListener('DOMContentLoaded', function() {
    // Находим все ячейки таблицы с data-label="Email"
    const emailCells = document.querySelectorAll('td[data-label="Email"]');

    // Для каждой ячейки добавляем обработчик клика
    emailCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const email = this.textContent.trim();

            // Проверяем, что ячейка не пустая
            if (email) {
                // Копируем в буфер обмена
                navigator.clipboard.writeText(email)
                    .then(() => {
                        // Визуальная обратная связь
                        this.style.backgroundColor = '#5e6e56';
                        this.style.color = '#000000';

                        // Возвращаем стили через 1 секунду
                        setTimeout(() => {
                            this.style.backgroundColor = '';
                            this.style.color = '';
                        }, 1000);
                    })
                    .catch(err => {
                        console.error('Ошибка при копировании: ', err);
                        alert('Не удалось скопировать email. Попробуйте вручную.');
                    });
            } else {
                alert('Email не указан');
            }
        });

        // Меняем курсор на указатель, чтобы показать интерактивность
        cell.style.cursor = 'pointer';
    });
   
});