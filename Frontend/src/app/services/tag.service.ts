import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config/config';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient,
    private configService: ConfigService
  ) {}

  private get apiUrl(): string {
    return this.configService.getapiUrl();
  }

  getTrees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/GetTrees`);
  }

  saveTree(tree: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/SaveTree`, tree);
  }

  updateTree(id: number, tree: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/UpdateTree/${id}`, tree);
  }
}
