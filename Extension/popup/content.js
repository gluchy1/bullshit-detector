// Highlight all paragraphs on the page
document.querySelectorAll("p").forEach((p) => {
    p.style.backgroundColor = "yellow"; // Set the background color to yellow
    p.style.color = "black";           // Ensure text is readable
    p.style.padding = "5px";           // Add padding for better visibility
    p.style.borderRadius = "5px";      // Add rounded corners
    console.log("Highlighted paragraph:", p.textContent); // Log each paragraph text
});