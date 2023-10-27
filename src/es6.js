const run = () => {
    const TITLE_WHEN_CLOSED = "EXPAND";
    const TITLE_WHEN_OPEN = "OPEN";

    const requestAnimationFrame = getAnimationFrame();

    const toggleSummary = (evt) => {
        // Prevent the text from being selected if rapidly clicked.
        evt.preventDefault();

        const summary = evt.target;
        const detail = findDetailFor(summary);

        if (!detail) {
            return;
        }

        // CSS Transitions don't work as expected on things set to 'display: none'. Make the
        // stretch details visible if needed, then use a timeout for the transition to take
        // effect.
        if (summary.classList.contains("stretchtext-open")) {
            detail.style.display = "none";
        } else {
            detail.style.display = isBlockLevelDetail(summary)
                ? "block"
                : "inline";
        }

        requestAnimationFrame(() => {
            summary.classList.toggle("stretchtext-open");
            detail.classList.toggle("stretchtext-open");

            if (summary.classList.contains("stretchtext-open")) {
                setTitle(summary, TITLE_WHEN_OPEN);
            } else {
                setTitle(summary, TITLE_WHEN_CLOSED);
            }
        });
    };
    const isLoadedCalled = false;

    const loaded = () => {
        if (isLoadedCalled) {
            return;
        }
        const summaries = getSummaries();

        summaries.forEach((summary) => {
            summary.setAttribute("title", TITLE_WHEN_CLOSED);

            summary.addEventListener("mousedown", toggleSummary);
            summary.addEventListener("touchstart", toggleSummary);

            summary.addEventListener("click", (e) => {
                e.preventDefault();
            });
        });
    };

    window.addEventListener("DOMContentLoaded", loaded);
    if (document.readyState == "complete") {
        loaded();
    }
};

const findDetailFor = (summary) => {
    if (isBlockLevelDetail(summary)) {
        const id = summary.getAttribute("href").replace(/^#/, "");
        const detail = document.getElementById(id);
        if (!detail && window.console) {
            console.error(`No StretchText details for element with ID: ${id}`);
        }
        return detail;
    } else {
        const detail = summary.nextElementSibling;
        if (!detail && window.console) {
            console.error(
                `No StretchText details element found for ${summary}`
            );
        }
        return detail;
    }
};

const isBlockLevelDetail = (summary) => {
    return summary.nodeName.toLowerCase() === "a";
};

/**
 * A custom implementation of requestAnimationFrame using setTimeout.
 *
 * @param {Function} callback - The function to be executed on the next animation frame.
 * @returns {number} - A timeout identifier for the scheduled callback.
 */
const customAnimationFrame = (callback) => {
    return window.setTimeout(callback, 1000 / 60);
};

/**
 * Provides a cross-browser compatible requestAnimationFrame function.
 *
 * This function attempts to find the native `requestAnimationFrame` function
 * or one of its vendor-specific counterparts. If none are available, it falls
 * back to a custom implementation using `setTimeout`.
 *
 * @param {Function} callback - The function to be executed on the next animation frame.
 * @returns {number} - A requestAnimationFrame identifier or a timeout identifier if the native function is not available.
 */
const getAnimationFrame = () => {
    const vendors = [
        "requestAnimationFrame",
        "webkitRequestAnimationFrame",
        "mozRequestAnimationFrame",
        "oRequestAnimationFrame",
        "msRequestAnimationFrame",
    ];

    for (const vendor of vendors) {
        if (window[vendor]) {
            // Return the first available vendor-specific or native requestAnimationFrame
            return window[vendor];
        }
    }

    // If no vendor-specific or native function is found, fall back to customAnimationFrame
    return customAnimationFrame;
};

/**
 * Get summaries from the document based on their attributes and CSS class.
 *
 * This function collects summaries from the document that match the specified criteria:
 * - Elements with the attribute 'epub-type' set to 'stretchsummary'.
 * - Elements with the CSS class 'stretchsummary'.
 *
 * @returns {Array<Element>} An array of summary elements that meet the criteria.
 */
const getSummaries = () => {
    const results = [];

    // epub-type
    const summariesEpub = document.querySelectorAll(
        '[epub-type="stretchsummary"]'
    );
    results.push(...summariesEpub);

    // CSS class.
    const summariesClass = document.getElementsByClassName("stretchsummary");
    results.push(...summariesClass);

    return results;
};

/**
 * Set the title attribute of an element if it doesn't already have one.
 *
 * This function checks if the specified element already has a 'title' attribute. If it does,
 * it does nothing. If not, it sets the 'title' attribute to the provided newTitle.
 *
 * @param {Element} summary - The element for which to set the 'title' attribute.
 * @param {string} newTitle - The new title to be set if the 'title' attribute is absent.
 */
const setTitle = (summary, newTitle) => {
    if (summary.hasAttribute("title")) {
        return;
    } else {
        summary.setAttribute("title", newTitle);
    }
};
run();

module.exports = { 
  setTitle
};
