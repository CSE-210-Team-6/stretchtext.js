const { setTitle, isBlockLevelDetail } = require('../es6');

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