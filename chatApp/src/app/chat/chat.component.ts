import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ChatService} from "../services/chat-service";
import {ChatMessageDto} from "../models/chatMessageDto";
import { UserService } from '../shared/user.service';

@Component({
  selector: 'cf-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy{

  chatMessages: ChatMessageDto[] = [];
  selectedFile: File | null = null;

  constructor(
    private chatService: ChatService, 
    private userService: UserService) {}

  sendMessage(sendForm: NgForm) {
    const id = 1;
    const name = this.currentUserName;
    //const name = sendForm.value.user;
    const message = sendForm.value.message;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        const base64 = reader.result as string;
        const image = base64.split(',')[1];
        if (this.selectedFile) {
          const fileName = this.selectedFile.name;
          const fileType = this.selectedFile.type;
          const chatMessageDto = new ChatMessageDto(id ,name, message, image, fileName, fileType);

          this.chatService.sendMessage(chatMessageDto).subscribe((savedMessage) => {
            chatMessageDto.id = savedMessage.id;

            sendForm.controls['message'].reset();
            this.selectedFile = null;
          });
          this.selectedFile = null; // move this line here

        } else {
          console.error("Selected file is null");
        }
      };
    } else {
      const fileName = '';
      const fileType = '';
      const image = '';
      const chatMessageDto = new ChatMessageDto(id, name, message, image, fileName, fileType);
      this.chatService.sendMessage(chatMessageDto).subscribe((savedMessage) => {
      chatMessageDto.id = savedMessage.id; // Assign the returned ID to the chatMessageDto

      sendForm.controls['message'].reset();
      },
        (error: any) => {
      console.error('Error sending message:', error);
    });
    }
  }

  ngOnInit(): void {
    this.chatService.getChatMessagesPolling(5000).subscribe((messages) => {
      this.chatMessages = messages;
    });
  }

  ngOnDestroy(): void {
    // No need to close anything for REST API communication
  }

  onFileSelected(event: any) {
    setTimeout(() => {
      this.selectedFile = event.target.files[0];
    }, 500);
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      // set the image data to a variable
      const image = reader.result as string;
      // set the image data to an image element's source
      const img = new Image();
      img.src = image;
      // append the image element to a container element
      const container = document.querySelector('#image-container');
      if (container) {
        container.appendChild(img);
      } else {
        console.error("Container not found!");
      }
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  deleteMessage(id: number) {
    this.chatService.deleteMessage(id).subscribe(
      () => {
        // Message deleted successfully
        // Perform any additional actions if needed (e.g., update the UI)
      },
      (error: any) => {
        console.error('Error deleting message:', error);
        // Handle the error as needed
      }
    );
  }

  get currentUserName(): string {
    return this.userService.userName;
  }
}
