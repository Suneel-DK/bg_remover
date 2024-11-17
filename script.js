const fileInput = document.getElementById("fileInput");
const outputImage = document.getElementById("outputImage");
const previewImage = document.getElementById("previewImage");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        // Display preview of the input image
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result; // Set the input preview image
            previewImage.style.display = "block"; // Show the preview image
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = "none"; // Hide the preview image if no file is selected
    }
});

// Submit functionality for removing background and displaying output image
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
        const response = await fetch("https://captaindks.pythonanywhere.com/remove-bg", {
            method: "POST",
            body: formData,
             credentials: 'same-origin'
        });

        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "removed_bg.png";
            link.textContent = "Download Image";
            document.body.appendChild(link); // Add link to the body
            link.click(); // Simulate a click to start the download
            link.remove(); // Remove link after download

            // Display the output image
            outputImage.src = downloadUrl;
            outputImage.style.display = "block"; // Show the output image
        } else {
            throw new Error("Failed to process image.");
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("Something went wrong. Please try again.");
    }
});
