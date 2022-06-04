import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  imgSrc = 'images/user.png';
  tournamentSrc = 'images/tournament.png'


  // args description: 
  // args[0] 1 : for tournaments
  transform(image: string, args: any[]): string {

    if (image && (image.includes('http') || image.includes('https'))) {
      return image;
    } else if (image && image !== '') {
      return environment.file_url + image;
    } else {
      // if type:1 returns tournament image
      if (args && args[0] == 1) {
        return environment.file_url + this.tournamentSrc;
      }
      return environment.file_url + this.imgSrc;
    }
  }

}
