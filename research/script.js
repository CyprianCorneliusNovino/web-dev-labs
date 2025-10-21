const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton'); 
const recordGradeButton = document.getElementById('recordGradeButton');
const newGradeInput = document.getElementById('newGrade');
const pickedStudentNameDisplay = document.getElementById('pickedStudentName');
const pickedStudentGradeDisplay = document.getElementById('pickedStudentGrade');
const optionCountSpan = document.getElementById('optionCount');
const wheelOptionsList = document.querySelector('.wheel-options-list');
const shuffleButton = document.getElementById('shuffleButton');
const lastUpdatedSpan = document.getElementById('lastUpdated');
const downloadGradesButton = document.getElementById('downloadGradesButton'); // NEW

const WHEEL_SIZE = 600; 
const center = WHEEL_SIZE / 2;
const radius = center - 5; 

// --- STUDENT DATA (Simulated C# Backend Data) ---
let students = [
    { id: 1, name: "Alice M.", currentRecitationGrade: 0.95 },
    { id: 2, name: "Bob W.", currentRecitationGrade: 0.60 }, 
    { id: 3, name: "Charlie S.", currentRecitationGrade: 0.80 },
    { id: 4, name: "Diana L.", currentRecitationGrade: 0.75 },
    { id: 5, name: "Ethan C.", currentRecitationGrade: 0.90 },
    { id: 6, name: "Fiona P.", currentRecitationGrade: 0.55 },
    { id: 7, name: "George A.", currentRecitationGrade: 0.70 },
    { id: 8, name: "Hannah K.", currentRecitationGrade: 0.88 },
    { id: 9, name: "Ivan B.", currentRecitationGrade: 0.65 },
    { id: 10, name: "Julia R.", currentRecitationGrade: 0.72 },
    { id: 11, name: "Kevin T.", currentRecitationGrade: 0.99 },
    { id: 12, name: "Laura V.", currentRecitationGrade: 0.58 },
    { id: 13, name: "Mike X.", currentRecitationGrade: 0.81 },
    { id: 14, name: "Nancy Z.", currentRecitationGrade: 0.68 },
    { id: 15, name: "Oscar D.", currentRecitationGrade: 0.77 },
    { id: 16, name: "Pamela E.", currentRecitationGrade: 0.62 },
];
let pickedStudent = null;
let isSpinning = false;

// Color palette for the wheel slices
const colors = [
    '#ed5564', '#f7835c', '#ffcc5c', '#98d8b0', '#6aa84f', '#4a86e8', '#8a2be2', '#a64d79',
    '#800080', '#00ced1', '#ffc0cb', '#da70d6', '#ba55d3', '#ffa500', '#f0e68c', '#add8e6'
];

// --- CORE WEIGHT LOGIC ---
function calculateWeight(gradeDecimal) {
    const baseWeight = 5; 
    const maxGradeInfluence = 100;
    const invertedGrade = 1.0 - gradeDecimal;
    const calculatedWeight = Math.round(invertedGrade * maxGradeInfluence);
    return baseWeight + calculatedWeight;
}

function pickWeightedStudent(arr) {
    arr.forEach(s => s.calculatedWeight = calculateWeight(s.currentRecitationGrade));
    let totalWeight = arr.reduce((sum, s) => sum + s.calculatedWeight, 0);
    let rand = Math.random() * totalWeight; 

    for (let s of arr) {
        rand -= s.calculatedWeight;
        if (rand <= 0) {
            return s;
        }
    }
    return arr[arr.length - 1];
}


// --- DRAWING AND UI RENDERING ---

function drawWheel() {
    students.forEach(s => s.calculatedWeight = calculateWeight(s.currentRecitationGrade));
    let totalWeight = students.reduce((sum, s) => sum + s.calculatedWeight, 0);
    let startAngle = 0;

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    students.forEach((student, index) => {
        const sliceAngle = (student.calculatedWeight / totalWeight) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.fill();
        
        // Draw Text
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial'; 
        ctx.textAlign = 'right';
        
        const textAngle = startAngle + sliceAngle / 2;
        const textX = center + Math.cos(textAngle) * (radius * 0.7);
        const textY = center + Math.sin(textAngle) * (radius * 0.7);
        
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2); 
        ctx.fillText(student.name, 0, 0);
        
        ctx.restore();

        startAngle = endAngle;
    });
}


function renderWheelOptions() {
    wheelOptionsList.innerHTML = ''; 
    students.forEach((student, index) => {
        
        let gradeEmoji = '';
        if (student.currentRecitationGrade >= 0.9) gradeEmoji = '🏆';
        else if (student.currentRecitationGrade >= 0.75) gradeEmoji = '🌟';
        else if (student.currentRecitationGrade >= 0.6) gradeEmoji = '🤔';
        else gradeEmoji = '🚨';

        const optionItem = document.createElement('div');
        optionItem.classList.add('wheel-option-item');
        optionItem.dataset.id = student.id; 

        optionItem.innerHTML = `
            <span>${gradeEmoji}</span>
            <input type="text" value="${student.name}" data-student-id="${student.id}" class="option-name-input">
            <span class="option-grade">${Math.round(student.currentRecitationGrade * 100)}%</span>
            <button class="option-delete"><i class="fas fa-trash-alt"></i></button>
        `;
        wheelOptionsList.appendChild(optionItem);
    });
    optionCountSpan.textContent = students.length;

    // Attach event listeners for name editing and saving
    document.querySelectorAll('.option-name-input').forEach(input => {
        input.addEventListener('blur', handleNameEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            }
        });
    });
}

