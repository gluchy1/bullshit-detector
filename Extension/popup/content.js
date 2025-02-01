(function() {
        
    try {
        // ===== Configuration =====
        const DEBUG_MODE = true; // true-token nieuzywany or false-token uzywany ---- zeby nie marnowac kurwa bo to moj token /michal
        const DEBUG_MESSAGE = "ChatGPT disabled (debug mode)";
        // =========================

        async function chatgpt(textToFormat, token) {
            if (DEBUG_MODE) return DEBUG_MESSAGE;
            
            const result = await chrome.storage.local.get(['GITHUB_TOKEN']);
            token = result.GITHUB_TOKEN;
            if (!token && !DEBUG_MODE) throw new Error("Brak tokenu API!");

            const endpoint = "https://models.inference.ai.azure.com"; // Update with correct endpoint
            const modelName = "gpt-4o-mini";

            const response = await fetch(`${endpoint}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adjust headers as per your API requirements
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a helpful assistant that checks the article for it being propaganda." },
                        { role: "user", content: "TL:DR this article in max 150 words and at the end add something like --This article is: 0/100 propaganda-- where you choose by yourself the number of it how much being propaganda, where 100 is most propaganda and 0 none:" + textToFormat }
                    ],
                    temperature: 1.0,
                    top_p: 1.0,
                    max_tokens: 1000,
                    model: modelName
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.choices[0].message.content;
        }

        // Skopiuj dokument i użyj Readability
        const documentClone = document.cloneNode(true);
        const readability = new Readability(documentClone);
        const article = readability.parse();
        
        // DOCUMENT FORMATTING
        chatgpt(article.textContent, window.myExtensionToken)
            .then(processChat => {
                if (article) {
                    console.log("Processed article:", article);

                    // Zastąp zawartość strony nową treścią
                    document.body.innerHTML = `
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                // margin: 20px;
                                padding: 5;
                                color: #FFFFFF;
                                display: flex;
                                justify-content: center;
                            }
                            .content {
                                max-width: 50%;
                            }

                            img {
                                display: block;
                                margin-left: auto;
                                margin-right: auto;
                                margin-top: 20px;
                                margin-bottom: 20px;
                                width: calc(100% - 220px);
                            }
                            h1 {
                                margin-bottom: 20px;
                                font-size: 2em;
                                font-weight: bold;
                            }
                            .bullshit {
                                width: 300px;
                                height: 100vh;
                                background-color: #333;
                                color: white;
                                display: block;

                                justify-content: center;
                                position: fixed;
                                left: 0;
                                top: 0;
                            }

                            .article {
                                margin-left: 200px;
                                width: calc(100% - 200px);
                                overflow-y: auto;
                                display: block;

                                justify-content: center;
                                padding: 20px;
                                text-align: left;
                            }
                            p {
                                margin-bottom: 20px;
                            }
                            
                            @media (prefers-color-scheme: light) {
                                body {
                                    background-color: white;
                                    color: black;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                    color: black;
                                }
                                a {
                                    color:rgb(48, 35, 184); /* Default link color */
                                    text-decoration: none;
                                }
                                a:hover {
                                    text-decoration: underline;
                                }
                            }
                            @media (prefers-color-scheme: dark) {
                                body {
                                    background-color: #202124;
                                    color: white;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                    color: #FFFFFF;
                                }
                                a {
                                    color:rgb(159, 153, 223); /* Default link color */
                                    text-decoration: none;
                                }
                                a:hover {
                                    text-decoration: underline;
                                }
                            }
                        </style>
                        <div class="content">
                            <div class="bullshit">
                            <p>Bullshit Analysis</p>
                            <p>${processChat}</p>
                            </div>
                            
                            <div class="article">
                            <h1>${article.title}</h1>
                            ${article.content}
                            </div>
                        </div>
                    `;
                } else {
                    alert("Nie udało się przetworzyć artykułu.");
                }
            }) 
            .catch(error => {
                console.error("Error processing article:", error);
                alert("Wystąpił błąd podczas przetwarzania strony.");
            });
            
        } catch (error) {
            console.error("Error processing article:", error);
            alert("Wystąpił błąd podczas przetwarzania strony.");
        }
})();
