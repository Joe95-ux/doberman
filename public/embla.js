const wrap = document.querySelectorAll(".embla");
const toscroll = document.querySelector(".toscroll");
const width = $(window).width()
let value;
if(width <= 830){
  value = 1;
}else{
  value = 2
}


if (wrap !== null) {
  const viewPort = Array.from(document.querySelectorAll(".embla__viewport"));
  viewPort.forEach((view) => {
    let embla = EmblaCarousel(view, {
      dragFree: true,
      containScroll: "trimSnaps",
      slidesToScroll: value,
      skipSnaps: false
    });

    const prevBtn = view.nextElementSibling;
    const nextBtn = view.nextElementSibling.nextElementSibling;

    const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
      prevBtn.addEventListener("click", embla.scrollPrev, false);
      nextBtn.addEventListener("click", embla.scrollNext, false);
    };
    setupPrevNextBtns(prevBtn, nextBtn, embla);
    const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
      return () => {
        if (embla.canScrollPrev()) prevBtn.removeAttribute("disabled");
        else prevBtn.setAttribute("disabled", "disabled");

        if (embla.canScrollNext()) nextBtn.removeAttribute("disabled");
        else nextBtn.setAttribute("disabled", "disabled");
      };
    };

    const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);

    embla.on("select", disablePrevAndNextBtns);
    embla.on("init", disablePrevAndNextBtns);
  });
}

