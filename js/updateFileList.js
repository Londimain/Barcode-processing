// Функция обновления списка файлов
function updateFileList() {
    const fileList = document.getElementById('fileList');
    if (selectedFiles.length === 0) {
        fileList.innerHTML = '<em>Файлы не выбраны</em>';
        return;
    }

    fileList.innerHTML = '';
    selectedFiles.forEach(file => {
        const div = document.createElement('div');
        div.textContent = file.webkitRelativePath || file.name;
        fileList.appendChild(div);
    });
}