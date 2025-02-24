import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';
import { getPlainContent } from 'flarum/common/utils/string';

import addPostMentionPreviews from './addPostMentionPreviews';
import addMentionedByList from './addMentionedByList';
import addPostReplyAction from './addPostReplyAction';
import addPostQuoteButton from './addPostQuoteButton';
import addComposerAutocomplete from './addComposerAutocomplete';
import PostMentionedNotification from './components/PostMentionedNotification';
import UserMentionedNotification from './components/UserMentionedNotification';
import GroupMentionedNotification from './components/GroupMentionedNotification';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';

export { default as extend } from './extend';

app.initializers.add('flarum-mentions', function () {
  User.prototype.canMentionGroups = Model.attribute('canMentionGroups');

  // For every mention of a post inside a post's content, set up a hover handler
  // that shows a preview of the mentioned post.
  addPostMentionPreviews();

  // In the footer of each post, show information about who has replied (i.e.
  // who the post has been mentioned by).
  addMentionedByList();

  // Add a 'reply' control to the footer of each post. When clicked, it will
  // open up the composer and add a post mention to its contents.
  addPostReplyAction();

  // Show a Quote button when Post text is selected
  addPostQuoteButton();

  // After typing '@' in the composer, show a dropdown suggesting a bunch of
  // posts or users that the user could mention.
  addComposerAutocomplete();

  app.notificationComponents.postMentioned = PostMentionedNotification;
  app.notificationComponents.userMentioned = UserMentionedNotification;
  app.notificationComponents.groupMentioned = GroupMentionedNotification;

  // Add notification preferences.
  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('postMentioned', {
      name: 'postMentioned',
      icon: 'fas fa-reply',
      label: app.translator.trans('flarum-mentions.forum.settings.notify_post_mentioned_label'),
    });

    items.add('userMentioned', {
      name: 'userMentioned',
      icon: 'fas fa-at',
      label: app.translator.trans('flarum-mentions.forum.settings.notify_user_mentioned_label'),
    });

    items.add('groupMentioned', {
      name: 'groupMentioned',
      icon: 'fas fa-at',
      label: app.translator.trans('flarum-mentions.forum.settings.notify_group_mentioned_label'),
    });
  });

  // Add mentions tab in user profile
  extend(UserPage.prototype, 'navItems', function (items) {
    const user = this.user;
    items.add(
      'mentions',
      LinkButton.component(
        {
          href: app.route('user.mentions', { username: user.slug() }),
          name: 'mentions',
          icon: 'fas fa-at',
        },
        app.translator.trans('flarum-mentions.forum.user.mentions_link')
      ),
      80
    );
  });

  // Remove post mentions when rendering post previews.
  getPlainContent.removeSelectors.push('a.PostMention');
});

export * from './utils/textFormatter';

// Expose compat API
import mentionsCompat from './compat';
import { compat } from '@flarum/core/forum';

Object.assign(compat, mentionsCompat);
