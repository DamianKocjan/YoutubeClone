import os
import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField
from PIL import Image


def get_user_upload_to(instance, filename: str) -> str:
    """ Get file from given user and file name """
    return 'upload/%s/%s' % (instance.id, filename)


class User(AbstractUser):
    avatar = models.ImageField(
        'avatar', upload_to=get_user_upload_to, blank=True, null=True)
    background = models.ImageField(
        'background', upload_to=get_user_upload_to, blank=True, null=True)
    description = models.TextField(max_length=200, default='')
    location = CountryField(blank=True)
    stream_key = models.UUIDField(default=uuid.uuid4)

    class Meta:
        db_table = 'auth_user'

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)

        if self.avatar:
            self.avatar = self.rename_file(
                str(self.avatar), name='avatar').replace('/', '\\')
            super().save()

            avatar = Image.open(self.avatar)
            size = (128, 128)
            avatar = avatar.resize(size, Image.ANTIALIAS)
            avatar.save(self.avatar.path, quality=90)

        if self.background:
            self.background = self.rename_file(
                str(self.background), name='background').replace('/', '\\')
            super().save()

            background = Image.open(self.background)
            size = (1920, 300)
            background = background.resize(size, Image.ANTIALIAS)
            background.save(self.background.path, quality=90)

    @property
    def get_subscribers_count(self):
        return Subscription.objects.filter(channel=self.id).count()

    def rename_file(self, file, name: str) -> str:
        ext = file.split('.')[-1]
        filename = '%s/%s.%s' % (self.id, name, ext)
        path = os.path.join('uploads', filename)

        os.rename(
            os.path.join(settings.MEDIA_ROOT, file),
            os.path.join(settings.MEDIA_ROOT, path),
        )

        return path


class Subscription(models.Model):
    channel = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='subscription_channel')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='subscription_user')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['channel', 'user']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self) -> str:
        return f'Subscription {self.channel} - {self.user}'
