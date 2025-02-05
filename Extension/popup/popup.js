document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const toggleButton = document.getElementById("toggleButton");
    const processButton = document.getElementById("processButton");
    const tokenInput = document.getElementById("tokeninput");

    // Przełączanie widoku: po kliknięciu zmieniamy klasę kontenera
    let settingsVisible = false;
    toggleButton.addEventListener("click", () => {
        settingsVisible = !settingsVisible;
        container.classList.toggle("show-settings", settingsVisible);
        // Zmiana ikony: gdy widok ustawień jest widoczny – strzałka w lewo, w przeciwnym razie ikona kołowrotka
        toggleButton.innerHTML = settingsVisible ? "&#8592;" : "&#9881;";
    });

    // Wczytanie zapisanego tokena przy otwieraniu popupu
    chrome.storage.local.get(["GITHUB_TOKEN"], (result) => {
        if (result.GITHUB_TOKEN) {
            tokenInput.value = result.GITHUB_TOKEN;
            processButton.disabled = false;
        }
    });

    // Obsługa zmian w polu tokena
    tokenInput.addEventListener("input", (e) => {
        const token = e.target.value.trim();
        processButton.disabled = token.length === 0;
        chrome.storage.local.set({ GITHUB_TOKEN: token });
    });

    // Obsługa przycisku "Przetwórz Stronę"
    processButton.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return;
        try {
            // Wstrzyknięcie zależności
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["popup/Readability.js"],
            });
            // Wstrzyknięcie content-script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["popup/content.js"],
            });
            window.close();
        } catch (error) {
            console.error("Injection failed:", error);
            alert("Błąd podczas przetwarzania strony!");
        }
    });

    // Wczytanie ustawień dla dodatkowych opcji (domyślnie true)
    const readabilityCheckbox = document.getElementById("readabilityMode");
    const aiSummarizerCheckbox = document.getElementById("aiSummarizer");
    const bullshitScoreCheckbox = document.getElementById("bullshitScore");

    chrome.storage.local.get(
        ["readabilityMode", "aiSummarizer", "bullshitScore"],
        (result) => {
            readabilityCheckbox.checked =
                result.readabilityMode !== undefined ? result.readabilityMode : true;
            aiSummarizerCheckbox.checked =
                result.aiSummarizer !== undefined ? result.aiSummarizer : true;
            bullshitScoreCheckbox.checked =
                result.bullshitScore !== undefined ? result.bullshitScore : true;
        }
    );

    // Zapis zmian ustawień przy zmianie stanu checkboxa
    readabilityCheckbox.addEventListener("change", (e) => {
        chrome.storage.local.set({ readabilityMode: e.target.checked });
    });
    aiSummarizerCheckbox.addEventListener("change", (e) => {
        chrome.storage.local.set({ aiSummarizer: e.target.checked });
    });
    bullshitScoreCheckbox.addEventListener("change", (e) => {
        chrome.storage.local.set({ bullshitScore: e.target.checked });
    });
});
