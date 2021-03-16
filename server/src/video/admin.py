from django.contrib import admin

from .models import (
    VideoView,
    PlaylistView,
    Video,
    Playlist,
    Category,
    SubCategory,
)

admin.site.register(VideoView)
admin.site.register(PlaylistView)
admin.site.register(Video)
admin.site.register(Playlist)
admin.site.register(Category)
admin.site.register(SubCategory)
