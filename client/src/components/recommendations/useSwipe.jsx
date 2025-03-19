import {useRef, useState} from 'react';

export function useSwipe() {
	// const [touchStartX, setTouchStartX] = useState(null);
	// const [touchEndX, setTouchEndX] = useState(null);
	const touchStartX = useRef(null);
	const touchEndX = useRef(null);
	const [swipeProgress, setSwipeProgress] = useState(0);

	function handleTouchStart(like, dislike) {
		touchStartX.current = event.touches[0].clientX;
		touchEndX.current = null; // Reset
		setSwipeProgress(0);
	}

	function handleTouchMove(event) {
		touchEndX.current = event.touches[0].clientX;

		const swipeDistance = Math.abs(touchStartX.current - touchEndX.current);
		const minSwipeDistance = 200;
		const progress = Math.min(swipeDistance * 2 / minSwipeDistance, 3);
		setSwipeProgress(progress);
	}

	function handleTouchEnd(swipeFunction) {
		if (touchStartX.current === null || touchEndX.current === null) return;

		const swipeDistance = touchStartX.current - touchEndX.current;
		const minSwipeDistance = 220; // Minimum distance to be considered a swipe

		if (swipeDistance > minSwipeDistance) {
			// right to left swipe
			swipeFunction("like");
			console.log('like swipe');
		} else if (swipeDistance < -minSwipeDistance) {
			// left to right swipe
			swipeFunction("dislike");
			console.log('dislike swipe');
		}

		touchStartX.current = null;
		touchEndX.current = null;
		setSwipeProgress(0);

	}

	return {
		handleTouchStart,
		handleTouchEnd,
		handleTouchMove,
		swipeProgress
	}
}

