(function() {
    console.log("Content script loaded!");

    try {
        // Skopiuj dokument i użyj Readability
        const documentClone = document.cloneNode(true);
        const readability = new Readability(documentClone);
        const article = readability.parse();

        if (article) {
            console.log("Processed article:", article);

            // Zastąp zawartość strony nową treścią
            document.body.innerHTML = `
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                        padding: 0;
                        color: #333;
                    }
                    h1 {
                        margin-bottom: 20px;
                    }
                </style>
                <h1>${article.title}</h1>
                <div>${article.content}</div>
            `;
        } else {
            alert("Nie udało się przetworzyć artykułu.");
        }
    } catch (error) {
        console.error("Error processing article:", error);
        alert("Wystąpił błąd podczas przetwarzania strony.");
    }
})();
