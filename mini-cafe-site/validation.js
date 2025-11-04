/**
 * Global function to handle form submission and validation.
 * @param {Event} event - The submission event.
 * @returns {boolean} - Returns false to prevent default form submission on failure.
 */
function validateForm(event) {
    // Prevent the default form submission action, so JS can handle it
    event.preventDefault(); 

    // 1. Get DOM elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formMessage = document.getElementById('form-message');
    
    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Clear previous messages
    formMessage.textContent = '';
    formMessage.style.color = ''; 
    
    let isValid = true;

    // --- 3. Validation Logic ---
    
    // a. Validate Name (must not be empty)
    if (name === "") {
        formMessage.textContent = "Error: Name field cannot be empty.";
        formMessage.style.color = 'red';
        nameInput.focus();
        isValid = false;
    }

    // b. Validate Email (simple pattern check)
    // Checks if the email contains '@' and '.'
    else if (!email.includes('@') || !email.includes('.')) {
        formMessage.textContent = "Error: Please enter a valid email address.";
        formMessage.style.color = 'red';
        emailInput.focus();
        isValid = false;
    }
    
    // c. Validate Message Length (length > 5)
    else if (message.length <= 5) {
        formMessage.textContent = "Error: Feedback message must be longer than 5 characters.";
        formMessage.style.color = 'red';
        messageInput.focus();
        isValid = false;
    }

    // --- 4. After successful validation ---
    if (isValid) {
        // Show success message
        formMessage.textContent = "Success! Thank you for your feedback.";
        formMessage.style.color = 'green';
        
        // Append message to the previous feedback list
        appendFeedback(name, message);
        
        // Clear the form fields after submission
        document.getElementById('feedback-form').reset();
    }

    // Returning false prevents the form from submitting and refreshing the page
    return false;
}

/**
 * Appends a successfully validated message to the 'Recent Feedback' list.
 * @param {string} name - The name submitted.
 * @param {string} message - The message submitted.
 */
function appendFeedback(name, message) {
    const feedbackList = document.getElementById('feedback-list');
    
    // Create a new list item
    const newFeedbackItem = document.createElement('li');
    
    // Format the text content
    const displayMessage = `"${message}" - ${name}`;
    newFeedbackItem.textContent = displayMessage;
    
    // Prepend (add to the top) of the list
    feedbackList.prepend(newFeedbackItem);
}