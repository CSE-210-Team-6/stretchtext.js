const { setTitle } = require('../es6');

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