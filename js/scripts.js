// Back-to-top button
var btn = $('#back-to-top-button');

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
});



// Change the text interchangably "See More" and "See Less"
function toggleText(linkElement) {
    var collapseId = linkElement.getAttribute('href').substring(1);
    var collapseElement = document.getElementById(collapseId);

    $(collapseElement).on('hidden.bs.collapse', function () {
        linkElement.textContent = '... See More';
    });
    $(collapseElement).on('shown.bs.collapse', function () {
        linkElement.textContent = '... See Less';
    });
}

// Initialize the toggleText function for each link
document.querySelectorAll('[data-toggle="collapse"]').forEach(function (linkElement) {
    toggleText(linkElement);
});


// Scroll to top of a div based on its tag
function scrollToTopDiv(divTag) {
    $(divTag)[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}








var overlaybg = document.getElementById('overlay-bg');
var contactCardTrigger = document.getElementById('contact-card-trigger');

contactCardTrigger.onclick = function() {
    overlaybg.style.display = 'flex';
};

overlaybg.addEventListener('click', function(event) {
    if (event.target === overlaybg) {
        overlaybg.style.display = 'none';
    }
});


var filterButtonsProject = document.querySelectorAll('#filters-project .filter-button');
// Get all filter buttons and change their active status as user clicks


filterButtonsProject.forEach(function(filterButtonProject) {
    filterButtonProject.addEventListener('click', function() {
        filterButtonsProject.forEach(function(flrbtn) {
            flrbtn.classList.remove('active');
        });
        this.classList.add('active');
    });
});



// Function to update Isotope layout with smooth transitions
function updateLayout(collapseElement, isExpanding) {
    
    // Initialize Isotope with vertical layout
    var iso = new Isotope('#projects', {
        itemSelector: '.project',
        layoutMode: 'vertical'
    });

    if (isExpanding) {
        $(collapseElement).css('display', 'none');
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', '');
            iso.arrange();
        }, 300);
    } else {
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', 'none');
            iso.arrange();
        }, 300);
    }
}


// Bind updateLayout function to the collapsible elements' events
$('.collapse').on('show.bs.collapse', function () {
    updateLayout(this, true);
}).on('hide.bs.collapse', function () {
    updateLayout(this, false);
});


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault = 15;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var filterAtribute = 'data-filter';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';
var $projects = $('#projects').isotope({
    itemcategory: '.project',
    layoutMode: 'vertical'
});


// Filter based on input category
function filterCategoryProjects(category) {
    $projects.isotope({
        filter: category
    });
}


// Determine items to be categorized and displayed per page
function showPageProjects(n) {
    currentPage = n;
    var category = '.project';
        category += ( currentFilter != '*' ) ? '[' + filterAtribute + '~="' + currentFilter + '"]' : '';
        category += '[' + pageAtribute + '="' + currentPage+'"]';
    filterCategoryProjects(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerProjects() {
    var $isotopePager = ($('.' + pagerClass).length == 0 ) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
    $isotopePager.html('');

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage > 1) {
            showPageProjects(currentPage - 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === 1) {
        $previous.prop('disabled', true);
    }
    
    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage < currentNumberPages) {
            showPageProjects(currentPage + 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === currentNumberPages) {
        $next.prop('disabled', true);
    }

    var $currentPageIndicator = $('<span class="current-page">&nbsp; page ' + currentPage + ' of ' + currentNumberPages + ' &nbsp; </span>');
    
    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $projects.after($isotopePager);
}


// Set pagination
function setPaginationProjects() {
    var SettingsPagesOnItems = function() {
        var itemsLength = $projects.children('.project').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault);
        var item = 1;
        var page = 1;
        var category = '.project';
            category += ( currentFilter != '*' ) ? '[' + filterAtribute + '~="' + currentFilter + '"]' : '';
        
        $projects.children(category).each(function() {
            if (item > itemsPerPageDefault) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute, page);
            item++;
        });
        currentNumberPages = page;
    }();

    updatePagerProjects();
}


function initializeIsotopeProjects() {
    // Set number of pages, return to first page,
    setPaginationProjects();
    showPageProjects(1);


    // Filter projects based on category, including change active buttons, filter projects, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-project .filter-button').click(function() {
        $('#filters-project .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter = filter;
        setPaginationProjects();
        showPageProjects(1);
        updatePagerProjects();
    });
}

var currentFilterTalks = 'invited-talk';

var $talks = $('#talks').isotope({
    itemSelector: '.talk-card',
    layoutMode: 'vertical'
});

$talks.on('arrangeComplete', function() {
    recolorTalkCards();
});

function filterTalks(filter) {

    var category = (filter === '*')
        ? '*'
        : '.talk-card[data-filter~="' + filter + '"]';

    $talks.isotope({
        filter: category
    });
}

function recolorTalkCards() {

    var filteredTalks = $talks.isotope('getFilteredItemElements');

    $('#talks .talk-card').removeClass('talk-card-a talk-card-b');

    $(filteredTalks).each(function(index) {
        $(this).addClass(index % 2 === 0 ? 'talk-card-a' : 'talk-card-b');
    });
}

function initializeIsotopeTalks() {

    // Invited talks are the default
    filterTalks(currentFilterTalks);

    $('#filters-talks .filter-button').click(function() {

        $('#filters-talks .filter-button').removeClass('active');
        $(this).addClass('active');

        currentFilterTalks = $(this).attr('data-filter');

        filterTalks(currentFilterTalks);
    });
}




// // Guarantee correct layouts when all web resources are fully loaded 
$(document).ready(function() {
    var Images = $('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').get();
    var imageLoadPromises = Images.map(function(img) {
        return new Promise(function(resolve) {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        });
    });

    Promise.all(imageLoadPromises).then(function() {
        initializeIsotopeProjects();
        initializeIsotopeTalks();
    });
});



// Automatically update year in footer
// document.getElementById("currentYear").textContent = new Date().getFullYear();




