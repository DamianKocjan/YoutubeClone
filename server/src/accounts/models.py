import os

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_delete
from django.db.models.signals import pre_save
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_countries.fields import CountryField


def get_user_upload_to(instance, filename: str) -> str:
    """ Get file from given user and file name """
    return 'upload/%s/%s' % (instance.id, filename)


class User(AbstractUser):
    avatar      = models.ImageField('avatar', upload_to=get_user_upload_to, blank=True, null=True)
    description = models.TextField(max_length=200, default='')
    location    = CountryField(blank=True)

    @property
    def get_subscribers_count(self):
        return Subscription.objects.filter(channel=self.id).count()

    class Meta:
        db_table = 'auth_user'


@receiver(post_delete, sender=User)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.avatar:
        if os.path.isfile(instance.avatar.path):
            os.remove(instance.avatar.path)


@receiver(pre_save, sender=User)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False


class Subscription(models.Model):
    channel    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_channel')
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_user')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'Subscription {self.channel} - {self.user}'

    class Meta:
        unique_together = ['channel', 'user']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'


# @receiver(post_save, sender=Subscription)
# def update_subscribers_number(sender, instance, **kwargs):
#     """
#     Updates subscribers number on channel.
#     """
#     if kwargs['created']:
#         channel = User.objects.get(user=kwargs['instance'].channel)
#         channel.subscribers_number += 1

#         channel.save()


# @receiver(post_delete, sender=Subscription)
# def update_subscribers_number(sender, instance, **kwargs):
#     """
#     Updates subscribers number on channel.
#     """
#     if kwargs['deleted']:
#         channel = User.objects.get(user=kwargs['instance'].channel)
#         channel.subscribers_number -= 1

#         channel.save()
