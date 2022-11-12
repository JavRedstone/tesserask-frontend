import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attachment } from 'src/app/classes/dto/attachment/attachment';
import FileSaver from 'file-saver';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent {
  @Input() public attachment: Attachment;
  @Input() public type: string = '';
  @Input() public preview: boolean = false;
  @Input() public width: number = 0;
  @Input() public height: number = 0;

  @Output() private remove: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public downloadAttachment(): void {
    let blob: Blob = AppComponent.base64ToBlob(this.attachment.base64);
    FileSaver.saveAs(blob, this.attachment.name);
  }

  public removeAttachment(): void {
    this.remove.emit(this.attachment);
  }
}
