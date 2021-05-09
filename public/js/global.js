const global = {
    init: () => {

        //to check when element get's position sticky
        const observer = new IntersectionObserver(function (entries) {
            if (entries[0].intersectionRatio === 0) {
                document.querySelector(`nav`).classList.add(`sticky`);
            } else if (entries[0].intersectionRatio === 1) {
                document.querySelector(`nav`).classList.remove(`sticky`);
            }
        }, {
            threshold: [0, 1]
        });


        observer.observe(document.querySelector(`#nav-container-top`));
    }
}

global.init();