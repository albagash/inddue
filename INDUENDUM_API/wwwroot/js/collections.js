document.addEventListener("DOMContentLoaded", () => {
    // **Ruajtja e votave për secilin koleksion**
    const votes = {};

    // **Inicializimi i votave për secilin koleksion**
    document.querySelectorAll(".collection-card").forEach((card) => {
        const id = card.getAttribute("data-id");
        votes[id] = 0; // Fillon me 0 vota
    });

    // **Shto funksionalitet për klikimin e votimit**
    document.querySelectorAll(".collection-card").forEach((card) => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            if (id in votes) {
                votes[id] += 1; // Rrit votat për këtë koleksion
                updateResults();
            }
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        const items = document.querySelectorAll(".item");
        const dropArea = document.querySelector(".drop-area");
        const saveButton = document.getElementById("save-collection");
        const confirmationMessage = document.getElementById("confirmation-message");

        // Aktivizimi i drag-and-drop për artikujt
        items.forEach(item => {
            item.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/html", item.outerHTML);
                e.dataTransfer.effectAllowed = "move";
            });
        });

        // Aktivizo "dragover" në zonën e koleksionit
        dropArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropArea.classList.add("highlight");
        });

        // Kur "drag" lëshohet jashtë zonës së koleksionit
        dropArea.addEventListener("dragleave", () => {
            dropArea.classList.remove("highlight");
        });

        // Funksionaliteti për "drop" në zonën e koleksionit
        dropArea.addEventListener("drop", (e) => {
            e.preventDefault();
            dropArea.classList.remove("highlight");
            const data = e.dataTransfer.getData("text/html");

            // Shto artikullin në zonën e koleksionit
            dropArea.innerHTML += data;

            // Rilidh funksionalitetin për artikujt e shtuar rishtas
            const newItems = dropArea.querySelectorAll(".item");
            newItems.forEach(item => {
                item.setAttribute("draggable", "false"); // Mos lejo tërheqje brenda zonës së koleksionit
                item.classList.add("in-collection");
            });
        });

        // Funksionaliteti për butonin "Ruaj Koleksionin"
        saveButton.addEventListener("click", () => {
            const itemsInCollection = dropArea.querySelectorAll(".item");
            if (itemsInCollection.length === 0) {
                alert("Ju lutemi shtoni artikuj në koleksionin tuaj para se ta ruani.");
                return;
            }

            // Mesazhi i konfirmimit dhe pastrimi i zonës
            confirmationMessage.style.display = "block";
            setTimeout(() => {
                confirmationMessage.style.display = "none";
                dropArea.innerHTML = "<p>Tërhiqni artikuj këtu për të krijuar koleksionin tuaj!</p>";
            }, 3000);
        });
    });


    // **Përditësimi i rezultateve të votimeve**
    const updateResults = () => {
        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0); // Totali i të gjitha votave

        Object.keys(votes).forEach((id) => {
            const percentage = totalVotes > 0 ? Math.round((votes[id] / totalVotes) * 100) : 0;
            const resultElement = document.querySelector(`#results-${id}`);
            if (resultElement) {
                resultElement.textContent = `Votat: ${votes[id]} (${percentage}%)`;
            }
        });
    };

    // **Gjenero dinamikisht rezultatet për secilin koleksion**
    const generateResults = () => {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = ""; // Pastro rezultatet ekzistuese

        Object.keys(votes).forEach((id) => {
            const collectionName = document.querySelector(`.collection-card[data-id="${id}"] img`).alt;
            const resultElement = document.createElement("p");
            resultElement.id = `results-${id}`;
            resultElement.textContent = `${collectionName}: Votat: 0 (0%)`;
            resultsContainer.appendChild(resultElement);
        });
    };

    // **Inicializimi i rezultateve të votimeve**
    generateResults();

    // **Seksioni "Shpërndani Stilin Tuaj"**
    const shareStyleForm = document.getElementById("share-style-form");
    shareStyleForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("style-title").value;
        const image = document.getElementById("style-image").files[0];

        if (title && image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const sharedStyles = document.getElementById("shared-styles");
                const styleCard = document.createElement("div");
                styleCard.classList.add("collection-card");

                styleCard.innerHTML = `
                    <img src="${e.target.result}" alt="${title}">
                    <div class="collection-overlay">
                        <p>${title}</p>
                    </div>
                `;
                sharedStyles.appendChild(styleCard);
            };
            reader.readAsDataURL(image);
            shareStyleForm.reset();
        } else {
            alert("Ju lutemi plotësoni të gjitha fushat dhe ngarkoni një fotografi.");
        }
    });

    // **Seksioni "Vlerësimet e Përdoruesve"**
    const stars = document.querySelectorAll(".star");
    const submitButton = document.getElementById("submit-review");
    const reviewsContainer = document.getElementById("reviews-container");
    const showReviewsButton = document.getElementById("show-reviews-btn");
    const reviewList = document.getElementById("review-list");
    let selectedRating = 0;

    // Aktivizo yjet për vlerësim
    stars.forEach((star) => {
        star.addEventListener("click", () => {
            selectedRating = star.getAttribute("data-value");
            stars.forEach((s) => s.classList.remove("selected"));
            star.classList.add("selected");
        });
    });

    // Dërgo komentin
    submitButton.addEventListener("click", () => {
        const comment = document.getElementById("review-comment").value.trim();
        if (selectedRating === 0 || comment === "") {
            alert("Ju lutemi zgjedhni një vlerësim dhe shkruani një koment!");
            return;
        }

        // Shto komentin në listë
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
            <p><strong>Yje: ${selectedRating} / 5</strong></p>
            <p>${comment}</p>
        `;
        reviewsContainer.insertBefore(reviewItem, reviewsContainer.firstChild);

        // Pastro fushat
        document.getElementById("review-comment").value = "";
        stars.forEach((s) => s.classList.remove("selected"));
        selectedRating = 0;
    });

    // Shfaq ose fsheh listën e komenteve
    showReviewsButton.addEventListener("click", () => {
        if (reviewList.style.display === "none") {
            reviewList.style.display = "block";
            showReviewsButton.textContent = "Fshih Komentet";
        } else {
            reviewList.style.display = "none";
            showReviewsButton.textContent = "Shfaq Komentet";
        }
    });


});
