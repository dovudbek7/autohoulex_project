document.querySelectorAll('.phone_number').forEach(function (input) {
    input.addEventListener('input', function (e) {
        var input = e.target.value.replace(/\D/g, '');
        var formattedInput = input;

        if (input.length > 0) {
            formattedInput = '(' + input.substring(0, 3);
        }
        if (input.length >= 4) {
            formattedInput += ') ' + input.substring(3, 6);
        }
        if (input.length >= 7) {
            formattedInput += '-' + input.substring(6, 10);
        }

        e.target.value = formattedInput;
    });
});
$(document).ready(function () {
    $(".log-in").click(function () {
        $(".panel_call").animate({width: 'toggle'}, 350)
        return false;
    })
});

function displayNames(value) {
    input.value = value;
    removeElements();
}

$(".tab").css("display", "none");
$("#tab-1").css("display", "block");

function run(hideTab, showTab) {
    if (hideTab < showTab) {
        var currentTab = $('#tab-' + hideTab);
        var inputs = $(currentTab).find("input, select");
        var isValid = true;

        inputs.each(function () {
            var $this = $(this);
            var isRequired = $this.prop('required');
            var value = $this.val().trim();

            if (isRequired && !value) {
                $this.addClass('invalid').removeClass('valid');
                isValid = false;
            } else {
                $this.removeClass('invalid').addClass('valid');
            }
        });

        if (!isValid) {
            return false;
        }
    }

    $('#model').removeAttr('disabled');
    $('#year').removeAttr('disabled');

    // Update tab display
    $("#tab-" + hideTab).hide();
    $("#tab-" + showTab).show();

    for (let i = 1; i < showTab; i++) {
        $("#step-" + i).css("opacity", "1");
    }
}


$("input, select").on("input change", function () {
    var $this = $(this);
    var isRequired = $this.prop('required');
    var value = $this.val().trim();

    if (isRequired && value === '') {
        $this.addClass('invalid').removeClass('valid');
    } else {
        $this.removeClass('invalid').addClass('valid');
    }
});
$(document).ready(function () {
    function run(hideTab, showTab) {
        if (hideTab < showTab) {
            var currentTab = $('#tab-' + hideTab);
            var inputs = $(currentTab).find("input, select");
            var isValid = true;

            inputs.each(function () {
                var $this = $(this);
                var isRequired = $this.prop('required');
                var value = $this.val().trim();

                if (isRequired && value === '') {
                    $this.addClass('invalid').removeClass('valid');
                    isValid = false;
                } else {
                    $this.removeClass('invalid').addClass('valid');
                }
            });

            if (!isValid) {
                return false;
            }
        }

        $('#model').removeAttr('disabled');
        $('#year').removeAttr('disabled');

        $("#tab-" + hideTab).hide();
        $("#tab-" + showTab).show();

        for (let i = 1; i < showTab; i++) {
            $("#step-" + i).css("opacity", "1");
        }
    }

    function fetchSuggestions(url, inputId, suggestionsId, additionalData = {}) {
        var inputValue = $(inputId).val().trim();

        $.ajax({
            url: url, data: $.extend({'query': inputValue}, additionalData), success: function (data) {
                var suggestionsContainer = $(suggestionsId);
                suggestionsContainer.empty();

                data.suggestions.forEach(function (item) {
                    suggestionsContainer.append('<div class="autocomplete-suggestion" data-id="' + item.id + '">' + item.name + '</div>');
                });

                if (data.suggestions.length > 0) {
                    suggestionsContainer.show();
                } else {
                    suggestionsContainer.hide();
                }
            }, error: function () {
                console.error("Failed to fetch suggestions.");
            }
        });
    }

    function setupAutocomplete(inputId, suggestionsId, fetchUrl, relatedInputId = null) {
        $(inputId).on('focus', function () {
            $('.autocomplete-suggestions').not(suggestionsId).hide();

            if (relatedInputId) {
                var relatedInputValue = $(relatedInputId).val().trim();
                if (relatedInputValue) {
                    fetchSuggestions(fetchUrl, inputId, suggestionsId, {'related_id': $(relatedInputId).data('id')});
                } else {
                    $(suggestionsId).hide();
                }
            } else {
                fetchSuggestions(fetchUrl, inputId, suggestionsId);
            }
        });

        $(inputId).on('input', function () {
            if (relatedInputId) {
                var relatedInputValue = $(relatedInputId).val().trim();
                if (relatedInputValue) {
                    fetchSuggestions(fetchUrl, inputId, suggestionsId, {'related_id': $(relatedInputId).data('id')});
                }
            } else {
                fetchSuggestions(fetchUrl, inputId, suggestionsId);
            }
        });

        $(document).on('click', suggestionsId + ' .autocomplete-suggestion', function () {
            var selectedText = $(this).text();
            var selectedId = $(this).data('id');

            $(inputId).val(selectedText);
            $(inputId).data('id', selectedId);
            $(suggestionsId).hide();

            validateInput($(inputId));
        });

        $(document).on('click', function (event) {
            if (!$(event.target).closest('.autocomplete-container').length) {
                $('.autocomplete-suggestions').hide();
            }
        });
    }

    function validateInput($input) {
        var isRequired = $input.prop('required');
        var value = $input.val().trim();

        if (isRequired && value === '') {
            $input.addClass('invalid').removeClass('valid');
        } else {
            $input.removeClass('invalid').addClass('valid');
        }
    }

    setupAutocomplete('#make', '#make-suggestions', '{% url "auto:fetch_make" %}');

    setupAutocomplete('#model', '#model-suggestions', '{% url "auto:fetch_model" %}', '#make');

    setupAutocomplete('#year', '#year-suggestions', '{% url "auto:fetch_year" %}');

    $("input, select").on("input change", function () {
        validateInput($(this));
    });
});


