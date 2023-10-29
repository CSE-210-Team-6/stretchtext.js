const { setTitle, isBlockLevelDetail, getSummaries, findDetailFor, customAnimationFrame, getAnimationFrame, run } = require('../es6');

jest.useFakeTimers();

describe('Tests for setTitle', () => {
  test('Check setting title for element that does not have title attribute', () => {
    document.body.innerHTML = '<p id="test"></p>';
  
    const paragraph = document.getElementById('test');
  
    setTitle(paragraph, "Title");
  
    expect(paragraph.getAttribute("title")).toBe("Title");
  });
  
  test('Check setting title for element that already has a title attribute', () => {
    document.body.innerHTML = '<p id="test" title="Title"></p>';
  
    const paragraph = document.getElementById('test');
  
    setTitle(paragraph, "Title2");
  
    expect(paragraph.getAttribute("title")).toBe("Title");
  });
});

describe('Tests for isBlockLevelDetail', () => {
  test('Check that element is not a block level detail', () => {
    document.body.innerHTML = '<p id="test"></p>';
  
    const paragraph = document.getElementById('test');
  
    expect(isBlockLevelDetail(paragraph)).toBe(false);
  });
  
  test('Check that element is a block level detail', () => {
    document.body.innerHTML =
      '<div>' +
      ' <a id="stretch" href="#details">stretch</a>' +
      ' <aside id="details"></aside>' +
      '</div>';
    
    const aTag = document.getElementById('stretch');
  
    expect(isBlockLevelDetail(aTag)).toBe(true);
  });
});

describe('Tests for getSummaries', () => {
  test('Check that there are no summaries', () => {
    document.body.innerHTML =
      '<div>' +
      ' <a id="stretch" href="#details">stretch</a>' +
      ' <aside id="details"></aside>' +
      '</div>';
  
    const summaries = getSummaries();
  
    expect(summaries.length).toBe(0);
  });
  
  test('Check that there are summaries', () => {
    document.body.innerHTML = 
      '<h1>heading</h1>' +
      '<div>' +
      ' <span id="stretchsummaryhtml" epub-type="stretchsummary">html</span>' +
      ' <span id="stretchsummarycss" class="stretchsummary">css</span>'
      '</div>';
    
    const htmlStretchSummary = document.getElementById("stretchsummaryhtml");
    const cssStretchSummary = document.getElementById("stretchsummarycss");
    const expectedSummaries = [htmlStretchSummary, cssStretchSummary];
  
    const summaries = getSummaries();
  
    expect(summaries).toEqual(expectedSummaries);
  });
});

