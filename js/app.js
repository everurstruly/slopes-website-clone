
// DOC ELEMENTS DECLARATIONS
let HTML_BODY;
let NAVBAR_TOGGLER;
let TOGGLE_TOGGLERS;
let OFF_TOGGLERS;

const TOGGLE_ON_ATTR = 'data-toggle-on';
const E_BACKGROUND_DISPLAYING_ATTR = 'data-e-background-displaying';

// HELPER FUNCTIONS
function elTogglerOn(el) {
	if (el.dataset.toggleOn === 'true') 
		return true;
	return false;
}

// GET STATE (elements) FUNCITONS
function getEBackgroundDisplaying() {
	return HTML_BODY.getAttribute(E_BACKGROUND_DISPLAYING_ATTR);
}

// SET STATE (elements) FUNCTIONS
function setTogglerOnState(togglerEl, togglerSwitch) {
	if (typeof togglerSwitch !== 'boolean') return;
	togglerEl.setAttribute(TOGGLE_ON_ATTR, togglerSwitch);
}

function setCarouselSLidePosition(carouselEl, toSlideItemValue, allowTransition) {
	const { orientation, currentSlideItem } = carouselEl.dataset;
	const SLIDE_ITEMS = carouselEl.querySelectorAll('.carousel__slide-item');

	let slideByItemIndex = 0;
	const slideByItemMinValue = 0;
	const slideByItemMaxValue = SLIDE_ITEMS.length;
	const slideByWidth = SLIDE_ITEMS[0].clientWidth;
	const slideByHeight = SLIDE_ITEMS[0].clientHeight;

	let willTransition = allowTransition;

	if (toSlideItemValue > slideByItemMaxValue) {
		slideByItemIndex = slideByItemMinValue;
	} else if (toSlideItemValue < slideByItemMinValue) {
		slideByItemIndex = slideByItemMaxValue;
	} else {
		slideByItemIndex = toSlideItemValue-1;
	}

	const translateDuration = (willTransition === false) ? '0ms' : '620ms';
	const translateValue = (orientation === 'y') 
		? `${(-1 * slideByHeight * slideByItemIndex)}px`
		: `${(-1 * slideByWidth * slideByItemIndex)}px`;

	carouselEl.style.setProperty('--slide-translate-duration', translateDuration);
	carouselEl.style.setProperty('--slide-translate-by', translateValue);
	carouselEl.setAttribute('data-current-slide-item', slideByItemIndex+1);
}

// UPDATE STATE (elements) FUNCTIONS
function updateEBackgroundDisplayingId() {
	let id = 2;
	id = (!elTogglerOn(NAVBAR_TOGGLER)) ? 1 : 2;
	HTML_BODY.setAttribute(E_BACKGROUND_DISPLAYING_ATTR, id);
}

// HANDLE EVENT FUNCTIONS
const handleToggleToggler = (e) => {
	const EL = e.currentTarget;

	if (elTogglerOn(EL)) {
		setTogglerOnState(EL, false);
	} else {
		setTogglerOnState(EL, true);
	}
}

const handleCarouselControl = (e) => {
	const EL = e.currentTarget;
	let directionValue = 0;

	if (EL.dataset.controlsPrev) directionValue = -1;
	if (EL.dataset.controlsNext) directionValue = +1;

	const CAROUSEL = EL.closest('.carousel');
	const { currentSlideItem } = CAROUSEL.dataset;
	const toSlideItem = Number(currentSlideItem) + directionValue;

	setCarouselSLidePosition(CAROUSEL, toSlideItem);
}

const handleHtmlBodyClicked = (e) => {
	const EL = e.target;
	console.log(EL)
	let clickedLink = (EL.closest('a')) ? true : false;

	if (clickedLink && elTogglerOn(NAVBAR_TOGGLER)) {
		setTogglerOnState(NAVBAR_TOGGLER, false);
	}
	updateEBackgroundDisplayingId();
}

const handleOffToggler = (e) => {
	console.log('clicking on toggle of button')
	const EL = e.currentTarget;
	const TARGET_SELECTOR = EL.dataset.targetSelector;
	const TOGGLER = document.querySelector(`.${TARGET_SELECTOR}`);
	setTogglerOnState(TOGGLER, false);
}

const handleNavbarToggler = (e) => {
	updateEBackgroundDisplayingId();
}

// INITIALIZE STATE (elements) FUNCTIONS
function initNavbarToggler() {
	if (getEBackgroundDisplaying() === '2') {
		setTogglerOnState(NAVBAR_TOGGLER, true);
	} else {
		setTogglerOnState(NAVBAR_TOGGLER, false);
	}
}

function initCarousel(el) {
	const SCREEN = el.querySelector('.carousel__screen');
	const SLIDE = el.querySelector('.carousel__slide');
	const SLIDE_ITEMS = el.querySelectorAll('.carousel__slide-item');
	const CONTROLS_BTNS = el.querySelectorAll('.carousel__controls-btn');
	const CURRENT_SLIDE_ITEM = Number(el.dataset.currentSlideItem);

	SCREEN.classList.add('carousel__screen_noScroll');
	setCarouselSLidePosition(el, CURRENT_SLIDE_ITEM, false);

	CONTROLS_BTNS.forEach(control => {
		if (control.dataset.controlsPrev === '') {
			control.setAttribute('data-controls-prev', 'true');
		}
		if (control.dataset.controlsNext === '') {
			control.setAttribute('data-controls-next', 'true');
		}
		control.addEventListener('click', handleCarouselControl);
	})
}

// +++++++++++++++++++++++++++++++++++++++++++++++
const startApp = (e) => {
	HTML_BODY = document.querySelector('body');
	CAROUSEL_01 = document.querySelector('.carousel');

	NAVBAR_TOGGLER = document.querySelector('.navbar__toggler');
	TOGGLE_TOGGLERS = document.querySelectorAll('[data-toggle-type="toggle"]');
	OFF_TOGGLERS = document.querySelectorAll('[data-toggle-type="toggleOff"]');

	initNavbarToggler();
	initCarousel(CAROUSEL_01);

	HTML_BODY.addEventListener('click', handleHtmlBodyClicked);
	NAVBAR_TOGGLER.addEventListener('click', handleNavbarToggler);
	TOGGLE_TOGGLERS.forEach(toggler => toggler.addEventListener('click', handleToggleToggler));
	OFF_TOGGLERS.forEach(toggler => toggler.addEventListener('click', handleOffToggler));
}

window.addEventListener('load', startApp);