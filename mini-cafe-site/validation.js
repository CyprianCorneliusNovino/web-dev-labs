function validateForm(event) {
    event.preventDefault(); 

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formMessage = document.getElementById('form-message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    formMessage.textContent = '';
    formMessage.style.color = ''; 
    
    let isValid = true;

    if (name === "") {
        formMessage.textContent = "Error: Name field cannot be empty.";
        formMessage.style.color = 'red';
        nameInput.focus();
        isValid = false;
    }

    else if (!email.includes('@') || !email.includes('.')) {
        formMessage.textContent = "Error: Please enter a valid email address.";
        formMessage.style.color = 'red';
        emailInput.focus();
        isValid = false;
    }
    
    else if (message.length <= 5) {
        formMessage.textContent = "Error: Feedback message must be longer than 5 characters.";
        formMessage.style.color = 'red';
        messageInput.focus();
        isValid = false;
    }

    if (isValid) {
        formMessage.textContent = "Success! Thank you for your feedback.";
        formMessage.style.color = 'green';
        
        appendFeedback(name, message);
        
        document.getElementById('feedback-form').reset();
    }

    return false;
}

function appendFeedback(name, message) {
    const feedbackList = document.getElementById('feedback-list');
    
    const newFeedbackItem = document.createElement('li');
    
    const displayMessage = `"${message}" - ${name}`;
    newFeedbackItem.textContent = displayMessage;
    
    feedbackList.prepend(newFeedbackItem);
}