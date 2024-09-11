;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var mobileMenuOutsideClick = function() {
	};

	var offcanvasMenu = function() {
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('overflow offcanvas') ) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			
		}

	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};



	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};


	var counterWayPoint = function() {
		if ($('#fh5co-counter').length > 0 ) {
			$('#fh5co-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	var sliderMain = function() {
		
	  	$('#fh5co-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});

	  	$('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());	
	  	$(window).resize(function(){
	  		$('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());	
	  	});

	};

	
	$(function(){
		mobileMenuOutsideClick();
		offcanvasMenu();
		burgerMenu();
		contentWayPoint();
		sliderMain();
		dropdown();
		goToTop();
		loaderPage();
		counterWayPoint();
		fullHeight();
	});


}());

function loadChallenge() {
    fetch('json/films.json')
        .then(response => response.json())
        .then(challenges => {
            const today = new Date().toISOString().split('T')[0];
            const challenge = challenges[today];
            
            if (challenge) {
                document.getElementById('emoji-display').textContent = challenge.emoji;
                document.getElementById('guess-input').dataset.correctAnswer = challenge.answer.toLowerCase();
				document.getElementById('indice').dataset.correctAnswer = challenge.hint.toLowerCase();
            } else {
                document.getElementById('emoji-display').textContent = "Pas de défi disponible pour aujourd'hui.";
                document.getElementById('guess-input').disabled = true;
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des défis :', error);
        });
}

let wrongGuessCount = parseInt(localStorage.getItem('wrongGuessCount')) || 0;

document.getElementById('feedback').textContent = `${wrongGuessCount}`;

async function hashStringSHA256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

async function checkGuess() {
    const correctAnswer = document.getElementById('guess-input').dataset.correctAnswer;
    if (!correctAnswer) return;

    const userGuess = document.getElementById('guess-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const modal = document.getElementById('successModal');
    const attemptCount = document.getElementById('attempt-count');
    const hintButton = document.getElementById('indice'); 

    let wrongGuessCount = parseInt(localStorage.getItem('wrongGuessCount')) || 0;

	const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('storedDate');
    
    if (storedDate && storedDate !== today) {
        localStorage.clear();
    }

	localStorage.setItem('storedDate', today);

	const sha256 = await hashStringSHA256(userGuess);

	console.log(hashStringSHA256("harry potter"))

    if (sha256 === correctAnswer) {
        wrongGuessCount++; 
        feedback.textContent = `Bravo ! 🎉 après ${wrongGuessCount} tentatives.`;
        attemptCount.textContent = wrongGuessCount;
        
        document.querySelector('.modal-content h2').textContent = "Félicitations 🎉";
        document.querySelector('.modal-content p').innerHTML = `Vous avez trouvé la bonne réponse après <span id="attempt-count">${wrongGuessCount}</span> tentatives !`;

        modal.style.display = 'block'; 
    
        localStorage.setItem('challengeCompleted', 'true');
        localStorage.setItem('wrongGuessCount', 0);
        localStorage.setItem('headerHidden', 'true');
    
        document.querySelector('header').style.display = 'none';

    } else {
        wrongGuessCount++;
        localStorage.setItem('wrongGuessCount', wrongGuessCount);
        feedback.textContent = `❌ - ${wrongGuessCount}`;
    
        if (wrongGuessCount >= 5) {
            hintButton.style.pointerEvents = 'auto'; 
            hintButton.style.opacity = '1';          
        }
    }

    document.getElementById('guess-input').value = '';
}


function giveHint() {
    const correctAnswer = document.getElementById('indice').dataset.correctAnswer;
    if (!correctAnswer) return;

    const modal = document.getElementById('hintModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const hintLetter = document.getElementById('hint-letter');

    hintLetter.textContent = correctAnswer.charAt(0).toUpperCase(); 


    modal.style.display = 'block';

	closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}


function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date();
    
    endOfDay.setHours(24, 0, 0, 0); 
    const timeRemaining = endOfDay - now; 

    if (timeRemaining <= 0) {
        document.getElementById('date-display').textContent = "Temps écoulé!";
        return; 
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('date-display').textContent = `⏳ ${formattedTime} ⏳`;
}

function startCountdown() {
    updateCountdown(); 
    setInterval(updateCountdown, 1000); 
}

window.onload = function() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('storedDate');

    if (storedDate && storedDate !== today) {
        localStorage.clear();
    }

    localStorage.setItem('storedDate', today);
    startCountdown();
    loadChallenge();

    if (localStorage.getItem('headerHidden') === 'true') {
        document.querySelector('header').style.display = 'none';

        if (localStorage.getItem('challengeCompleted') === 'true') {            
            const modal = document.getElementById('successModal');
            document.querySelector('.modal-content p').textContent = "Rendez-vous demain pour le prochain défi !";
            const modalTitle = document.querySelector('#successModal .modal-content h2');
            modalTitle.style.display = 'none';
            document.querySelector('.modal-content h2').textContent = "👋👋👋";

            modalTitle.style.display = 'block';
            modal.style.display = 'block';
        }
    }
};

// localStorage.removeItem('headerHidden');  // Removes 'headerHidden' from localStorage
// localStorage.removeItem('wrongGuessCount');
// localStorage.clear();
