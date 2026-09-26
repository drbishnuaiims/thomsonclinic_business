/* =========================================================
   GLOBAL WEBSITE ENGINE
   ========================================================= */


/* =========================================================
   COMPONENT LOADER
   ========================================================= */

async function loadComponent(target, component) {

    const element =
        document.querySelector(target);

    if (!element) return;

    try {

        const response =
            await fetch(component);

        if (!response.ok) {

            throw new Error(
                `Unable to load ${component}`
            );

        }

        element.innerHTML =
            await response.text();

        document.dispatchEvent(
            new CustomEvent(
                "componentLoaded",
                {
                    detail: {
                        component: component
                    }
                }
            )
        );

    }

    catch (error) {

        console.error(
            "Component error:",
            error
        );

    }

}


/* =========================================================
   LOAD GLOBAL COMPONENTS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadComponent(
            "#global-header",
            "/components/header.html"
        );

        loadComponent(
            "#global-footer",
            "/components/footer.html"
        );

    }
);


/* =========================================================
   ADVANCED APPEARANCE ENGINE
   ========================================================= */


/* ---------------------------------------------------------
   GET SAVED THEME
   --------------------------------------------------------- */

function getStoredTheme() {

    return (
        localStorage.getItem(
            "website-theme"
        ) || "system"
    );

}


/* ---------------------------------------------------------
   GET SYSTEM THEME
   --------------------------------------------------------- */

function getSystemTheme() {

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";

}


/* ---------------------------------------------------------
   APPLY THEME
   --------------------------------------------------------- */

function applyGlobalTheme(theme) {

    const root =
        document.documentElement;


    if (theme === "system") {

        root.removeAttribute(
            "data-theme"
        );

    }

    else {

        root.setAttribute(
            "data-theme",
            theme
        );

    }


    updateAppearanceUI(
        theme
    );

}


/* ---------------------------------------------------------
   UPDATE ICON
   --------------------------------------------------------- */

function updateThemeIcon(theme) {

    const icon =
        document.getElementById(
            "globalThemeIcon"
        );


    if (!icon) return;


    if (theme === "light") {

        icon.textContent = "☀";

    }

    else if (theme === "dark") {

        icon.textContent = "☾";

    }

    else {

        icon.textContent = "◐";

    }

}


/* ---------------------------------------------------------
   UPDATE POPOVER
   --------------------------------------------------------- */

function updateAppearanceUI(
    theme
) {

    updateThemeIcon(
        theme
    );


    document
        .querySelectorAll(
            ".appearance-option"
        )
        .forEach(option => {

            option.classList.toggle(
                "selected",
                option.dataset.themeChoice ===
                theme
            );

        });


    const label =
        document.getElementById(
            "currentAppearanceLabel"
        );


    if (!label) return;


    if (theme === "light") {

        label.textContent =
            "Light";

    }

    else if (theme === "dark") {

        label.textContent =
            "Dark";

    }

    else {

        label.textContent =
            "System";

    }

}


/* ---------------------------------------------------------
   INITIAL THEME
   --------------------------------------------------------- */

applyGlobalTheme(
    getStoredTheme()
);


/* =========================================================
   APPEARANCE POPOVER
   ========================================================= */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component.includes(
                "header.html"
            )
        ) {

            return;

        }


        const button =
            document.getElementById(
                "globalThemeButton"
            );


        const popover =
            document.getElementById(
                "appearancePopover"
            );


        if (
            !button ||
            !popover
        ) {

            return;

        }


        /* Open / close */

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const isOpen =
                    popover.classList.toggle(
                        "open"
                    );


                button.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );


        /* Theme options */

        document
            .querySelectorAll(
                ".appearance-option"
            )
            .forEach(option => {

                option.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const theme =
                            option.dataset
                                .themeChoice;


                        localStorage.setItem(
                            "website-theme",
                            theme
                        );


                        applyGlobalTheme(
                            theme
                        );


                        popover.classList.remove(
                            "open"
                        );


                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });


        /* Click outside */

        document.addEventListener(
            "click",
            event => {

                if (
                    !popover.contains(
                        event.target
                    ) &&
                    !button.contains(
                        event.target
                    )
                ) {

                    popover.classList.remove(
                        "open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }
);


/* =========================================================
   SYSTEM THEME CHANGES
   ========================================================= */

window.matchMedia(
    "(prefers-color-scheme: dark)"
).addEventListener(
    "change",
    () => {

        if (
            getStoredTheme() === "system"
        ) {

            applyGlobalTheme(
                "system"
            );

        }

    }
);

/* =========================================================
   THEME BUTTON
   ========================================================= */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component.includes(
                "header.html"
            )
        ) {

            return;

        }


        const button =
            document.getElementById(
                "globalThemeButton"
            );


        if (!button) return;


        button.addEventListener(
            "click",
            () => {

                const current =
                    getStoredTheme();

                let next;


                if (
                    current === "system"
                ) {

                    next = "dark";

                }

                else if (
                    current === "dark"
                ) {

                    next = "light";

                }

                else {

                    next = "system";

                }


                localStorage.setItem(
                    "website-theme",
                    next
                );


                applyGlobalTheme(
                    next
                );

            }
        );

    }
);


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component.includes(
                "header.html"
            )
        ) {

            return;

        }


        const button =
            document.getElementById(
                "mobileMenuButton"
            );


        const navigation =
            document.getElementById(
                "mobileNavigation"
            );


        if (
            !button ||
            !navigation
        ) {

            return;

        }


        button.addEventListener(
            "click",
            () => {

                navigation.classList.toggle(
                    "open"
                );

                button.classList.toggle(
                    "active"
                );

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navigation.classList.remove(
                            "open"
                        );

                        button.classList.remove(
                            "active"
                        );

                    }
                );

            });

    }
);


