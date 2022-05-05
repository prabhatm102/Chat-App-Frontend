import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @Input('users') users: any = [];
  @Input('selectedId') selectedId: string = '';
  @Input('title') title: string = 'Users';
  @Output('onGroupCreate') onGroupCreate = new EventEmitter();

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
    this.form = fb.group({
      name: fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      groupIcon: fb.control('', [Validators.required]),
      fileSource: fb.control('', []),
    });
  }

  ngOnInit(): void {}

  get name() {
    return this.form.get('name');
  }

  get groupIcon() {
    return this.form.get('groupIcon');
  }

  openCreateGroupModel() {
    this.selectedGroupUser = [];
    this.form.reset();
    this.users = this.users.map((u: any) => {
      u.isSelected = false;
      return u;
    });
  }

  toggleGroupUser(user: any) {
    const index = this.users.indexOf(user);
    this.users[index].isSelected = !this.users[index].isSelected;
    if (this.users[index].isSelected) this.selectedGroupUser.push(user?._id);
    else {
      let index = this.selectedGroupUser.indexOf(user?._id);

      if (index > -1) {
        this.selectedGroupUser.splice(index, 1);
      }
    }
  }

  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        return this.form.controls['groupIcon'].setErrors({
          invalidFileExtension: true,
        });
      }
      this.form.patchValue({ fileSource: file });
    }
  }

  createGroup() {
    if (!this.form.valid || this.selectedGroupUser?.length <= 0) return;

    let formData = new FormData();

    formData.append('name', this.form.get('name').value);
    formData.append('groupIcon', this.form.get('fileSource').value);

    if (this.selectedGroupUser?.length === 1)
      formData.append('members[]', this.selectedGroupUser);
    else {
      for (let member of this.selectedGroupUser) {
        formData.append('members', member);
      }
    }

    if (this.form.valid) {
      this.conversationService.createGroup(formData).subscribe(
        (response) => {
          this.form.reset();
          this.onGroupCreate.emit(response?.data);
          this.notificationService.showSuccess(
            'Group created successfully',
            response?.status
          );
        },
        (error) => {
          this.notificationService.showError('Something went wrong!', '');
          this.form.reset();
        }
      );
    }
  }
}
