import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragNDrop]'
})
export class DragNDropDirective {
  @HostBinding('class.fileOver') private fileOver: boolean = false;
  @Output() private fileDropped: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  @HostListener('dragover', ['$event']) private onDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) private onDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) private onDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = false;

    let files = e.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}