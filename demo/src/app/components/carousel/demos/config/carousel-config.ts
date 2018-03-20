import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';

// The dependency on HttpClientModule has been temporarily removed because
// it causes an issue with ts_devserver, cf https://github.com/angular/angular/issues/22866
// import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ngbd-carousel-config',
  templateUrl: './carousel-config.html',
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class NgbdCarouselConfig implements OnInit {
  images: Array<string> = this._randomImageUrls([
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6}
  ]);

  constructor(config: NgbCarouselConfig /*, private _http: HttpClient */) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
  }

  ngOnInit() {
    /*
    this._http.get('https://picsum.photos/list')
        .pipe(map((images: Array<{id: number}>) => this._randomImageUrls(images)))
        .subscribe(images => this.images = images);
    */
  }

  private _randomImageUrls(images: Array<{id: number}>): Array<string> {
    return [1, 2, 3].map(() => {
      const randomId = images[Math.floor(Math.random() * images.length)].id;
      return `https://picsum.photos/900/500?image=${randomId}`;
    });
  }
}
