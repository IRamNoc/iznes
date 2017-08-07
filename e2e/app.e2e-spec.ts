import { ClaritySamplePage } from './app.po';

describe('clarity-sample App', () => {
  let page: ClaritySamplePage;

  beforeEach(() => {
    page = new ClaritySamplePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
