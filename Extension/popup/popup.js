document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("processButton");
    const field = document.getElementById("tokeninput");

    // Load saved token on popup open
    chrome.storage.local.get(['GITHUB_TOKEN'], (result) => {
        if (result.GITHUB_TOKEN) {
            field.value = result.GITHUB_TOKEN;
            token = result.GITHUB_TOKEN;
            button.disabled = false;
        }
    });

    // Handle token input changes
    field.addEventListener("input", (e) => {
        const token = e.target.value.trim();
        button.disabled = token.length === 0;
        chrome.storage.local.set({ GITHUB_TOKEN: token });
    });

    // Handle process button click
    button.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab?.id) return;

        try {
            // Inject dependencies
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["popup/Readability.js"]
            });

            // Inject content script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["popup/content.js"]
            });
            
            // Close popup after injection
            window.close();
        } catch (error) {
            console.error("Injection failed:", error);
            alert("Błąd podczas przetwarzania strony!");
        }
    });
});