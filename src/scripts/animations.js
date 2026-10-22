export const motion = {
  duration: 1,
  stagger: 0.08,
  distance: 40,
  mobileDistance: 20,
  ease: "power3.out",
  scrub: 0.6,
  textOpacity: 0.15,
  imageScale: 1.15,
  parallax: 8,
  smoothDuration: 1.1,
  bounceHeight: 8,
  bouncePause: 4,
  gallerySpeed: 36,
};

let disposeGallery = () => {};
function initializeGallery() {
  const viewport = document.querySelector("[data-gallery]");
  if (!viewport) return () => {};
  const track = viewport.querySelector(".gallery-track");
  const originals = [...track.children].filter(
    (item) => !item.hasAttribute("data-gallery-copy"),
  );
  track
    .querySelectorAll("[data-gallery-copy]")
    .forEach((item) => item.remove());
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  viewport.setAttribute("aria-label", mobile ? "Fotos de Priscila" : "Fotos de Priscila, com rolagem horizontal");
  if (mobile) {
    viewport.scrollLeft = 0;
    viewport.removeAttribute("tabindex");
    viewport.removeAttribute("data-lenis-prevent");
    viewport.classList.remove("is-dragging");
    return () => {};
  }
  viewport.setAttribute("tabindex", "0");
  viewport.setAttribute("data-lenis-prevent", "");
  if (originals.length < 2) return () => {};
  const listeners = new AbortController();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector("[data-gallery-toggle]");
  let cycle = 0,
    frame = 0,
    previousTime = 0,
    visible = false,
    paused = reduced.matches,
    focused = false,
    dragging = false,
    startX = 0,
    startScroll = 0,
    resumeAt = 0,
    position = viewport.scrollLeft,
    lastWritten = viewport.scrollLeft;
  {
    originals.forEach((item) => {
      const copy = item.cloneNode(true);
      copy.setAttribute("data-gallery-copy", "");
      copy.setAttribute("aria-hidden", "true");
      copy.inert = true;
      [copy, ...copy.querySelectorAll("*")].forEach((node) => {
        node.removeAttribute("id");
        node.removeAttribute("data-anim");
        node.removeAttribute("data-parallax");
        ["opacity", "transform", "clip-path"].forEach((property) =>
          node.style.removeProperty(property),
        );
      });
      track.append(copy);
    });
  }
  viewport
    .querySelectorAll("img")
    .forEach((image) => (image.draggable = false));
  const measure = () => {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    cycle =
      originals.length * (originals[0].getBoundingClientRect().width + gap);
  };
  const wrap = () => {
    if (!cycle) return;
    if (viewport.scrollLeft >= cycle) viewport.scrollLeft -= cycle;
    else if (viewport.scrollLeft < 0.5 && dragging)
      viewport.scrollLeft += cycle;
  };
  const resize = new ResizeObserver(measure);
  resize.observe(viewport);
  measure();
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
    },
    { threshold: 0.05 },
  );
  observer.observe(viewport);
  const tick = (time) => {
    const delta = previousTime ? Math.min(time - previousTime, 64) : 0;
    previousTime = time;
    if (
      visible &&
      !document.hidden &&
      !paused &&
      !focused &&
      !dragging &&
      time > resumeAt &&
      cycle
    ) {
      if (Math.abs(viewport.scrollLeft - lastWritten) > 1)
        position = viewport.scrollLeft;
      position = (position + (motion.gallerySpeed * delta) / 1000) % cycle;
      viewport.scrollLeft = position;
      lastWritten = viewport.scrollLeft;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  const buttonState = () => {
    if (!toggle) return;
    toggle.textContent = paused ? "Iniciar movimento" : "Pausar movimento";
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.hidden = false;
  };
  buttonState();
  toggle?.addEventListener(
    "click",
    () => {
      paused = !paused;
      buttonState();
    },
    { signal: listeners.signal },
  );
  viewport.addEventListener("focusin", () => (focused = true), {
    signal: listeners.signal,
  });
  viewport.addEventListener(
    "focusout",
    (event) => {
      if (!viewport.contains(event.relatedTarget)) focused = false;
    },
    { signal: listeners.signal },
  );
  viewport.addEventListener(
    "wheel",
    () => {
      resumeAt = performance.now() + 4000;
    },
    { passive: true, signal: listeners.signal },
  );
  viewport.addEventListener(
    "touchstart",
    () => {
      resumeAt = performance.now() + 6000;
    },
    { passive: true, signal: listeners.signal },
  );
  const step = (direction) => {
    resumeAt = performance.now() + 2500;
    wrap();
    if (!reduced.matches && direction < 0 && viewport.scrollLeft < 1)
      viewport.scrollLeft = cycle;
    viewport.scrollBy({
      left:
        direction *
        (originals[0].getBoundingClientRect().width +
          (parseFloat(getComputedStyle(track).gap) || 0)),
      behavior: reduced.matches ? "auto" : "smooth",
    });
  };
  document
    .querySelector("[data-gallery-prev]")
    ?.addEventListener("click", () => step(-1), { signal: listeners.signal });
  document
    .querySelector("[data-gallery-next]")
    ?.addEventListener("click", () => step(1), { signal: listeners.signal });
  viewport.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
      }
    },
    { signal: listeners.signal },
  );
  viewport.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    },
    { signal: listeners.signal },
  );
  viewport.addEventListener(
    "pointermove",
    (event) => {
      if (dragging) {
        viewport.scrollLeft = startScroll - (event.clientX - startX);
      }
    },
    { signal: listeners.signal },
  );
  const release = () => {
    dragging = false;
    viewport.classList.remove("is-dragging");
    resumeAt = performance.now() + 4000;
  };
  viewport.addEventListener("pointerup", release, { signal: listeners.signal });
  viewport.addEventListener("pointercancel", release, {
    signal: listeners.signal,
  });
  return () => {
    cancelAnimationFrame(frame);
    listeners.abort();
    observer.disconnect();
    resize.disconnect();
    track
      .querySelectorAll("[data-gallery-copy]")
      .forEach((item) => item.remove());
  };
}

