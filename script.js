const fileInput = document.getElementById("fileInput");
const outputImage = document.getElementById("outputImage");
const previewImage = document.getElementById("previewImage");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = "none";
    }
});

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please choose an image before submitting.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        // Fixed the syntax error in headers configuration
        const response = await fetch("https://captaindks.pythonanywhere.com/remove-bg", {
            method: "POST",
            body: formData,
            credentials: 'same-origin',
            headers: {
                'Accept': 'image/*'
            }
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            
            // Display the output image first
            outputImage.src = downloadUrl;
            outputImage.style.display = "block";
            
            // Create and trigger download
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "removed_bg.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Clean up the object URL
            URL.revokeObjectURL(downloadUrl);
        } else {
            const errorText = await response.text();
            console.error("Server response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Detailed error:", error);
        alert("Error: " + error.message);
    }
});
