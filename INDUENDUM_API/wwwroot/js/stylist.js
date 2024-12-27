document.addEventListener("DOMContentLoaded", () => {
    const uploadPhotoInput = document.getElementById("upload-photo");
    const userPhotoArea = document.getElementById("user-photo-area");

    // Ngarkimi i fotos së përdoruesit
    uploadPhotoInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                userPhotoArea.innerHTML = `<img src="${e.target.result}" alt="Foto e përdoruesit" class="user-photo">`;
                userPhotoArea.style.position = "relative";
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag-and-drop për artikujt
    const items = document.querySelectorAll(".stylist-items .item");
    const dropArea = document.getElementById("user-photo-area");

    items.forEach((item) => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("item-html", item.outerHTML); // Ruaj artikullin si HTML
        });
    });

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.style.borderColor = "#F1C40F"; // Highlight border
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.borderColor = "#D5D8DC"; // Reset border
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.style.borderColor = "#D5D8DC";

        const data = e.dataTransfer.getData("item-html");
        const element = document.createElement("div");
        element.innerHTML = data;

        const droppedItem = element.firstChild;
        droppedItem.style.position = "absolute";
        droppedItem.style.left = `${e.clientX - dropArea.getBoundingClientRect().left}px`;
        droppedItem.style.top = `${e.clientY - dropArea.getBoundingClientRect().top}px`;
        droppedItem.style.zIndex = 10;
        droppedItem.style.cursor = "move";

        // Mundëso zhvendosjen e artikullit
        droppedItem.addEventListener("mousedown", (event) => {
            let offsetX = event.offsetX;
            let offsetY = event.offsetY;

            const moveItem = (moveEvent) => {
                droppedItem.style.left = `${moveEvent.clientX - dropArea.getBoundingClientRect().left - offsetX}px`;
                droppedItem.style.top = `${moveEvent.clientY - dropArea.getBoundingClientRect().top - offsetY}px`;
            };

            const stopMove = () => {
                document.removeEventListener("mousemove", moveItem);
                document.removeEventListener("mouseup", stopMove);
            };

            document.addEventListener("mousemove", moveItem);
            document.addEventListener("mouseup", stopMove);
        });

        dropArea.appendChild(droppedItem);
    });
});
