import { Directive } from '@angular/core';
import { ScrollSectionDirective } from './scroll-section.directive';

// Directive for managing scroll sections
@Directive({
  selector: '[appScrollManager]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollManagerDirective {
  private sections = new Map<string | number, ScrollSectionDirective>(); // Map to store scroll sections

  // Method to scroll to a specific section by its ID
  scroll(id: string | number) {
    this.sections.get(id)!.scroll(); // Invoking the scroll method of the corresponding scroll section
  }

  // Method to register a scroll section
  register(section: ScrollSectionDirective) {
    this.sections.set(section.id, section); // Adding the scroll section to the map
  }

  // Method to remove a scroll section
  remove(section: ScrollSectionDirective) {
    this.sections.delete(section.id); // Removing the scroll section from the map
  }
}
