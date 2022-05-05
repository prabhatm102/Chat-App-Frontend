import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pipe, Subscription, switchMap } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnAuthorisedError } from 'src/app/common/unAuthorised-error';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  userSubscription: Subscription = new Subscription();
  currentUser: any;
  user: any = {};
  users: any = [];
  recentConversations: any = [];

  constructor(
    private userService: UserService,
    private conversationService: ConversationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private socket: SocketService
  ) {
    this.currentUser = this.authService.getLoggedInUser() || '';

    if (this.currentUser?._id) {
      this.userSubscription = this.userService
        .getAll()
        .pipe(
          switchMap((response) => {
            this.users = response?.data?.filter(
              (user: any) => user._id !== this.currentUser?._id
            );
            // return this.route.queryParamMap;
            return this.conversationService.getGroupsByUserId(
              this.currentUser?._id
            );
          })
        )
        .pipe(
          switchMap((response) => {
            this.recentConversations = response?.data;
            return this.route.queryParamMap;
          })
        )
        .subscribe(
          (params) => {
            let receiverId = params.get('receiver') || '';

            this.user =
              this.users?.find((u: any) => u?._id === receiverId) ||
              this.recentConversations?.find(
                (c: any) => c?._id === receiverId
              ) ||
              {};
          },
          (error) => {
            this.handleError(error);
          }
        );
    }
  }

  ngOnInit(): void {
    this.socket.OnAddedToGroup().subscribe(
      (response: any) => {
        this.addGroup(response?.data, true);
      },
      (error) => {
        this.handleError(error);
      }
    );

    this.socket.OnRemovedFromGroup().subscribe(
      (response: any) => {
        let index = this.recentConversations.findIndex(
          (g: any) => g?._id === response?.data?._id
        );

        if (response?.removedMembers.indexOf(this.currentUser?._id) !== -1) {
          this.notificationService.showSuccess(
            'You have been removed from a group',
            response?.data?.name
          );
          this.recentConversations.splice(index, 1);
        } else {
          this.notificationService.showSuccess(
            'Some members have been removed from group',
            response?.data?.name
          );
          this.recentConversations[index] = response?.data;
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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

  addGroup(group: any, showToaster?: boolean) {
    let msg;
    let index = this.recentConversations.findIndex(
      (c: any) => c?._id === group?._id
    );
    if (index === -1) {
      this.recentConversations.unshift(group);
    } else {
      this.recentConversations[index] = group;
    }
    if (showToaster)
      this.notificationService.showSuccess(
        'New group members have joined',
        group?.name
      );
  }

  removeGroup(group: any) {
    let index = this.recentConversations.findIndex(
      (g: any) => g?._id === group?._id
    );
    this.recentConversations.splice(index, 1);
  }

  onChatStarted(conversation: any) {
    if (!this.recentConversations.find((c: any) => c._id === conversation?._id))
      this.recentConversations.unshift(conversation);
  }
}
