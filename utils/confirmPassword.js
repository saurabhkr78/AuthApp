
    // Get references to the password and confirm password fields
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    
    // Listen for input on the confirm password field
    confirmPasswordField.addEventListener('input', function() {
        // Compare the password and confirm password fields
        if (passwordField.value !== confirmPasswordField.value) {
            // Show error if passwords don't match
            passwordError.style.display = 'inline';
        } else {
            // Hide error if passwords match
            passwordError.style.display = 'none';
        }
    });
    
    // Optional: Prevent form submission if passwords don't match
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        if (passwordField.value !== confirmPasswordField.value) {
            event.preventDefault(); // Prevent form submission
            passwordError.style.display = 'inline'; // Show error message
        }
    });