/* =========================================================
   SEARCH ENGINE
   ========================================================= */

let searchIndex = [];

let selectedResult = -1;


/* ---------------------------------------------------------
   LOAD SEARCH INDEX
   --------------------------------------------------------- */

async function loadSearchIndex() {

    try {

        const response =
            await fetch(
                "/data/search-index.json"
            );


        if (!response.ok) {

            throw new Error(
                "Search index unavailable"
            );

        }


        searchIndex =
            await response.json();


    }

    catch (error) {

        console.error(
            "Search index error:",
            error
        );

        searchIndex = [];

    }

}


loadSearchIndex();


/* =========================================================
   CREATE SEARCH UI
   ========================================================= */

function createSearchInterface() {

    if (
        document.getElementById(
            "globalSearchOverlay"
        )
    ) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "globalSearchOverlay";


    overlay.className =
        "global-search-overlay";


    overlay.innerHTML = `

        <div class="global-search-panel">

            <div class="global-search-input-row">

                <span class="global-search-icon">
                    ⌕
                </span>

                <input
                    id="globalSearchInput"
                    class="global-search-input"
                    type="search"
                    placeholder="Search this website..."
                    autocomplete="off"
                    spellcheck="false"
                >

                <button
                    class="search-close-button"
                    id="searchCloseButton">

                    ESC

                </button>

            </div>


            <div
                class="search-meta"
                id="searchMeta">

                Search pages, articles and resources

            </div>


            <div
                class="global-search-results"
                id="globalSearchResults">

            </div>


            <div class="search-footer">

                <span>
                    ↑ ↓ Navigate
                </span>

                <span>
                    ↵ Open
                </span>

                <span>
                    ESC Close
                </span>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    initialiseSearchEvents();

}


/* =========================================================
   OPEN SEARCH
   ========================================================= */

function openGlobalSearch() {

    createSearchInterface();


    const overlay =
        document.getElementById(
            "globalSearchOverlay"
        );


    const input =
        document.getElementById(
            "globalSearchInput"
        );


    overlay.classList.add(
        "active"
    );


    document.body.classList.add(
        "search-open"
    );


    selectedResult = -1;


    setTimeout(
        () => input.focus(),
        50
    );


    renderSearchResults("");

}


/* =========================================================
   CLOSE SEARCH
   ========================================================= */

function closeGlobalSearch() {

    const overlay =
        document.getElementById(
            "globalSearchOverlay"
        );


    if (!overlay) return;


    overlay.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "search-open"
    );


    const input =
        document.getElementById(
            "globalSearchInput"
        );


    if (input) {

        input.value = "";

    }


    selectedResult = -1;

}


/* =========================================================
   SEARCH ALGORITHM
   ========================================================= */

function performSearch(query) {

    query =
        query
            .toLowerCase()
            .trim();


    if (!query) {

        return searchIndex.slice(0, 8);

    }


    const terms =
        query
            .split(/\s+/)
            .filter(Boolean);


    const results =
        searchIndex
            .map(item => {

                const title =
                    item.title
                        .toLowerCase();

                const description =
                    item.description
                        .toLowerCase();

                const keywords =
                    (
                        item.keywords || []
                    )
                    .join(" ")
                    .toLowerCase();


                let score = 0;


                terms.forEach(term => {

                    if (
                        title === term
                    ) {

                        score += 100;

                    }

                    else if (
                        title.includes(term)
                    ) {

                        score += 50;

                    }


                    if (
                        keywords.includes(term)
                    ) {

                        score += 25;

                    }


                    if (
                        description.includes(term)
                    ) {

                        score += 10;

                    }

                });


                return {
                    ...item,
                    score
                };

            })

            .filter(
                item => item.score > 0
            )

            .sort(
                (a, b) =>
                    b.score - a.score
            );


    return results.slice(0, 12);

}


/* =========================================================
   HIGHLIGHT SEARCH TERM
   ========================================================= */

function highlightText(
    text,
    query
) {

    if (!query) return text;


    const escaped =
        query.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            `(${escaped})`,
            "gi"
        );


    return text.replace(
        regex,
        "<mark>$1</mark>"
    );

}


/* =========================================================
   RENDER RESULTS
   ========================================================= */

function renderSearchResults(
    query
) {

    const resultsContainer =
        document.getElementById(
            "globalSearchResults"
        );


    const meta =
        document.getElementById(
            "searchMeta"
        );


    if (!resultsContainer) return;


    const results =
        performSearch(query);


    selectedResult = -1;


    if (!query) {

        meta.textContent =
            "Search pages, articles and resources";

    }

    else {

        meta.textContent =
            `${results.length} result${
                results.length === 1
                    ? ""
                    : "s"
            }`;

    }


    if (!results.length) {

        resultsContainer.innerHTML = `

            <div class="search-empty">

                <div class="search-empty-icon">
                    ⌕
                </div>

                <strong>
                    No results found
                </strong>

                <span>
                    Try another search term.
                </span>

            </div>

        `;

        return;

    }


    resultsContainer.innerHTML =
        results
            .map(
                (item, index) => `

                <a
                    href="${item.url}"
                    class="global-search-result"
                    data-index="${index}">

                    <div class="result-leading-icon">

                        ${
                            item.category === "Articles"
                                ? "≡"
                                : item.category === "Resources"
                                    ? "◈"
                                    : "◌"
                        }

                    </div>


                    <div class="result-content">

                        <div class="result-title">

                            ${highlightText(
                                item.title,
                                query
                            )}

                        </div>


                        <div class="result-description">

                            ${highlightText(
                                item.description,
                                query
                            )}

                        </div>

                    </div>


                    <div class="result-category">

                        ${item.category}

                    </div>

                </a>

            `
            )
            .join("");


    resultsContainer
        .querySelectorAll(
            ".global-search-result"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    saveRecentSearch(
                        query
                    );

                }
            );

        });

}


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

function navigateSearch(
    direction
) {

    const results =
        [
            ...document.querySelectorAll(
                ".global-search-result"
            )
        ];


    if (!results.length) return;


    selectedResult += direction;


    if (
        selectedResult < 0
    ) {

        selectedResult =
            results.length - 1;

    }


    if (
        selectedResult >=
        results.length
    ) {

        selectedResult = 0;

    }


    results.forEach(
        result =>
            result.classList.remove(
                "selected"
            )
    );


    const selected =
        results[selectedResult];


    selected.classList.add(
        "selected"
    );


    selected.scrollIntoView({
        block: "nearest"
    });

}


/* =========================================================
   SEARCH EVENTS
   ========================================================= */

function initialiseSearchEvents() {

    const overlay =
        document.getElementById(
            "globalSearchOverlay"
        );


    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const closeButton =
        document.getElementById(
            "searchCloseButton"
        );


    input.addEventListener(
        "input",
        event => {

            renderSearchResults(
                event.target.value
            );

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "ArrowDown"
            ) {

                event.preventDefault();

                navigateSearch(1);

            }


            else if (
                event.key === "ArrowUp"
            ) {

                event.preventDefault();

                navigateSearch(-1);

            }


            else if (
                event.key === "Enter"
            ) {

                const selected =
                    document.querySelector(
                        ".global-search-result.selected"
                    );


                if (selected) {

                    saveRecentSearch(
                        input.value
                    );

                    window.location.href =
                        selected.href;

                }

            }


            else if (
                event.key === "Escape"
            ) {

                closeGlobalSearch();

            }

        }
    );


    closeButton.addEventListener(
        "click",
        closeGlobalSearch
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeGlobalSearch();

            }

        }
    );

}


/* =========================================================
   SEARCH BUTTONS
   ========================================================= */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component.includes(
                "header.html"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".search-trigger, .mobile-search-trigger"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    openGlobalSearch
                );

            });

    }
);


/* =========================================================
   GLOBAL KEYBOARD SHORTCUT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            (event.metaKey ||
             event.ctrlKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            openGlobalSearch();

        }


        if (
            event.key === "Escape"
        ) {

            closeGlobalSearch();

        }

    }
);


/* =========================================================
   RECENT SEARCHES
   ========================================================= */

function saveRecentSearch(
    query
) {

    query =
        query.trim();


    if (!query) return;


    let searches =
        JSON.parse(
            localStorage.getItem(
                "recent-searches"
            ) || "[]"
        );


    searches =
        searches.filter(
            item => item !== query
        );


    searches.unshift(query);


    searches =
        searches.slice(0, 5);


    localStorage.setItem(
        "recent-searches",
        JSON.stringify(searches)
    );

}