function updateLastUpdated() {
    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    lastUpdatedSpan.textContent = now.toLocaleString('en-US', options).replace(',', ' -');
}


// --- EVENT HANDLERS ---

async function handleSpin() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    newGradeInput.disabled = true;
    recordGradeButton.disabled = true;
    pickedStudentNameDisplay.textContent = "Spinning...";
    pickedStudentGradeDisplay.textContent = "Selecting student based on weighted probability...";

    // 1. Pick the student
    let studentToPick = pickWeightedStudent(students);
    
    // 2. Calculate spin rotation 
    let totalWeight = students.reduce((sum, s) => sum + s.calculatedWeight, 0);
    let cumulativeWeight = 0;
    
    for (let s of students) {
        let sliceAngle = (s.calculatedWeight / totalWeight) * 2 * Math.PI;
        if (s.id === studentToPick.id) {
            let targetSliceEnd = cumulativeWeight + sliceAngle;
            let targetMidAngleRad = (cumulativeWeight + targetSliceEnd) / 2;
            let targetMidAngleDeg = targetMidAngleRad * (180 / Math.PI);

            let requiredStopRotation = 360 - targetMidAngleDeg + 90; 
            const extraSpins = Math.floor(Math.random() * 5) + 5; 
            const finalRotation = requiredStopRotation + (360 * extraSpins);

            canvas.style.transform = `rotate(${finalRotation}deg)`;
            break;
        }
        cumulativeWeight += sliceAngle;
    }

    // 3. Wait for spin and update UI
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    pickedStudent = studentToPick;
    pickedStudentNameDisplay.textContent = `Selected: ${pickedStudent.name}`;
    pickedStudentGradeDisplay.textContent = 
        `Current Grade: ${Math.round(pickedStudent.currentRecitationGrade * 100)}% | Weight: ${pickedStudent.calculatedWeight}`;
    
    newGradeInput.value = '';
    newGradeInput.disabled = false;
    recordGradeButton.disabled = false;
    isSpinning = false;
}

function handleRecordGrade() {
    if (!pickedStudent) {
        alert("Please spin the wheel first to select a student.");
        return;
    }
    
    const newGradePercent = parseFloat(newGradeInput.value);
    
    if (isNaN(newGradePercent) || newGradePercent < 0 || newGradePercent > 100) {
        alert("Please enter a valid grade between 0 and 100.");
        return;
    }
    
    const newGradeDecimal = newGradePercent / 100;
    
    // Update student data
    const studentIndex = students.findIndex(s => s.id === pickedStudent.id);
    if (studentIndex > -1) {
        students[studentIndex].currentRecitationGrade = newGradeDecimal;
        students[studentIndex].calculatedWeight = calculateWeight(newGradeDecimal);
    }
    
    alert(`${pickedStudent.name}'s new grade (${newGradePercent}%) recorded successfully!`);
    
    // Re-draw and update UI
    drawWheel(); 
    renderWheelOptions();
    updateLastUpdated();
    
    pickedStudent = null;
    newGradeInput.value = '';
    newGradeInput.disabled = true;
    recordGradeButton.disabled = true;
    spinButton.disabled = false;
    pickedStudentNameDisplay.textContent = "New grade recorded. Click 'SPIN' to select the next student.";
    pickedStudentGradeDisplay.textContent = "";
}

function handleNameEdit(event) {
    const input = event.target;
    const studentId = parseInt(input.dataset.studentId);
    const newName = input.value.trim();
    const student = students.find(s => s.id === studentId);

    if (!student) return;

    if (!newName) {
        alert("Student name cannot be empty. Reverting change.");
        input.value = student.name;
        return;
    }

    if (student.name !== newName) {
        student.name = newName;
        drawWheel(); // Redraw with new name
        updateLastUpdated();
    }
}

// --- CSV DOWNLOAD FUNCTION ---
function handleDownloadGrades() {
    if (students.length === 0) {
        alert("The student list is empty. Nothing to download.");
        return;
    }

    // 1. Define the CSV Header Row
    let csvContent = "ID,Name,Recitation Grade (0-1),Recitation Grade (%),Selection Weight\n";

    // 2. Iterate through students and generate data rows
    students.forEach(student => {
        const weight = calculateWeight(student.currentRecitationGrade);
        const gradePercent = Math.round(student.currentRecitationGrade * 100);

        // Enclose name in quotes to handle potential commas in names
        const nameEscaped = `"${student.name.replace(/"/g, '""')}"`; 

        csvContent += `${student.id},${nameEscaped},${student.currentRecitationGrade},${gradePercent},${weight}\n`;
    });

    // 3. Create a Blob and URL for download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // 4. Create a temporary <a> tag to trigger the download
    const wheelTitle = document.getElementById('wheelTitle').value.replace(/[^a-zA-Z0-9 ]/g, '');
    const filename = `${wheelTitle || "Student_Grades"}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    canvas.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    drawWheel();
    renderWheelOptions();
    updateLastUpdated();

    spinButton.addEventListener('click', handleSpin);
    recordGradeButton.addEventListener('click', handleRecordGrade);
    shuffleButton.addEventListener('click', handleShuffle);
    
    // Attach event listeners for delete and download
    wheelOptionsList.addEventListener('click', handleOptionDelete); 
    downloadGradesButton.addEventListener('click', handleDownloadGrades); // NEW
});

// Helper functions for delete/shuffle (omitted for brevity, assume they exist)
function handleOptionDelete(event) {/* ... */}; 
function handleShuffle() {/* ... */};