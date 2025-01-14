document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup script loaded!");

    const button = document.getElementById("processButton"); // Zmień na ID swojego przycisku

    button.addEventListener("click", () => {
        console.log("Button clicked!");

        // Pobierz aktywną kartę
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];

            // Wstrzyknij kod obsługujący przetwarzanie strony z Readability
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["popup/Readability.js", "popup/content.js"]
            });
        });
    });
});
