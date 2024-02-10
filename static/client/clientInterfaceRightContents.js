document.addEventListener("DOMContentLoaded", function() {
    const leftLinks = document.querySelectorAll('.left-link');
    const sections = document.querySelectorAll('.right-section > div');

    leftLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');
            sections.forEach(function(section) {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});
