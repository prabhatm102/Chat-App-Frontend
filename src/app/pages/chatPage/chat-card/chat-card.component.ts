import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnAuthorisedError } from 'src/app/common/unAuthorised-error';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.css'],
})
export class ChatCardComponent implements OnInit {
  @Input('user') user: any = {};
  @Input('currentUser') currentUser: any = {};
  @Input('allUsers') allUsers: any = {};
  wallpaper: string = 'https://picsum.photos/557/400';
  chats: any = [];
  avatarUrl: string = '';
  groupIconUrl: string = '';
  conversationSubscription: Subscription = new Subscription();
  updateSeenSubscription: Subscription = new Subscription();
  @Output('chatStarted') chatStarted = new EventEmitter();
  @Output('exitGroup') exitGroup = new EventEmitter();
  @ViewChild('chatBody') chatBody!: ElementRef;

  selectedMembers: any = [];

  selectedMembersToRemove: any = [];

  constructor(
    private conversationService: ConversationService,
    private notificationService: NotificationService,
    private socket: SocketService
  ) {
    this.avatarUrl = environment.avatarUrl;
    this.groupIconUrl = environment.groupIconUrl;
  }

  ngOnInit(): void {
    this.socket.OnReceiveMessage().subscribe((response: any) => {
      if (this.user?._id === response?.id) {
        this.chats.push(response?.data);
        setTimeout(() => {
          this.scrollToBottom();
          this.updateSeen();
        }, 10);
      }
    });

    this.socket.OnUpdateSeen().subscribe((response: any) => {
      // let index = this.chats.findIndex(
      //   (ch: any) => ch?._id === response?.data?._id
      // );

      // if (index === -1) return;
      setTimeout(() => {
        this.chats = this.chats.map((ch: any) => {
          ch.members = ch?.members?.map((m: any) => {
            if (m?.member?._id === response?.seenBy) m.isSeen = true;
            return m;
          });
          return ch;
        });
        // this.chats[index] = response?.data;
      }, 300);
    });
  }

  ngOnChanges(): void {
    if (!this.user?._id) return;
    this.selectedMembers = [];
    this.conversationSubscription = this.conversationService
      .getChatsByConversationOrUserId(this.user?._id)
      .subscribe(
        (response) => {
          this.chats = response?.data;

          setTimeout(() => {
            this.scrollToBottom();
            if (
              this.chats?.some((m: any) =>
                m?.members?.some(
                  (m: any) =>
                    m?.isSeen === false &&
                    m?.member?._id === this.currentUser?._id
                )
              )
            ) {
              this.updateSeen();
            }
            // if (
            //   this.chats?.members?.some(
            //     (m: any) =>
            //       m?.isSeen === false &&
            //       m?.member?._id === this.currentUser?._id
            //   )
            // ) {
            //   console.log('first');
            //   this.updateSeen();
            // }
          }, 10);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  scrollToBottom() {
    this.chatBody?.nativeElement.scrollTo({
      left: 0,
      top: this.chatBody.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
    this.updateSeenSubscription.unsubscribe();
  }

  sendMessage(message: any): void {
    if (this.chats?.length === 0) this.chatStarted.emit(message?.conversation);
    this.chats.push(message);

    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
    // this.chatBody.nativeElement.scrollTo({
    //   left: 0,
    //   top: this.chatBody.nativeElement.scrollHeight + 100,
    //   behavior: 'smooth',
    // });
    // this.el.nativeElement.scrollIntoView({ behavior: 'smooth' });
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

  clearChat(message?: any) {
    if (
      !confirm(
        'Are you sure you want to ' +
          (message?._id ? 'delete this message ?' : 'clear chat ?')
      )
    )
      return;
    let id;
    let index: number;
    let chats: any = [];
    if (!message?._id) {
      id = this.chats[0]?.conversation;
      chats = this.chats;
      this.chats = [];
    } else {
      id = message?._id;
      index = this.chats.indexOf(message);
      this.chats.splice(index, 1);
    }

    if (id) {
      // this.conversationService.delete(id).subscribe(
      //   (response) => {
      //     this.notificationService.showSuccess(
      //       JSON.parse(JSON.stringify(response))?.message,
      //       '200'
      //     );
      //   },
      //   (error) => {
      //     if (message?._id) this.chats.splice(index, 0, message);
      //     else this.chats = chats;
      //     this.handleError(error);
      //   }
      // );
    } else {
      this.notificationService.showInfo('There is no Messages to clear!', '');
    }
  }

  updateWallpaper(file: any) {
    this.wallpaper = URL.createObjectURL(file);
  }

  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        this.notificationService.showError(
          'Select only jpg/png files',
          'Invalid file exetension'
        );
      } else {
        this.updateWallpaper(event.target.files[0]);
      }
    }
  }

  addMembers() {
    if (this.selectedMembers?.length <= 0) return;

    this.conversationService
      .addMembers(this.user?._id, { members: this.selectedMembers })
      .subscribe(
        (response) => {
          this.selectedMembers = [];
          this.user = response?.data;
          this.notificationService.showSuccess(
            'Members added successfully',
            response.status
          );
        },
        (error) => {
          this.handleError(error);
          this.selectedMembers = [];
        }
      );
  }

  removeMembers() {
    if (this.selectedMembersToRemove?.length <= 0) return;

    this.conversationService
      .removeMembers(this.user?._id, { members: this.selectedMembersToRemove })
      .subscribe(
        (response) => {
          this.selectedMembersToRemove = [];
          if (
            this.selectedMembersToRemove.find(
              (m: any) => m === this.currentUser?._id
            )
          ) {
            this.user = {};
            this.exitGroup.emit(response?.data);
            this.notificationService.showSuccess(
              'SuccessFully exists from group',
              response.status
            );
          }
          this.user = response?.data;
          this.notificationService.showSuccess(
            'Members removed successfully',
            response.status
          );
        },
        (error) => {
          this.handleError(error);
          this.selectedMembersToRemove = [];
        }
      );
  }

  openGroupInfoModel() {
    this.selectedMembersToRemove = [];
    this.user.members = this.user?.members?.map((u: any) => {
      u.isSelected = false;
      return u;
    });
  }

  toggleGroupUser(user: any) {
    const index = this.user?.members?.indexOf(user);
    this.user.members[index].isSelected = !this.user?.members[index].isSelected;
    if (this.user?.members[index].isSelected)
      this.selectedMembersToRemove?.push(user?._id);
    else {
      let index = this.selectedMembersToRemove?.indexOf(user?._id);

      if (index > -1) {
        this.selectedMembersToRemove?.splice(index, 1);
      }
    }
  }

  isSeen(members: any) {
    return members.every((m: any) => m?.isSeen === true);
  }

  updateSeen() {
    this.updateSeenSubscription = this.conversationService
      .updateSeen(this.chats[this.chats?.length - 1]?._id, {
        isSeen: true,
      })
      .subscribe(
        (response) => {
          // this.chats = this.chats.map((ch: any) => {
          //   ch.members = ch?.members?.map((m: any) => {
          //     m.isSeen = true;
          //     return m;
          //   });
          //   return ch;
          // });
        },
        (error) => {
          this.handleError(error);
        }
      );
  }
}
