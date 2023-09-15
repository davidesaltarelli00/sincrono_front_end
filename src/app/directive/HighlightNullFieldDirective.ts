import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlightNullField]'
})
export class HighlightNullFieldDirective {
  @Input('highlightNullField') fieldValue: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.fieldValue === null) {
      this.renderer.addClass(this.el.nativeElement, 'campo-nullo');
    }
  }
}
