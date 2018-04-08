import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../../services/inTheater/movies.service';
import {MovieModel} from '../../../models/movie.model';
import {MovieCast} from '../../../models/movie-cast';
import {MovieVideo} from '../../../models/movie-video';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {PaginatorModel} from '../../../models/paginator.model';
import {SeoService} from '../../../services/seo.service';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movie: MovieModel;
  similarMovies: Array<PaginatorModel> = [];
  cast: MovieCast;
  video: MovieVideo;
  isLoading = true;
  isLoggedIn: boolean;

  @ViewChild('closeModal') public  closeModal: ElementRef;
  @ViewChild('openModal') public  openModal: ElementRef;

  constructor(
    private _moviesService: MoviesService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private seo: SeoService,
    public auth: AuthService
  ) {
    this.auth.afAuth.authState.subscribe(
      a => {
        this.isLoggedIn = a !== null;
      }
    );
  }

  ngOnInit() {

    this.seo.generateTags({
      title: 'Movie Page',
      description: 'Movie Page for Angular Movies',
      image: 'https://image.tmdb.org/t/p/w1920/5wNUJs23rT5rTBacNyf5h83AynM.jpg',
      slug: 'movie'
    });

    this.router.params.subscribe( (params) => {
      const id = params['id'];

      this._moviesService.getMovie(id).subscribe( movie => {
        this.movie = movie;

        if (!this.movie) {
          alert('Server Error')
        } else {
          this.isLoading = false;
        }
      });

      this._moviesService.getMovieCredits(id).subscribe( res => {
        res.cast = res.cast.filter( item => { return item.profile_path });
        this.cast = res.cast.slice(0, 4);
      });

      this._moviesService.getMovieVideos(id).subscribe( res => {
        if (res.results && res.results.length) {
          this.video = res.results[0];
          let url = 'https://www.youtube.com/embed/';
          url += this.video['key'];
          url += '?autoplay=1&fs=1&iv_load_policy=3&rel=0&showinfo=0&showsearch=0&controls=1';
          this.video['url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      });

      this._moviesService.getRecomendMovies(id).subscribe(res => {
        this.similarMovies = res.results.slice(0, 8);
        this.similarMovies.forEach(np => np['isMovie'] = true);
      });

    });
  }

  openDialog(): void {
    this.dialog.open(AppMovieDialogComponent, {
      height: '55%',
      width: '800px',
      data: { video: this.video}
    });
  }

  getSourceFileLink(imdb_id: string) {
    this._moviesService.getSourceFileLink(imdb_id).subscribe( sourceFileMovie => {
      if (sourceFileMovie.data.movies) {
        const link = sourceFileMovie.data.movies[0].torrents[sourceFileMovie.data.movies[0].torrents.length - 1].url;
        window.location.href = link;
      } else {
        alert('Este filme ainda não está disponível para download.');
      }
    });
  }
}

@Component({
  selector: 'app-movie-dialog',
  templateUrl: 'app-movie-dialog.html'
})
export class AppMovieDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AppMovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

}
