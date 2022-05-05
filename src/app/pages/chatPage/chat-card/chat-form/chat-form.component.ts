import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnAuthorisedError } from 'src/app/common/unAuthorised-error';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
})
export class ChatFormComponent implements OnInit {
  @Input('sender') user: any;
  @Input('receiver') receiver: any;
  @Output('chat') chat = new EventEmitter();
  avatarUrl: string;
  form: any;

  constructor(
    private conversationService: ConversationService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.avatarUrl = environment.avatarUrl;
    this.form = fb.group({
      message: fb.control('', [Validators.required, Validators.nullValidator]),
    });
  }

  ngOnInit(): void {}

  send() {
    if (!this.form.valid) return;
    let message = this.form.get('message').value;
    this.form.reset();
    this.conversationService
      .sendMessage(this.receiver?._id, {
        message,
      })
      .subscribe(
        (response) => {
          this.chat.emit(response?.data);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  handleError(error: any) {
    if (
      error instanceof UnAuthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    )
      this.notificationService.showError(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status
      );
    else this.notificationService.showError('Something went wrong!', '500');
  }
}
