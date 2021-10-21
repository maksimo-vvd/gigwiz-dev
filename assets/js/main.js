window.addEventListener('DOMContentLoaded', (event) => {
        
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
        });
    }
})