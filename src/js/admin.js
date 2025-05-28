function navigateTo(id) {
    hideAllSections();
    const currentSection = document.querySelector(id);
    currentSection.classList.add("active");
}

function hideAllSections() {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.classList.remove("active");
    })
}

function saveLastSection(id) {
    const key = "@lastSection";
    localStorage.setItem(key, id);
}

function loadLastSection() {
    const key = "@lastSection";
    const lastSection = localStorage.getItem(key) || null;
    hideAllSections();
    if(!lastSection) return;
    navigateTo(lastSection);
}

const links = document.querySelectorAll("a[href^='#']");
links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("href");
        navigateTo(id);
        saveLastSection(id);
    });
})

window.addEventListener("load", loadLastSection);