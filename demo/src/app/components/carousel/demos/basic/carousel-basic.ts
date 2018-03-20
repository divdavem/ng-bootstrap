import {Component, OnInit} from '@angular/core';

// The dependency on HttpClientModule has been temporarily removed because
// it causes an issue with ts_devserver, cf https://github.com/angular/angular/issues/22866
// import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';

@Component({selector: 'ngbd-carousel-basic', templateUrl: './carousel-basic.html'})
export class NgbdCarouselBasic implements OnInit {
  images: Array<string> = this._randomImageUrls([
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6}
  ]);

  constructor(/* private _http: HttpClient */) {}

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
