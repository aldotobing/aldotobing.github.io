// Get references to the input field and button
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-message");

// Function to toggle the button state
function toggleSendButton() {
  if (userInput.value.trim() === "") {
    sendButton.disabled = true; // Disable button if input is empty
  } else {
    sendButton.disabled = false; // Enable button if input has content
  }
}

// Initialize button state on page load
window.onload = () => {
  toggleSendButton(); // Call the function to set initial state
};

// Add event listener to the input field to monitor changes
userInput.addEventListener("input", toggleSendButton);
