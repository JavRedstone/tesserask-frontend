import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public window: Window = window;
  public isDark: boolean = false;
  public hidden: boolean = false;
  
  constructor(
    public router: Router,
    private cookieService: CookieService
  ) {
    this.getIsDark();
  }

  private getIsDark(): void {
    let isDark: string = this.cookieService.getAll()['isDark'];
    this.isDark = isDark == 'false' ? false : true;
  }

  public darkLight(): void {
    this.isDark = !this.isDark;
    this.cookieService.set('isDark', `${this.isDark}`,  new Date(2147483647 * 1000), '/');
  }

  public hideRest(): void {
    this.hidden = true;
  }

  public showRest(): void {
    this.hidden = false;
  }

  public redirectHome(): void {
    AppComponent.redirectWithReload('/', {}, this.router);
  }

  public static async redirectWithReload(path: string, queryParams: any, router: Router): Promise<void> {
    await router.navigate([path], {
      queryParams: queryParams
    });
    location.reload();
  }

  public static getFileSizeInMB(file: File): number {
    return Math.round((file.size / (1024 * 1024) + Number.EPSILON) * 100) / 100;
  }

  public static async toBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public static base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512) {
    base64 = base64.split(',')[1].replace(/\s/g, '');
    let byteCharacters = atob(base64);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  public static formatText(elementRef: ElementRef, breaks: boolean): void {
    if (breaks) {
      elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/\r?\n/g, '<br />');
    }
    elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/\*(.*?)\*/g, '<i>$1</i>');
    elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/__(.*?)__/g, '<u>$1</u>');
    elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/~~(.*?)~~/g, '<del>$1</del>');
    elementRef.nativeElement.innerHTML = elementRef.nativeElement.innerHTML.replace(/==(.*?)==/g, '<a href = "$1" target = "_blank" rel = "noopener noreferrer">Link</a>');
  }

  public static formatUri(uri: string): string {
    return uri.replace(/[^a-z\d\s]+/gi, ' ').trim().replace(/ /g, '-');
  }

  public static unformatUri(uri: string): string {
    return uri.replace(/-/g, ' ').trim();
  }
}