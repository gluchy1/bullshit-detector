(function() {
        
    try {
        // ===== Configuration =====
        const DEBUG_MODE = false; // true-token nieuzywany or false-token uzywany ---- zeby nie marnowac kurwa bo to moj token /michal
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
                        { role: "user", content: `
                        Your role is to write a summary the article and check if it's propaganda.
                        You have some rules, you need to follow:
                        1. You need to give output in maximum of 50 words.
                        2. You must use english for your whole response.
                        3. At the end, you MUST add a score of 0-100, where 0 is not propaganda and 100 is full propaganda.
                        3a. If you think the article is not propaganda, you can add a score of 0.
                        3b. If you think the article is full propaganda, you can add a score of 100.
                        3c. If you think the article is somewhere in between, you can add a score between 1-99.
                        4. You must give a reason for your score.
                        5. You must give a summary of the article.
                        6. Your output must look like this: your summary and then IN A NEW LINE!!! "Score:" and then IN A NEW LINE!!! "Reason:".
                        6a. If you don't follow this format, you will get fucking killed, you fucking stupid AI stealing jobs fuck.
                        6b. Sorry. Im polite now. But you better fucking follow that rule with "Score:" and "Reason:".
                        7. Do not use "**" for formatting. MD is not supported.
                        `
                        + textToFormat }
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

                // usuwanie tekstu ...

                const parts = processChat.split(/\n\s*\n/).map(part => part.trim()).filter(part => part.length > 0);
                let summary = "";
                let score = "";
                let reason = "";

                parts.forEach(part => {

                    if (/^score:/i.test(part)) {

                        if (!score) {
                            score = part.replace(/^score:\s*/i, '').trim();
                        }

                    } else if (/^reason:/i.test(part)) {
                        const content = part.replace(/^reason:\s*/i, '').trim();
                        if (!reason && content) {
                            reason = content;
                        }

                    } else if (/^summary:/i.test(part)) {
                        summary = part.replace(/^summary:\s*/i, '').trim();

                    } else {
                        if (summary) {
                            summary += "\n" + part;
                        } else {
                            summary = part;
                        }
                    }
                });
                // ---------------------------------

                if (article) {
                    console.log("Processed article:", article);

                    // Zastąp zawartość strony nową treścią
                    document.body.innerHTML = `
                        <style>
                            body {
                                font-family: 'Roboto', sans-serif;
                                line-height: 1.6;
                                font-size: 16px;
                                margin: 20px;
                                padding: 5px;
                                background-color: #202124;
                                color: #f0f0f0;
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
                                color: #333;
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                width: 320px;
                                max-width: 90%;
                                padding: 20px;
                                background: rgba(255, 255, 255, 0.95);
                                backdrop-filter: blur(5px);
                                border-radius: 12px;
                                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                                z-index: 1000;
                                max-height: calc(100vh - 40px);
                                overflow-y: auto;
                            }
                            .bullshit.dark-mode {
                                background: rgba(50, 50, 50, 0.95);
                                color: #f0f0f0;
                            }
                            .bullshit h3 {
                                color: #333;
                                margin-top: 0;
                                font-size: 1.5em;
                                border-bottom: 2px solid #ddd;
                                padding-bottom: 10px;
                            }
                            .bullshit .summary {
                                margin-top: 15px;
                                font-size: 1em;
                                line-height: 1.5;
                                text-align: justify;
                            }                          
                            .analysis-header {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }
                            .analysis-body {
                                margin-top: 10px;
                            }
                            .analysis-body p {
                                margin-bottom: 10px;
                            }
                                .article {
                                width: calc(100% - 200px);
                                overflow-y: auto;
                                display: block;

                                justify-content: center;
                                padding: 20px;
                                text-align: justify;
                            }
                            
                            .article h1 {
                                margin-bottom: 20px;
                                font-size: 2em;
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
                            <div class="analysis-header">
                                <h3>Bullshit analysis</h3>
                                <div class="controls">
                                    <button id="toggleAnalysis" title="Ukryj/Pokaż analizę">–</button>
                                    <button id="toggleDarkMode" title="Włącz/Wyłącz tryb ciemny">🌙</button>
                                </div>
                            </div>
                            <div class="analysis-body">
                                <div class="summary">
                                    <p><strong>Summary:</strong> ${summary}</p>
                                </div>
                                <div class="score">
                                    <p><strong>Score:</strong> ${score}</p>
                                </div>
                                <div class="reason">
                                    <p><strong>Reason:</strong> ${reason}</p>
                                </div>
                            </div>
                        </div>
                            
                            <div class="article">
                            <h1>${article.title}</h1>
                            ${article.content}
                            </div>
                        </div>
                    `;

                    // ----- OBSŁUGA PRZYCISKÓW -----
                    // Przycisk do zwijania/rozwijania kontenera z analizą
                    document.getElementById("toggleAnalysis").addEventListener("click", () => {
                        const analysisBody = document.querySelector(".bullshit .analysis-body");
                        if (analysisBody.style.display === "none") {
                            analysisBody.style.display = "block";
                        } else {
                            analysisBody.style.display = "none";
                        }
                    });

                    // Przycisk do przełączania trybu ciemnego (dla kontenera z analizą)
                    document.getElementById("toggleDarkMode").addEventListener("click", () => {
                        const analysisContainer = document.querySelector(".bullshit");
                        analysisContainer.classList.toggle("dark-mode");
                    });
                    // ------------------------------


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
