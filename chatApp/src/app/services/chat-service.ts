import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChatMessageDto } from "../models/chatMessageDto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  public getChatMessages(): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>('http://localhost:4000/chat/getAllMessages');
  }

  public sendMessage(chatMessageDto: ChatMessageDto): Observable<ChatMessageDto> {
    return this.http.post<ChatMessageDto>('http://localhost:4000/chat/postMessage', chatMessageDto);
  }

  public getChatMessagesPolling(intervalTime: number): Observable<ChatMessageDto[]> {
    return interval(intervalTime).pipe(
      switchMap(() => this.getChatMessages())
    );
  }

  public deleteMessage(id: number): Observable<any> {
    return this.http.post('http://localhost:4000/chat/deleteMessage', { id });
  }
}
