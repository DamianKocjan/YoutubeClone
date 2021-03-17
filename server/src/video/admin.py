from django.contrib import admin

from .models import Category
from .models import Playlist
from .models import PlaylistView
from .models import SubCategory
from .models import Video
from .models import VideoView

admin.site.register(VideoView)
admin.site.register(PlaylistView)
admin.site.register(Video)
admin.site.register(Playlist)
admin.site.register(Category)
admin.site.register(SubCategory)
