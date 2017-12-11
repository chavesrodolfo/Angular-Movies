import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OnTVService {

  baseUrl: string;
  apiKey: string;
  language: string;
  region: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://api.themoviedb.org/3/';
    this.apiKey = '44550883b586091b9c3690d043df4c98';
    this.language = 'pt-BR';
    this.region = 'BR'
  }

  getTvOnTheAir(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}tv/on_the_air?api_key=${this.apiKey}&page=${page}&language=${this.language}&region=${this.region}`)
  }

  getTVAiringToday(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}tv/airing_today?api_key=${this.apiKey}&page=${page}&language=${this.language}&region=${this.region}`)
  }

  getPopularTVShow(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}tv/popular?api_key=${this.apiKey}&page=${page}&language=${this.language}&region=${this.region}`)
  }

  getTVShow(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}tv/${id}?api_key=${this.apiKey}&language=${this.language}&region=${this.region}`)
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}genre/tv/list?api_key=${this.apiKey}&language=${this.language}&region=${this.region}`)
  }

}
