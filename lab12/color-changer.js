

function changeBackground() {
    const colorSelect = document.getElementById('color-select');
    
    const selectedColor = colorSelect.value;
    
    document.body.style.backgroundColor = selectedColor;
    
    if (selectedColor === '#333') {
        document.body.style.color = 'white';
    } else {
        document.body.style.color = '#333';
    }
}