describe('Tests for findDetailFor', () => {
  test('Check finding detail for detail that is block level', () => {
    document.body.innerHTML = 
      '<div>' +
      ' <span id="stretchsummaryhtml" epub-type="stretchsummary">html</span>' +
      ' <a id="globalwarmingdetail" href="#global-warming-details-1" epub-type="stretchsummary">global warming</a>'
      '</div>';
  
    const htmlStretchSummary = document.getElementById("stretchsummaryhtml");
    const detail = document.getElementById("globalwarmingdetail");
  
    expect(findDetailFor(htmlStretchSummary)).toBe(detail);
  });
  
  test('Check finding detail for detail that is block level but no detail found', () => {
    const errorSpy = jest.spyOn(global.console, 'error');
  
    document.body.innerHTML = 
      '<div>' +
      ' <a id="globalwarmingdetail" href="#global-warming-details-1" epub-type="stretchsummary">global warming</a>' +
      '</div>';
    
    const summary = document.getElementById("globalwarmingdetail");
    const id = summary.getAttribute("href").replace(/^#/, "");
  
    findDetailFor(summary);
    
    expect(errorSpy).toHaveBeenCalledWith(`No StretchText details for element with ID: ${id}`)
  
    errorSpy.mockRestore();
  });
  
  test('Check finding detail for detail that is not block level', () => {
    document.body.innerHTML = 
      '<div>' +
      ' <span id="stretchsummaryhtml" epub-type="stretchsummary">html</span>' +
      ' <span id="stretchsummarycss" class="stretchsummary">css</span>'
      '</div>';
  
    const htmlStretchSummary = document.getElementById("stretchsummaryhtml");
    const cssStretchSummary = document.getElementById("stretchsummarycss");
  
    expect(findDetailFor(htmlStretchSummary)).toBe(cssStretchSummary);
  });
  
  test('Check finding detail for detail that is not block level but no detail found', () => {
    const errorSpy = jest.spyOn(global.console, 'error');
  
    document.body.innerHTML = 
      '<div>' +
      ' <span id="stretchsummaryhtml" epub-type="stretchsummary">html</span>' +
      '</div>';
  
    const htmlStretchSummary = document.getElementById("stretchsummaryhtml");
    
    findDetailFor(htmlStretchSummary);
  
    expect(errorSpy).toHaveBeenCalledWith(`No StretchText details element found for ${htmlStretchSummary}`);
  
    errorSpy.mockRestore();
  });  
});

describe('Tests for customAnimationFrame', () => {
  test('Check customAnimationFrame', () => {
    const callback = jest.fn();
  
    customAnimationFrame(callback);
  
    expect(callback).not.toHaveBeenCalled();
  
    jest.advanceTimersByTime(1000/60);
  
    expect(callback).toHaveBeenCalled();
  });
});

describe('Tests for getAnimationFrame', () => {
  test('Check getting requestAnimationFrame', () => {
    const windowSpy = jest.spyOn(window, "window", "get");
  
    windowSpy.mockImplementation(() => ({
      "requestAnimationFrame": 20,
      "webkitRequestAnimationFrame": 15
    }));
  
    expect(getAnimationFrame()).toBe(20);
  
    windowSpy.mockRestore();
  });
});

describe('Tests for run', () => {
  test('Check run', () => {
    const TITLE_WHEN_CLOSED = "EXPAND";
  
    const windowSpy = jest.spyOn(window, "addEventListener");
    const animationSpy = jest.spyOn(window, 'requestAnimationFrame');
  
    Object.defineProperty(document, "readyState", {
      configurable: true,
      get() { return "complete"; }
    });
  
    document.body.innerHTML = 
      "<div>" +  
      " <span id='summary1' epub-type='stretchsummary'>girl</span>" +
      " <span id='detail1' epub-type='stretchdetail'>Some stuff at the end</span>" +
      "</div>";
  
    const summary = document.getElementById("summary1");
    const detail = document.getElementById("detail1");
    const htmlSpy = jest.spyOn(summary, "addEventListener");
    const summarySpy = jest.spyOn(summary.classList, "toggle");
    const detailSpy = jest.spyOn(detail.classList, "toggle");
  
    run();
  
    expect(window.addEventListener).toBeCalledWith("DOMContentLoaded", expect.any(Function));
    expect(document.readyState).toBe("complete");
    expect(summary.getAttribute("title")).toBe(TITLE_WHEN_CLOSED);
    expect(summary.addEventListener).toBeCalledWith('mousedown', expect.any(Function));
    expect(summary.addEventListener).toBeCalledWith('touchstart', expect.any(Function));
    expect(summary.addEventListener).toBeCalledWith('click', expect.any(Function));
  
    const mousedownEvent = new MouseEvent('mousedown');
  
    summary.dispatchEvent(mousedownEvent);
  
    expect(detail.style.display).toBe('inline');
    
    jest.advanceTimersByTime(1000/60);
  
    expect(summary.classList.toggle).toBeCalledWith('stretchtext-open');
    expect(detail.classList.toggle).toBeCalledWith('stretchtext-open');
  
    expect(summary.getAttribute('title')).toBe(TITLE_WHEN_CLOSED);
  
    windowSpy.mockRestore();
    htmlSpy.mockRestore();
    animationSpy.mockRestore();
    summarySpy.mockRestore();
    detailSpy.mockRestore();
  });
});