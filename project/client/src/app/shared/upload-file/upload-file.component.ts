import { Component, OnInit ,  Output, EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: `${environment.api_url}/upload` });

  @ViewChild('input') input! : ElementRef;

  @Output() upload = new EventEmitter<string>();

  @Input() accept="image/*";

  constructor() { }

  ngOnInit(): void {
    this.setUploader();
  }
  setUploader() {
    this.uploader.onAfterAddingFile = (file) => {
      file.onSuccess = (res: any) => {
        this.upload.emit(JSON.parse(res).url);

    };

    };

  }
  click() {
    this.input.nativeElement.click();
  }

}
