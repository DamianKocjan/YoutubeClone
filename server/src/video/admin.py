from django.contrib import admin

from .models import Category
from .models import Library
from .models import Playlist
from .models import PlaylistVideo
from .models import PlaylistView
from .models import SubCategory
from .models import Video
from .models import VideoView

admin.site.register(VideoView)
admin.site.register(Library)
admin.site.register(PlaylistView)
admin.site.register(PlaylistVideo)
admin.site.register(Video)
admin.site.register(Playlist)
admin.site.register(Category)
admin.site.register(SubCategory)
