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
                        padding: 5;
                        color: #FFFFFF;
                        display: flex;
                        justify-content: center;
                    }
                    .content {
                        max-width: 50%;
                    }
                    h1 {
                        margin-bottom: 20px;
                    }
                    @media (prefers-color-scheme: light) {
                        body {
                            background-color: white;
                            color: black;
                        }
                    }
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #202124;
                            color: white;
                        }
                </style>
                <div class="content">
                    <h1>${article.title}</h1>
                    <div>${article.content}</div>
                </div>
            `;
        } else {
            alert("Nie udało się przetworzyć artykułu.");
        }
    } catch (error) {
        console.error("Error processing article:", error);
        alert("Wystąpił błąd podczas przetwarzania strony.");
    }
})();
