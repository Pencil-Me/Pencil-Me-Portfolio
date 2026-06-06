import { Directive } from '@angular/core';
import type { ScrollSectionDirective } from './scroll-section.directive';

// Directive for managing scroll sections
@Directive({
  selector: '[appScrollManager]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollManagerDirective {
  private sections = new Map<string | number, ScrollSectionDirective>(); // Map to store scroll sections

  // Method to scroll to a specific section by its ID
  scroll(id: string | number): void {
    this.sections.get(id)!.scroll();
  }

  register(section: ScrollSectionDirective): void {
    this.sections.set(section.id, section);
  }

  remove(section: ScrollSectionDirective): void {
    this.sections.delete(section.id);
  }
}
