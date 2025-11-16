// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Set minimum date for booking (today)
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// Initialize EmailJS (Optional - configure if you want to use EmailJS)
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID
// 5. Replace the values below

let emailjsConfigured = false;

// Check if EmailJS is available and configured
if (typeof emailjs !== 'undefined') {
    try {
        // Replace with your EmailJS Public Key
        emailjs.init("YOUR_PUBLIC_KEY");
        emailjsConfigured = true;
    } catch (error) {
        console.log('EmailJS not configured');
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const days = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
    const months = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Get package name in Albanian
function getPackageName(packageValue) {
    const packages = {
        'fillestare': 'Paketa Fillestare - 15€',
        'standard': 'Paketa Standard - 35€',
        'premium': 'Paketa Premium - 65€'
    };
    return packages[packageValue] || packageValue;
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Booking Form Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            package: document.getElementById('package').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            participants: document.getElementById('participants').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.package || 
            !formData.date || !formData.time || !formData.participants) {
            alert('Ju lutemi plotësoni të gjitha fushat e detyrueshme!');
            return;
        }

        // Show loading state
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Duke dërguar...';
        submitButton.disabled = true;

        try {
            // Prepare email template parameters
            const emailParams = {
                to_email: 'drilonrexhaja6@gmail.com',
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                package: getPackageName(formData.package),
                date: formatDate(formData.date),
                time: formData.time,
                participants: formData.participants,
                message: formData.message || 'Nuk ka mesazh',
                booking_date: formData.date,
                booking_time: formData.time
            };

            // Send email notification
            // Method 1: Try EmailJS if configured
            let emailSent = false;
            if (emailjsConfigured && typeof emailjs !== 'undefined') {
                try {
                    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual values
                    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams);
                    console.log('Email sent successfully via EmailJS');
                    emailSent = true;
                } catch (emailError) {
                    console.log('EmailJS error:', emailError);
                }
            }

            // Method 2: Use Web3Forms API (free, no signup required for basic use)
            if (!emailSent) {
                try {
                    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            access_key: '9d8e421e-4174-4d24-a151-52bb37450f75', // Get free key from web3forms.com - See EMAIL_SETUP.md
                            subject: `Rezervim i ri - Colosseum Paintball Arena`,
                            from_name: formData.name,
                            from_email: formData.email,
                            to: 'drilonrexhaja6@gmail.com',
                            message: `
Rezervim i ri nga website:

Emri: ${formData.name}
Email: ${formData.email}
Telefoni: ${formData.phone}
Paketa: ${getPackageName(formData.package)}
Data: ${formatDate(formData.date)}
Ora: ${formData.time}
Pjesëmarrës: ${formData.participants}
Mesazh: ${formData.message || 'Nuk ka mesazh'}
                            `.trim()
                        })
                    });

                    const result = await web3formsResponse.json();
                    if (result.success) {
                        console.log('Email sent successfully via Web3Forms');
                        emailSent = true;
                    }
                } catch (web3Error) {
                    console.log('Web3Forms error:', web3Error);
                }
            }

            // Method 3: Fallback - Log to console (for development)
            if (!emailSent) {
                console.log('Email notification (would be sent to drilonrexhaja6@gmail.com):', {
                    subject: 'Rezervim i ri - Colosseum Paintball Arena',
                    ...emailParams
                });
                // In production, you would set up EmailJS or Web3Forms
                // For now, the form data is logged to console
            }

            // Show confirmation modal with highlighted date and time
            const modal = document.getElementById('confirmationModal');
            if (modal) {
                document.getElementById('confirmName').textContent = formData.name;
                document.getElementById('confirmEmail').textContent = formData.email;
                document.getElementById('confirmPhone').textContent = formData.phone;
                document.getElementById('confirmPackage').textContent = getPackageName(formData.package);
                document.getElementById('confirmDate').textContent = formatDate(formData.date);
                document.getElementById('confirmTime').textContent = formData.time;
                document.getElementById('confirmParticipants').textContent = formData.participants;
                modal.style.display = 'block';
            }

            // Reset form
            bookingForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Ka ndodhur një gabim. Ju lutemi provoni përsëri ose na kontaktoni direkt.');
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('confirmationModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with X button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Ju lutemi plotësoni të gjitha fushat!');
            return;
        }

        // Show success message
        alert(`Mesazhi juaj është dërguar me sukses!\n\nDo t'ju përgjigjemi së shpejti në email: ${formData.email}`);
        
        // Reset form
        contactForm.reset();
        
        // In a real application, you would send this data to a server
        console.log('Contact Data:', formData);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 4.5rem; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 3.125rem) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)';
    }
});

// Gallery image click (optional - can be enhanced with lightbox)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            // In a real application, you could open a lightbox here
            console.log('Gallery image clicked:', img.src);
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -3.125rem 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .gallery-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(1.875rem)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Format phone number input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && !value.startsWith('+')) {
            value = '+355' + value;
        }
        e.target.value = value;
    });
}

// Validate participants number
const participantsInput = document.getElementById('participants');
if (participantsInput) {
    participantsInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value < 2) {
            e.target.setCustomValidity('Duhet të keni të paktën 2 pjesëmarrës');
        } else if (value > 20) {
            e.target.setCustomValidity('Maksimumi 20 pjesëmarrës');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

