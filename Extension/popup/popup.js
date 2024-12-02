document.getElementById("highlightButton").addEventListener("click", () => {
    console.log("Button clicked!"); // Add this to check if the event is firing
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        });
    });
});