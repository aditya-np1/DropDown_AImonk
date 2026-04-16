import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Node } from '../types/dropdown';
import { ConfigService } from './config/config';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  apiUrl = "";
  constructor(private http: HttpClient,
    private configService: ConfigService
  ) { this.apiUrl = this.configService.getapiUrl() }

  getTree(): Observable<Node> {
    return this.http.get<Node>(`${this.apiUrl}/api/GetTree`);
  }

  saveTree(tree: Node): Observable<Node> {
    return this.http.post<Node>(`${this.apiUrl}/api/SaveTree`, tree);
  }

  // New API endpoint for individual node operations
  postTreeView(payload: { TreeID: number, TagName: string, TagData: string, TagID: number | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/TreeView`, payload);
  }
}
