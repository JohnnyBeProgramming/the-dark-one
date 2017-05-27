import {Component} from '@angular/core';
import {CaptureService} from "../../services/capture.service";

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html'
})
export class CapturePage {

  public category: string = '';

  constructor(public captureService: CaptureService) {
  }

}
