document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup script loaded!");

    const button = document.getElementById("highlightButton");

        button.addEventListener("click", () => {
            console.log("Button clicked!");
            // Send message to content script to highlight paragraphs
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // Send message to the content script of the active tab
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: highlightParagraphs
                });
            });
        });

});

// Function to highlight paragraphs (this will be executed in the content script context)
function highlightParagraphs() {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        paragraph.style.backgroundColor = 'yellow';  // Highlight paragraphs
    });
}
