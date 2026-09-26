/* =========================================================
   GLOBAL WEBSITE LAYOUT
   ========================================================= */


/* ---------------------------------------------------------
   LOAD HTML COMPONENT
   --------------------------------------------------------- */

async function loadComponent(
    target,
    component
) {

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


        /* Tell the rest of the website
           that the component is ready */

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

        console.error(error);

    }

}


/* ---------------------------------------------------------
   LOAD HEADER
   --------------------------------------------------------- */

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
   THEME SYSTEM
   ========================================================= */


function getStoredTheme() {

    return (
        localStorage.getItem(
            "website-theme"
        ) || "system"
    );

}


function getSystemTheme() {

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";

}


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


    const icon =
        document.getElementById(
            "globalThemeIcon"
        );


    if (!icon) return;


    if (theme === "dark") {

        icon.textContent = "☾";

    }

    else if (theme === "light") {

        icon.textContent = "☀";

    }

    else {

        icon.textContent = "◐";

    }

}


/* Initial theme */

applyGlobalTheme(
    getStoredTheme()
);


/* ---------------------------------------------------------
   THEME BUTTON
   --------------------------------------------------------- */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component
                .includes("header.html")
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


                applyGlobalTheme(next);

            }
        );

    }
);


/* ---------------------------------------------------------
   SYSTEM THEME CHANGE
   --------------------------------------------------------- */

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
   MOBILE NAVIGATION
   ========================================================= */

document.addEventListener(
    "componentLoaded",
    event => {

        if (
            !event.detail.component
                .includes("header.html")
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
   KEYBOARD SEARCH
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


            document.dispatchEvent(
                new CustomEvent(
                    "openSiteSearch"
                )
            );

        }

    }
);