let dispose = () => {};
let generation = 0;

async function initialize() {
  const current = ++generation;
  dispose();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] =
    await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("lenis"),
    ]);
  await document.fonts.ready;
  if (current !== generation || reducedMotion.matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 768px)",
      mobile: "(max-width: 767px)",
      motionAllowed: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      if (!context.conditions.motionAllowed) return;
      const desktop = context.conditions.desktop;
      const distance = desktop ? motion.distance : motion.mobileDistance;
      const splits = [];
      const listeners = new AbortController();
      const lenis = new Lenis({
        duration: motion.smoothDuration,
        easing: gsap.parseEase(motion.ease),
        smoothWheel: desktop,
        syncTouch: false,
        anchors: { offset: -120 },
        prevent: (element) => Boolean(element.closest(".mobile-nav nav")),
      });
      const tick = (time) => {
        if (!document.hidden) lenis.raf(time * 1000);
      };
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const entrance = (element) => ({
        trigger: element,
        start: "top 85%",
        once: true,
      });
      const canReveal = (element) => element.getBoundingClientRect().bottom > 0;

      document
        .querySelectorAll('[data-anim="text-fill"]')
        .forEach((element, index) => {
          if (index >= 3) return;
          const split = SplitText.create(element, {
            type: "words",
            aria: "auto",
          });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: motion.textOpacity },
            {
              opacity: 1,
              stagger: motion.stagger,
              ease: motion.ease,
              scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 45%",
                scrub: motion.scrub,
              },
            },
          );
        });

      document.querySelectorAll('[data-anim="lines"]').forEach((element) => {
        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "anim-line",
          aria: "auto",
          autoSplit: true,
          onSplit: (instance) => {
            if (!canReveal(element)) return;
            return gsap.from(instance.lines, {
              yPercent: 105,
              opacity: 0,
              duration: motion.duration,
              stagger: motion.stagger,
              ease: motion.ease,
              scrollTrigger: entrance(element),
              onComplete: () =>
                gsap.set(instance.lines, { clearProps: "transform,opacity" }),
            });
          },
        });
        splits.push(split);
      });

      document
        .querySelectorAll('[data-anim="img-reveal"]')
        .forEach((element) => {
          const image = element.querySelector("[data-anim-inner], img");
          if (
            !image ||
            element.closest(".hero, .service-hero") ||
            !canReveal(element)
          )
            return;
          const timeline = gsap.timeline({ scrollTrigger: entrance(element) });
          timeline
            .from(element, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: motion.duration,
              ease: motion.ease,
              onComplete: () => gsap.set(element, { clearProps: "clipPath" }),
            })
            .from(
              image,
              {
                scale: motion.imageScale,
                duration: motion.duration,
                ease: motion.ease,
              },
              0,
            );
          if (desktop && element.hasAttribute("data-parallax")) {
            gsap.fromTo(
              image,
              { yPercent: -motion.parallax / 2 },
              {
                yPercent: motion.parallax / 2,
                ease: motion.ease,
                scrollTrigger: {
                  trigger: element,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: motion.scrub,
                },
              },
            );
          }
        });

      const fade = (elements) => {
        const targets = elements.filter(canReveal);
        targets.forEach((element, index) => {
          gsap.from(element, {
            y: distance,
            opacity: 0,
            duration: motion.duration,
            delay: desktop ? (index % 4) * motion.stagger : 0,
            ease: motion.ease,
            scrollTrigger: entrance(element),
            onComplete: () =>
              gsap.set(element, { clearProps: "transform,opacity" }),
          });
        });
      };
      document.querySelectorAll("[data-anim-group]").forEach((group) => {
        const items = [
          ...group.querySelectorAll('[data-anim="fade-up"]'),
        ].filter((element) => element.closest("[data-anim-group]") === group);
        fade(items);
      });
      document.querySelectorAll('[data-anim="fade-up"]').forEach((element) => {
        if (!element.closest("[data-anim-group]")) fade([element]);
      });

      const contact = document.querySelector(".floating-contact");
      let bounce;
      if (contact) {
        bounce = gsap
          .timeline({ repeat: -1, repeatDelay: motion.bouncePause })
          .to(contact, {
            y: -motion.bounceHeight,
            duration: 0.4,
            ease: motion.ease,
          })
          .to(contact, { y: 0, duration: 0.4, ease: motion.ease });
        const pause = () => bounce.pause();
        const resume = () => {
          if (!document.hidden && !contact.matches(":hover, :focus-visible"))
            bounce.resume();
        };
        contact.addEventListener("mouseenter", pause, {
          signal: listeners.signal,
        });
        contact.addEventListener("mouseleave", resume, {
          signal: listeners.signal,
        });
        contact.addEventListener("focus", pause, { signal: listeners.signal });
        contact.addEventListener("blur", resume, { signal: listeners.signal });
        document.addEventListener(
          "visibilitychange",
          () => (document.hidden ? pause() : resume()),
          { signal: listeners.signal },
        );
      }
      ScrollTrigger.refresh();

      return () => {
        listeners.abort();
        bounce?.kill();
        gsap.ticker.remove(tick);
        lenis.destroy();
        splits.forEach((split) => split.revert());
      };
    },
  );
  dispose = () => media.revert();
}

const start = () => {
  disposeGallery();
  disposeGallery = initializeGallery();
  initialize().catch((error) => {
    dispose();
    console.error("Não foi possível iniciar as animações.", error);
  });
};
if (document.readyState !== "loading") start();
else document.addEventListener("DOMContentLoaded", start, { once: true });
window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .addEventListener("change", start);
document.addEventListener("astro:before-swap", () => {
  generation++;
  disposeGallery();
  dispose();
});
document.addEventListener("astro:page-load", start);
const galleryBreakpoint = window.matchMedia("(max-width: 767px)");
const updateGallery = () => {
  disposeGallery();
  disposeGallery = initializeGallery();
};
galleryBreakpoint.addEventListener("change", updateGallery);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    galleryBreakpoint.removeEventListener("change", updateGallery);
    generation++;
    disposeGallery();
    dispose();
  });
