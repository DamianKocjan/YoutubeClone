import os

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_delete
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django_countries.fields import CountryField
from PIL import Image


def get_user_upload_to(instance, filename: str) -> str:
    """ Get file from given user and file name """
    return 'upload/%s/%s' % (instance.id, filename)


class User(AbstractUser):
    avatar      = models.ImageField('avatar', upload_to=get_user_upload_to, blank=True, null=True)
    background  = models.ImageField('background', upload_to=get_user_upload_to, blank=True, null=True)
    description = models.TextField(max_length=200, default='')
    location    = CountryField(blank=True)

    @property
    def get_subscribers_count(self):
        return Subscription.objects.filter(channel=self.id).count()

    class Meta:
        db_table = 'auth_user'

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)

        if self.avatar:
            avatar = Image.open(self.avatar)
            size = (128, 128)
            avatar = avatar.resize(size, Image.ANTIALIAS)
            avatar.save(self.avatar.path, quality=90)

        if self.background:
            background = Image.open(self.background)
            size = (1920, 300)
            background = background.resize(size, Image.ANTIALIAS)
            background.save(self.background.path, quality=90)


@receiver(post_delete, sender=User)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.avatar:
        if os.path.isfile(instance.avatar.path):
            os.remove(instance.avatar.path)

    if instance.background:
        if os.path.isfile(instance.background.path):
            os.remove(instance.background.path)


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
