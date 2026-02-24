import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ReactComponent as LeftArrow } from "../assets/svg/back.svg";
import { ReactComponent as RightArrow } from "../assets/svg/forward.svg";
import { throttle } from "lodash";

const Carousel = (props) => {
  const [state, setState] = useState({
    offset: 0,
    pos: 0,
    init: false,
    width: false,
    inView: false,
    cardsPerView: 0,
    wrapperWidth: 0,
    cardWidth: 0,
    max: 0,
  });

  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);

  const init = useCallback(() => {
    if (!state.inView) {
      return;
    }
    let carousel = carouselRef.current;
    let wrapper = wrapperRef.current;
    if (!carousel || !wrapper) return;

    let cards = carousel.getElementsByClassName("card");
    if (cards.length === 0) return;

    let exampleCard = cards[0];
    let style = exampleCard
      ? exampleCard.currentStyle || window.getComputedStyle(exampleCard)
      : null;
    let cardWidth = exampleCard
      ? exampleCard.offsetWidth + parseFloat(style.marginRight)
      : 0;
    let wrapperWidth = wrapper.offsetWidth;
    let cardsPerView = Math.floor(wrapperWidth / cardWidth);
    let max = carousel.scrollWidth - carousel.offsetWidth;

    setState((prev) => ({
      ...prev,
      cardsPerView: cardsPerView,
      wrapperWidth: wrapperWidth,
      cardWidth: cardWidth,
      init: true,
      width: carousel.offsetWidth,
      max: max,
    }));
  }, [state.inView]);

  const isInViewportRaw = () => {
    if (state.inView) {
      let page = document.querySelectorAll(".page-wrap")[0];
      if (page) page.removeEventListener("scroll", throttledIsInViewport);
      return;
    }
    let carousel = wrapperRef.current;
    if (!carousel) return;
    const top = carousel.getBoundingClientRect().top;
    const wH = window.innerHeight;
    if (top <= wH * 1.5) {
      setState((prev) => ({ ...prev, inView: true }));
    }
  };

  const throttledIsInViewport = useMemo(
    () => throttle(isInViewportRaw, 1000),
    [state.inView] // Re-create if inView changes to capture new state
  );

  const scrollRaw = () => {
    let carousel = carouselRef.current;
    if (!carousel) return;
    let position = carousel.scrollLeft;
    let max = carousel.scrollWidth - carousel.offsetWidth;
    setState((prev) => ({
      ...prev,
      width: carousel.offsetWidth,
      pos: position,
      max: max,
    }));
  };

  const throttledScroll = useMemo(() => throttle(scrollRaw, 1000), []);

  useEffect(() => {
    let page = document.querySelectorAll(".page-wrap")[0];
    if (page) {
      page.scrollTop = 0;
      page.addEventListener("scroll", throttledIsInViewport);
    }
    window.scrollTo(0, 0);
    
    window.addEventListener("resize", init);
    
    // Initial check
    throttledIsInViewport();

    return () => {
      window.removeEventListener("resize", init);
      if (page) page.removeEventListener("scroll", throttledIsInViewport);
    };
  }, [throttledIsInViewport, init]);

  // Trigger init when inView changes to true
  useEffect(() => {
    if (state.inView && !state.init) {
      init();
    }
  }, [state.inView, state.init, init]);

  // Trigger init on props change (simulating componentDidUpdate check)
  useEffect(() => {
     init();
  }, [props.children, init]);


  const next = () => {
    let carousel = carouselRef.current;
    if (!carousel) return;
    let scrollAmount = state.cardWidth * state.cardsPerView;
    let start = carousel.scrollLeft;
    let movement =
      Math.floor((start + scrollAmount) / state.cardWidth) * state.cardWidth;
    carousel.scrollTo({
      top: 0,
      left: movement,
      behavior: "smooth",
    });
  };

  const prev = () => {
    let carousel = carouselRef.current;
    if (!carousel) return;
    let scrollAmount = state.cardWidth * state.cardsPerView;
    let start = carousel.scrollLeft;
    let movement =
      Math.floor((start - scrollAmount) / state.cardWidth) * state.cardWidth;
    carousel.scrollTo({
      top: 0,
      left: movement,
      behavior: "smooth",
    });
  };

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        pos: state.pos,
        width: state.width ? state.width : 0,
      });
    }
    return child;
  });

  return (
    <div
      className={`carousel--wrap ${
        state.inView ? "visible" : "not-visible"
      }`}
      ref={wrapperRef}
    >
      <div className="carousel--controls">
        <div
          className={`carousel--controls--item carousel--prev ${
            state.pos > 0 ? "" : "disabled"
          }`}
          onClick={prev}
        >
          <LeftArrow />
        </div>
        <div
          className={`carousel--controls--item carousel--next ${
            state.pos < state.max ? "" : "disabled"
          }`}
          onClick={next}
        >
          <RightArrow />
        </div>
      </div>
      <div
        className={`carousel`}
        ref={carouselRef}
        onScroll={throttledScroll}
      >
        <div className="carousel--inner">{childrenWithProps}</div>
      </div>
    </div>
  );
};

export default Carousel;
