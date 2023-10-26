const run = () => {
  const TITLE_WHEN_CLOSED = "Expand";
  const TITLE_WHEN_OPEN = "OPEN";

  const requestAnimationFrame = getAnimationFrame();
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
run();
