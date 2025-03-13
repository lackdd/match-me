import {useRef, useState} from 'react';

export function useSwipe(onLike, onDislike) {
	// const [touchStartX, setTouchStartX] = useState(null);
	// const [touchEndX, setTouchEndX] = useState(null);
	const touchStartX = useRef(null);
	const touchEndX = useRef(null);

	function handleTouchStart(event, like, dislike) {
		touchStartX.current = event.touches[0].clientX;
		touchEndX.current = null; // Reset
	}

	function handleTouchMove(event) {
		touchEndX.current = event.touches[0].clientX;
	}

	function handleTouchEnd(event) {
		if (touchStartX.current === null || touchEndX.current === null) return;

		const swipeDistance = touchStartX.current - touchEndX.current;
		const minSwipeDistance = 50; // Minimum distance to be considered a swipe

		if (swipeDistance > minSwipeDistance) {
			// right to left swipe
			console.log('like swipe');
		} else if (swipeDistance < -minSwipeDistance) {
			// left to right swipe
			console.log('dislike swipe');
		}

		touchStartX.current = null;
		touchEndX.current = null;

	}

	return {
		handleTouchStart,
		handleTouchEnd,
		handleTouchMove
	}
}

