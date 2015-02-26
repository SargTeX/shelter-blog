var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if(!isMobile) {
	var bannerStart = -120, bannerScrollFactor = 0.9;
	function updateParallaxScroll(){
		var scrollY = document.body.scrollTop || document.documentElement.scrollTop;
		var bannerValue = bannerStart + bannerScrollFactor*scrollY;
		var banner = $('.banner');
		banner[0].style.backgroundPosition = 'center ' + bannerValue + 'px';
	}
	updateParallaxScroll();
	$(document).scroll(updateParallaxScroll);
	$(window).resize(updateParallaxScroll);
	console.log('lool');
}