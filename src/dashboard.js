document.addEventListener("DOMContentLoaded", function () {
    const uploadArea = document.querySelector(".upload-area");
    const uploadBtn = document.querySelector(".upload-btn");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt, .pdf, .ppt, .pptx, .doc, .docx"; // Accept multiple formats
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    uploadBtn.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            displayUploadedFile(file);
            processFile(file);
        }
    });

    function displayUploadedFile(file) {
        let uploadedFileContainer = document.querySelector(".uploaded-file");
        if (!uploadedFileContainer) {
            uploadedFileContainer = document.createElement("div");
            uploadedFileContainer.classList.add("uploaded-file");
            uploadArea.appendChild(uploadedFileContainer);
        }
        uploadedFileContainer.innerHTML = `<p>Uploaded: ${file.name}</p>`;
    }

    function processFile(file) {
        const fileType = file.name.split(".").pop().toLowerCase();
        if (fileType === "txt") {
            const reader = new FileReader();
            reader.onload = async function (e) {
                const text = e.target.result;
                summarizeText(text);
            };
            reader.readAsText(file);
        } else {
            uploadToBackend(file);
        }
    }

    async function uploadToBackend(file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            displaySummary(data.summary);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to process the file.");
        }
    }

    function displaySummary(summary) {
        let summaryContainer = document.querySelector(".summary-container");
        if (!summaryContainer) {
            summaryContainer = document.createElement("div");
            summaryContainer.classList.add("summary-container");
            uploadArea.appendChild(summaryContainer);
        }
        summaryContainer.innerHTML = `<p><strong>Summary:</strong> ${summary}</p>`;
    }

    async function summarizeText(text) {
        const response = await fetch("http://127.0.0.1:8000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        displaySummary(data.summary);
    }
});