function handleInput(inputElement, listId) {
    removeElements(listId);

    if (inputElement.value === "") {
        return;
    }

    for (let i of sortedNames) {
        if (i.toLowerCase().startsWith(inputElement.value.toLowerCase())) {
            let listItem = document.createElement("li");
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayNames('" + i + "', '" + inputElement.id + "')");

            let word = "<b>" + i.substr(0, inputElement.value.length) + "</b>";
            word += i.substr(inputElement.value.length);

            listItem.innerHTML = word;

            document.getElementById(listId).appendChild(listItem);
        }
    }
}

function displayNames(value, inputId) {
    document.getElementById(inputId).value = value;
    removeElements(inputId === "pickup_input" ? "pickup_list" : "delivery_list");
}
function removeElements(listId) {
    let listElement = document.getElementById(listId);
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
}


// swiper Params
var sliderSelector = '.swiper-container', options = {
    init: false, loop: true, speed: 800, slidesPerView: 2,
    // spaceBetween: 10,
    centeredSlides: true, effect: 'coverflow',
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    }, grabCursor: true, parallax: true, pagination: {
        el: '.swiper-pagination', clickable: true,
    }, navigation: {
        nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',
    }, breakpoints: {
        1023: {
            slidesPerView: 1, spaceBetween: 0
        }
    },
    on: {
        imagesReady: function () {
            this.el.classList.remove('loading');
        }
    }
};
var mySwiper = new Swiper(sliderSelector, options);

mySwiper.init();


$(document).ready(function () {
    $('.reviews-slider').slick({
        infinite: true, slidesToShow: 3, slidesToScroll: 1, autoplay: true, autoplaySpeed: 2000, arrows: false,  // Keeps the arrows
        dots: false,
        responsive: [{
            breakpoint: 1024, settings: {
                slidesToShow: 2, slidesToScroll: 1
            }
        }, {
            breakpoint: 600, settings: {
                slidesToShow: 1, slidesToScroll: 1
            }
        }]
    });
});

$(document).ready(function () {
    $('.clients-wrapper').each(function () {
        $(this).slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
            dots: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
    });
});
