/* 


<div class="top">
		<h1 class="hero-text">🧑‍🚀 Hello, Astronaut!</h1>
		<script>
			import { gsap } from "gsap";
			import { SplitText } from "gsap/SplitText";
			gsap.registerPlugin(SplitText);
			let split = SplitText.create(".hero-text", {type:"words,chars"});
			var tl = gsap.timeline();
			tl.from(split.chars, {duration: .5, opacity: 0, stagger: .125,  ease: 'power1. In'});
		</script>
	</div>
	
		
		
  --vanta-highlight: #002e31;
  --vanta-midtone: #35007b;
  --vanta-lowlight: #970046;
  --vanta-base: #080031;

*/