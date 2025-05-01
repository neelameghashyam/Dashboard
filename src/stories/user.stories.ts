// src/stories/user.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { UserComponent } from '../app/user/user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'Components/User',
  component: UserComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        RouterTestingModule,
      ],
    }),
  ],
} as Meta<UserComponent>;

type Story = StoryObj<UserComponent>;

export const WithAvatar: Story = {
  args: {
    showAvatar: true,
    user: {
      avatar: 'https://via.placeholder.com/150',
      status: 'online',
    },
  },
};

export const WithoutAvatar: Story = {
  args: {
    showAvatar: false,
    user: {
      avatar: '',
      status: 'online',
    },
  },
};