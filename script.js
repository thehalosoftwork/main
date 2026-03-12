// Smooth scrolling functions
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function scrollToWork() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function scrollToPricing() {
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
}

// FAQ toggle function
function toggleFAQ(element) {
    element.classList.toggle('active');
}

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Thank you for reaching out! We\'ll get back to you within 24 hours with a detailed response.');
        contactForm.reset();
    });
}