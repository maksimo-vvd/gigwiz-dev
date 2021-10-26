window.addEventListener('DOMContentLoaded', (event) => {

    const mediaQueryList = window.matchMedia("(max-width: 767.98px)")
    let isMobile = mediaQueryList.matches
    // console.log('load isMobile', isMobile);

    function screenTest(e) {
        if (e.matches) {
            /* the viewport is 600 pixels wide or less */
            isMobile = e.matches
            // console.log('if isMobile', isMobile);
        } else {
            /* the viewport is more than 600 pixels wide */
            isMobile = e.matches
            // console.log('else isMobile', isMobile);
        }
    }
    
    mediaQueryList.addEventListener('change', screenTest);

        
    const categories = document.querySelectorAll(".categories")

    const isVisible = function (ele, container) {
        const { right, width, left } = ele.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
    
        return left <= containerRect.left ? containerRect.left - left <= width : right - containerRect.right <= width;
    }

    if (categories.length > 0) {

        categories.forEach(element => {
            const categoriesTrack = element.querySelector(".categories-track")
            const categoriesTrackElements = categoriesTrack.querySelectorAll(".categories-track > *")
            const categoriesTrackSize = categoriesTrack.querySelector(".categories-track > *").clientWidth
            const categoriesTrackWidth = categoriesTrack.getBoundingClientRect().width
            const categoriesTrackElementsWidth = Array.from(categoriesTrackElements)
            .map(el=> parseInt(el.getBoundingClientRect().width))
            .reduce(function(accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0)
            const btnNext = element.querySelector(".categories .btn-next")
            const btnPrev = element.querySelector(".categories .btn-prev")
            
            if(categoriesTrackWidth > categoriesTrackElementsWidth) {
                btnNext.disabled = true
            }

            btnNext.addEventListener("click", scrollToNextTag);
            btnPrev.addEventListener("click", scrollToPrevTag);
            
            const firstEl = categoriesTrackElements[0]
            const lastEl = categoriesTrackElements[categoriesTrackElements.length - 1]
            const getExtremeElements = parent => {
                return [isVisible(firstEl, categoriesTrack), isVisible(lastEl, categoriesTrack)]
            }
            let [isVisibleFirstHorEl, isVisibleLastHorEl] = getExtremeElements()

            // For paginated scrolling, simply scroll the categories one item in the given
            // direction and let css scroll snaping handle the specific alignment.
            function scrollToNextTag() {
                categoriesTrack.scrollBy(categoriesTrackSize, 0)

                // Setup isScrolling variable
                var isScrolling;

                // Listen for scroll events
                categoriesTrack.addEventListener('scroll', function ( event ) {

                    // Clear our timeout throughout the scroll
                    window.clearTimeout( isScrolling );

                    // Set a timeout to run after scrolling ends
                    isScrolling = setTimeout(function() {

                        // Run the callback
                        console.log( 'Scrolling has stopped.' )

                        isVisibleFirstHorEl = isVisible(firstEl, categoriesTrack)
                        isVisibleLastHorEl = isVisible(lastEl, categoriesTrack)
        
                        if (isVisibleFirstHorEl !== true) {
                            btnPrev.classList.remove('invisible')
                        } else {
                            btnPrev.classList.add('invisible')
                        }
                        if (isVisibleLastHorEl === true) {
                            btnNext.disabled = true
                        } else {
                            btnNext.disabled = false
                        }

                    }, 300);

                }, false, { passive: true });


            }
            function scrollToPrevTag() {
                categoriesTrack.scrollBy(-categoriesTrackSize, 0);
            }

            // if (isMobile) {
                const btnMore = element.querySelector('.btn-more')

                btnMore.addEventListener('click', (e)=> {
                    e.preventDefault()
                    if (categoriesTrack.classList.contains('overflow-y-hidden') && categoriesTrack.classList.contains('h-32')) {
                        categoriesTrack.classList.remove('h-32')
                        e.target.innerHTML = 'less'
                    } else {
                        categoriesTrack.classList.add('h-32')
                        e.target.innerHTML = 'more'
                    }
                })
            // }
        });
    }

    // Contact form validation

    // https://www.w3resource.com/javascript/form/email-validation.php
    // https://codepen.io/joyshaheb/pen/XWgdOyY?editors=1010
    // https://www.javascripttutorial.net/javascript-dom/javascript-form-validation/

    const contactForm = document.querySelector('#contact_form')
    const contactFormEmail = contactForm.querySelector('#email')
    const contactFormMsg = contactForm.querySelector('#msg')

    const checkTextArea = () => {

        let valid = false;
    
        const min = 3,
            max = 500;
    
        const msg = contactFormMsg.value.trim();
    
        if (!isRequired(msg)) {
            showError(contactFormMsg, 'Message cannot be blank.');
        } else if (!isBetween(msg.length, min, max)) {
            showError(contactFormMsg, `Message must be between ${min} and ${max} characters.`)
        } else {
            showSuccess(contactFormMsg);
            valid = true;
        }
        return valid;
    };

    const checkEmail = () => {
        let valid = false;
        const email = contactFormEmail.value.trim();
        if (!isRequired(email)) {
            showError(contactFormEmail, 'Email cannot be blank.');
        } else if (!isEmailValid(email)) {
            showError(contactFormEmail, 'Email is not valid.')
        } else {
            showSuccess(contactFormEmail);
            valid = true;
        }
        return valid;
    }

    const isEmailValid = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const isRequired = value => value === '' ? false : true
    const isBetween = (length, min, max) => length < min || length > max ? false : true;

    const showError = (input, message) => {
        // get the form-field element
        const formField = input.parentElement;
        // add the error class
        formField.classList.remove('success');
        formField.classList.add('error');
    
        // show the error message
        const error = formField.querySelector('small');
        error.textContent = message;
    };
    
    const showSuccess = (input) => {
        // get the form-field element
        const formField = input.parentElement;
    
        // remove the error class
        formField.classList.remove('error');
        formField.classList.add('success');
    
        // hide the error message
        const error = formField.querySelector('small');
        error.textContent = '';
    }

    contactForm.addEventListener('submit', function (e) {
        // prevent the form from submitting
        e.preventDefault();
    
        // validate fields
        let isTextAreaValid = checkTextArea(),
            isEmailValid = checkEmail()
    
        let isFormValid = isTextAreaValid && isEmailValid
    
        // submit to the server if the form is valid
        if (isFormValid) {
            contactForm.submit()
        }
    })

    const debounce = (fn, delay = 500) => {
        let timeoutId;
        return (...args) => {
            // cancel the previous timer
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // setup a new timer
            timeoutId = setTimeout(() => {
                fn.apply(null, args)
            }, delay);
        };
    }

    contactForm.addEventListener('input', debounce(function (e) {
        switch (e.target.id) {
            case 'msg':
                checkTextArea();
                break;
            case 'email':
                checkEmail();
                break;
        }
    }))

    const btnOpenMenuHandler = document.getElementById('menu_control_open')
    const btnCloseMenuHandler = document.getElementById('menu_control_close')
    const pageNavMobile = document.querySelector('.page-nav-mobile')

    btnOpenMenuHandler.addEventListener('click', function (ev) {
        pageNavMobile.classList.remove('hidden')
    })
    btnCloseMenuHandler.addEventListener('click', function (ev) {
        pageNavMobile.classList.add('hidden')
    })
})