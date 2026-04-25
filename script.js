// Simple interactivity for the booking website

document.addEventListener('DOMContentLoaded', function() {
    // Language Switcher with Dropdown
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('currentLangText');

    // Toggle dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langBtn.classList.toggle('active');
            langDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langBtn.classList.remove('active');
                langDropdown.classList.remove('show');
            }
        });

        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get selected language info
                const selectedLang = this.getAttribute('data-lang');
                const selectedDir = this.getAttribute('data-dir');
                const selectedLangName = this.querySelector('span:nth-child(2)').textContent;
                
                // Remove active class from all options
                langOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to selected option
                this.classList.add('active');
                
                // Update button text
                currentLangText.textContent = selectedLangName;
                
                // Apply language to website
                applyLanguage(selectedLang, selectedDir);
                
                // Close dropdown
                langBtn.classList.remove('active');
                langDropdown.classList.remove('show');
                
                console.log('Language changed to:', selectedLangName, '(' + selectedLang + ')');
            });
        });
    }

    // Function to apply language to the entire website
    function applyLanguage(lang, dir) {
        // Change HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        
        // Store selected language in localStorage
        localStorage.setItem('selectedLanguage', lang);
        localStorage.setItem('selectedDirection', dir);
        
        // Apply translations to all elements with data-translate attribute
        if (typeof translations !== 'undefined' && translations[lang]) {
            const elementsToTranslate = document.querySelectorAll('[data-translate]');
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
            
            // Update page title
            document.title = translations[lang].logoTitle + ' - ' + translations[lang].logoSubtitle;
            
            // Update search placeholder
            const searchInput = document.getElementById('langSearch');
            if (searchInput && translations[lang].searchPlaceholder) {
                searchInput.placeholder = translations[lang].searchPlaceholder;
            }
        }
        
        // Notification messages
        const notificationMessages = {
            'ar': 'تم تغيير اللغة إلى العربية',
            'en': 'Language changed to English',
            'fr': 'Langue changée en Français',
            'es': 'Idioma cambiado a Español',
            'de': 'Sprache geändert zu Deutsch',
            'it': 'Lingua cambiata in Italiano',
            'pt': 'Idioma alterado para Português',
            'ru': 'Язык изменен на Русский',
            'zh': '语言已更改为中文',
            'ja': '言語が日本語に変更されました',
            'ko': '언어가 한국어로 변경되었습니다',
            'tr': 'Dil Türkçe olarak değiştirildi',
            'hi': 'भाषा हिन्दी में बदल गई',
            'ur': 'زبان اردو میں تبدیل ہو گئی',
            'id': 'Bahasa diubah ke Bahasa Indonesia',
            'ms': 'Bahasa ditukar kepada Bahasa Melayu',
            'bn': 'ভাষা বাংলায় পরিবর্তিত হয়েছে',
            'fa': 'زبان به فارسی تغییر یافت'
        };
        
        // Show notification
        showNotification(notificationMessages[lang] || 'Language changed');
    }

    // Show notification function
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Load saved language on page load
    const savedLang = localStorage.getItem('selectedLanguage');
    const savedDir = localStorage.getItem('selectedDirection');
    if (savedLang && savedDir) {
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedDir;
        
        // Update active language in dropdown
        langOptions.forEach(option => {
            if (option.getAttribute('data-lang') === savedLang) {
                option.classList.add('active');
                currentLangText.textContent = option.querySelector('span:nth-child(2)').textContent;
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Handle book button clicks
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('h3').textContent;
            const packagePrice = packageCard.querySelector('.price').textContent;
            
            alert(`تم اختيار: ${packageName}\nالسعر: ${packagePrice}\n\nسيتم تحويلك لصفحة الحجز...`);
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all package cards
    document.querySelectorAll('.package-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
});
