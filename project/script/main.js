function reveal() {

    if (window.scrollY > 200) {
        document.getElementById("back-to-top").style.display = "flex";
    } else {
        document.getElementById("back-to-top").style.display = "none";
    }

    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", reveal);

window.addEventListener("scroll", function () {
    // take #hero and zoom the background image with vanilla js
    var scroll = window.scrollY;
    var hero = document.getElementById("hero");
    hero.style.backgroundSize = 110 + scroll/8 + "%";
});

window.addEventListener("load", function () {
    const loader = document.querySelector("#loader");
    loader.className += " hidden";
});

const visionDefectDiv = document.getElementById('visionDefectDiv');
const visionDefectDropdown = document.getElementById('visionDefectDropdown');
const helpOnVisionDefects = document.getElementById('helpOnVisionDefects');
const dialog = document.getElementById('visionInfoDialog');

visionDefectDiv.addEventListener('click', function() {
    if (visionDefectDropdown.classList.contains('w-0')) {
        visionDefectDropdown.classList.remove('w-0');
        visionDefectDropdown.classList.add('w-32');
        helpOnVisionDefects.classList.remove('hidden');
        helpOnVisionDefects.classList.add('flex');
    }
    // } else {
    //     visionDefectDropdown.classList.remove('w-fit');
    //     visionDefectDropdown.classList.add('w-0');
    // }
});

visionDefectDropdown.addEventListener('change', function() {
    visionDefectDropdown.classList.remove('w-32');
    visionDefectDropdown.classList.add('w-0');
    helpOnVisionDefects.classList.remove('flex');
    helpOnVisionDefects.classList.add('hidden');
});

helpOnVisionDefects.addEventListener('mouseenter', function() {
    dialog.classList.remove('hidden');
});

helpOnVisionDefects.addEventListener('mouseleave', function() {
    document.getElementById('visionInfoDialog').classList.add('hidden');
});