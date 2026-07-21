"use client";
import * as React from "react";
import { useRef } from "react";

import {
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from "framer-motion";

interface ISmoothScrollHeroProps {
	/**
	 * Height of the scroll section in pixels
	 * @default 1500
	 */
	scrollHeight?: number;
	/**
	 * Background image URL for desktop view
	 */
	desktopImage?: string;
	/**
	 * Background image URL for mobile view
	 */
	mobileImage?: string;
	/**
	 * Initial clip path percentage
	 * @default 25
	 */
	initialClipPercentage?: number;
	/**
	 * Final clip path percentage
	 * @default 75
	 */
	finalClipPercentage?: number;
}

const SmoothScrollHero: React.FC<ISmoothScrollHeroProps> = ({
	scrollHeight = 1000,
	desktopImage = "/images/smooth_hero.jpg",
	mobileImage = "/images/smooth_hero.jpg",
	initialClipPercentage = 25,
	finalClipPercentage = 100, // Changed default to 100 to reveal full image
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	
	// Track scroll progress ONLY within this component's container
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"]
	});

	const clipStart = useTransform(
		scrollYProgress,
		[0, 1],
		[initialClipPercentage, 0],
	);
	const clipEnd = useTransform(
		scrollYProgress,
		[0, 1],
		[finalClipPercentage, 100],
	);

	const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

	const backgroundSize = useTransform(
		scrollYProgress,
		[0, 1],
		["130%", "100%"],
	);

	return (
		<div
			ref={containerRef}
			style={{ height: `calc(${scrollHeight}px + 100vh)` }}
			className="relative w-full bg-white"
		>
			<motion.div
				className="sticky top-0 h-screen w-full bg-white overflow-hidden"
				style={{
					clipPath,
					willChange: "transform, opacity",
				}}
			>
				{/* Mobile background */}
				<motion.div
					className="absolute inset-0 md:hidden"
					style={{
						backgroundImage: `url(${mobileImage})`,
						backgroundSize,
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				/>
				{/* Desktop background */}
				<motion.div
					className="absolute inset-0 hidden md:block"
					style={{
						backgroundImage: `url(${desktopImage})`,
						backgroundSize,
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				/>
			</motion.div>
		</div>
	);
};

export default SmoothScrollHero;
