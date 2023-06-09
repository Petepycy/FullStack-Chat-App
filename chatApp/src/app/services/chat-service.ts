import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChatMessageDto } from "../models/chatMessageDto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    //this.apiUrl = `${window.location.protocol}//api`;
    this.apiUrl = 'http://localhost:17586';
  }

  
  public getChatMessages(): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>(`${this.apiUrl}/chat/getAllMessages`);
  }

  public sendMessage(chatMessageDto: ChatMessageDto): Observable<ChatMessageDto> {
    return this.http.post<ChatMessageDto>(`${this.apiUrl}/chat/postMessage`, chatMessageDto);
  }

  public getChatMessagesPolling(intervalTime: number): Observable<ChatMessageDto[]> {
    return interval(intervalTime).pipe(
      switchMap(() => this.getChatMessages())
    );
  }

  public deleteMessage(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/deleteMessage`, { id });
  }
}