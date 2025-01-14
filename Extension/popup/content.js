(function() {
    console.log("Content script loaded!");

    try {
        // Skopiuj dokument i użyj Readability
        const documentClone = document.cloneNode(true);
        const readability = new Readability(documentClone);
        const article = readability.parse();

        if (article) {
            console.log("Processed article:", article);

            // Wyświetl przetworzony tytuł i treść w alercie (lub możesz użyć innego sposobu)
            alert(`Tytuł: ${article.title}\n\nTreść: ${article.textContent.substring(0, 500)}...`);
        } else {
            alert("Nie udało się przetworzyć artykułu.");
        }
    } catch (error) {
        console.error("Error processing article:", error);
        alert("Wystąpił błąd podczas przetwarzania strony.");
    }
})();
