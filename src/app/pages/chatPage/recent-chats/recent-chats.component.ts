import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'recent-chats',
  templateUrl: './recent-chats.component.html',
  styleUrls: ['./recent-chats.component.css'],
})
export class RecentChatsComponent implements OnInit {
  @Input('coversations') coversations: any = [];
  @Input('currentUserId') currentUserId: string = '';
  @Input('selectedId') selectedId: string = '';
  @Input('title') title: string = 'Users';
  index: number = 0;

  selectedGroupUser: any = [];
  avatarUrl: string;
  groupIconUrl: string;
  form: any;
  constructor(
    private fb: FormBuilder,
    private conversationService: ConversationService,
    private notificationService: NotificationService
  ) {
    this.avatarUrl = environment.avatarUrl;
    this.groupIconUrl = environment.groupIconUrl;
  }

  ngOnInit(): void {}

  getIndex(c: any) {
    c.members[0]?._id === this.currentUserId
      ? (this.index = 1)
      : (this.index = 0);
  }
}
