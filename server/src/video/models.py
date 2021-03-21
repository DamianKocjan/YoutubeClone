import os

from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from django.conf import settings
from django.db import models
from django.utils.text import slugify
from tinytag import TinyTag

from accounts.models import User
from rating.models import VideoRating


class ViewBase(models.Model):
    user  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_user')

    class Meta:
        abstract = True


class VideoView(ViewBase):
    video = models.ForeignKey('Video', on_delete=models.CASCADE, related_name='video_view_video')

    class Meta:
        verbose_name = 'Video View'
        verbose_name_plural = 'Video Views'

    def __str__(self) -> str:
        return f'Video View {self.id}, {self.user}, {self.video}'


STATUS_TYPES = (
    ('Public', 'Public'),
    ('Unlisted', 'Unlisted'),
    ('Private', 'Private'),
)


def handle_uploaded_video_file(instance, filename: str) -> str:
    filename = '%s/videos/%s' % (instance.author.id, filename)
    return os.path.join('uploads', filename)


def handle_uploaded_thumbnail_file(instance, filename: str) -> str:
    filename = '%s/thumbnails/%s' % (instance.author.id, filename)
    return os.path.join('uploads', filename)


class Video(models.Model):
    title       = models.CharField(max_length=100)
    description = models.TextField(max_length=5000, blank=True)
    video       = models.FileField(upload_to=handle_uploaded_video_file)
    thumbnail   = models.ImageField(upload_to=handle_uploaded_thumbnail_file)
    duration    = models.PositiveSmallIntegerField(default=0)
    author      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status      = models.CharField(max_length=8, choices=STATUS_TYPES, default='Public')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    @property
    def get_views_count(self) -> int:
        return VideoView.objects.filter(video=self.id).count()

    @property
    def get_likes_count(self) -> int:
        return VideoRating.objects.filter(video=self.id, is_liking=True).count()

    @property
    def get_dislikes_count(self) -> int:
        return VideoRating.objects.filter(video=self.id, is_liking=False).count()

    class Meta:
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'

    def __str__(self) -> str:
        return f'Video {self.id}'

    def rename_file(self, file, dir_name):
        ext = file.split('.')[-1]
        filename = '%s/%s/%s.%s' % (self.author.id, dir_name, self.id, ext)
        path = os.path.join('uploads', filename)

        os.renames(
            os.path.join(settings.MEDIA_ROOT, file),
            os.path.join(settings.MEDIA_ROOT, path),
        )

        return path

    def get_video_duration(self) -> int:
        video = TinyTag.get(os.path.join(settings.MEDIA_ROOT + str(self.video)))
        return int(video.duration)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        self.video = self.rename_file(str(self.video), 'videos').replace('/', '\\')
        self.thumbnail = self.rename_file(str(self.thumbnail), 'thumbnails').replace('/', '\\')
        self.duration = self.get_video_duration()

        super().save()


class PlaylistView(ViewBase):
    playlist = models.ForeignKey('Playlist', on_delete=models.CASCADE, related_name='playlist_view_playlist')

    class Meta:
        verbose_name = 'Playlist View'
        verbose_name_plural = 'Playlist Views'

    def __str__(self) -> str:
        return f'Playlist View {self.id}, {self.user}, {self.playlist}'


class PlaylistVideo(models.Model):
    playlist = models.ForeignKey('Playlist', on_delete=models.CASCADE)
    video    = models.ForeignKey(Video, on_delete=models.CASCADE)
    position = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['position']
        verbose_name = 'Playlist Video'
        verbose_name_plural = 'Playlist Videos'

    def __str__(self) -> str:
        return f'Playlist video {self.id}'


class Playlist(models.Model):
    title       = models.CharField(max_length=50)
    author      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    status      = models.CharField(max_length=8, choices=STATUS_TYPES, default='Public')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    @property
    def get_views_count(self) -> int:
        return PlaylistView.objects.filter(playlist=self.id).count()

    @property
    def get_videos(self):
        return PlaylistVideo.objects.filter(playlist=self.id)

    class Meta:
        verbose_name = 'Playlist'
        verbose_name_plural = 'Playlists'

    def __str__(self) -> str:
        return f'Playlist {self.id}'


class Library(models.Model):
    user      = models.OneToOneField(User, on_delete=models.CASCADE)
    playlists = models.ManyToManyField(Playlist)

    class Meta:
        verbose_name = 'Library'
        verbose_name_plural = 'Libraries'

    def __str__(self) -> str:
        return f'Library - {self.user}'


@receiver(post_save, sender=User)
def auto_create_library_on_user_creation(sender, instance, created, **kwargs):
    """
    Creates library for user on his creation.
    """
    if created:
        library = Library.objects.create(user=instance)
        library.save()


class CategoryBase(models.Model):
    name       = models.CharField(max_length=50, db_index=True)
    slug       = models.SlugField(max_length=50, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return str(self.name)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super(Category, self).save()


class Category(CategoryBase):
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class SubCategory(CategoryBase):
    category   = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'SubCategory'
        verbose_name_plural = 'SubCategories'
