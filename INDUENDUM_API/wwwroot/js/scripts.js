document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".hero button");
    if (button) {
        button.addEventListener("click", () => {
            alert("Shop the best deals now!");
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            item.classList.toggle('active');
        });
    });
});
