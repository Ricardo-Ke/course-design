import { CourseDesign201704Page } from './app.po';

describe('course-design201704 App', () => {
  let page: CourseDesign201704Page;

  beforeEach(() => {
    page = new CourseDesign201704Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
