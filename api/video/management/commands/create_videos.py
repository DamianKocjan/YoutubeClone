import random
import os
import sys

from django.core.management.base import BaseCommand
from django.core.files.base import File

from .markov import Markov
from accounts.models import User
from comments.models import Comment, ReplyComment
from video.models import Video


class Command(BaseCommand):
    help = 'Creates videos'
    my_path = 'video\\management\\commands\\'

    def add_arguments(self, parser):
        parser.add_argument('count', nargs='+', type=int)

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Process started'))
        count = options['count'][0]

        if not count:
            count = 1

        with open(os.path.join(sys.path[0], self.my_path, 'markov.txt')) as markov_file:
            markov = Markov(markov_file)
            markov_file.close()

        thumbs_paths = [
            'thumb-1.jpg',
            'thumb-2.jpg',
            'thumb-3.jpg',
            'thumb-4.jpg',
            'thumb-5.jpg',
        ]

        users = User.objects.all()

        # generate video
        with open(os.path.join(sys.path[0], self.my_path, 'vid.mp4'), 'rb') as vid_file:
            for _ in range(count):
                with open(os.path.join(sys.path[0], self.my_path, random.choice(thumbs_paths)), 'rb') as thumb:
                    video = Video.objects.create(
                        title = markov.generate_markov_text(10),
                        description = markov.generate_markov_text(),
                        author = random.choice(users),
                        video = File(vid_file, name=os.path.basename(vid_file.name)),
                        thumbnail = File(thumb, name=os.path.basename(thumb.name)),
                    )
                    video.save()
                    thumb.close()

                # generate comments
                for __ in range(random.randint(1, 20)):
                    video_comment = Comment.objects.create(
                        author = random.choice(users),
                        content = markov.generate_markov_text(15),
                        video = video,
                    )
                    video_comment.save()

                    # generate replies for comment
                    for ___ in range(random.randint(1, 10)):
                        reply_comment = ReplyComment.objects.create(
                            author = random.choice(users),
                            content = markov.generate_markov_text(15),
                            comment = video_comment,
                        )
                        reply_comment.save()
            vid_file.close()

        self.stdout.write(self.style.SUCCESS('Videos successfully created'))
