const NodeMediaServer = require('node-media-server');
const CronJob = require('cron').CronJob;
const spawn = require('child_process').spawn;
const request = require('request');
const { Client } = require('pg');

const generateStreamThumbnail = (stream_key) => {
  const args = [
    '-y',
    '-i',
    'http://127.0.0.1:8001/live/' + stream_key + '/index.m3u8',
    '-ss',
    '00:00:01',
    '-vframes',
    '1',
    '-vf',
    'scale=1920:1080',
    'media/uploads/live/' + stream_key + '/thumbnail.png',
  ];

  spawn('/usr/bin/ffmpeg', args, {
    detached: true,
    stdio: 'ignore',
  }).unref();
};

const thumbnailJob = new CronJob(
  '*/5 * * * * *',
  () => {
    request.get(
      'http://127.0.0.1:8001/api/streams',
      (error, response, body) => {
        let streams = JSON.parse(body);

        if (typeof (streams['live'] !== undefined)) {
          let live_streams = streams['live'];

          for (let stream in live_streams) {
            if (!live_streams.hasOwnProperty(stream)) continue;
            generateStreamThumbnail(stream);
          }
        }
      }
    );
  },
  null,
  true
);

const config = {
  // logType: 1,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8001,
    allow_origin: '*',
    mediaroot: 'media/uploads',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
      {
        app: 'live',
        mp4: true,
        mp4Flags: '[movflags=frag_keyframe+empty_moov]',
      },
    ],
  },
  // auth: {
  //   // play: true,
  //   publish: true,
  //   secret: 'rmog)tpnscdo&njt)r@9!r)&)j4jzmr^!&^t&k6sw*tzeiw5^x',
  // },
};

const getStreamKeyFromStreamPath = (path) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

const nms = new NodeMediaServer(config);

try {
  nms.run();
  thumbnailJob.start();
  client.connect();
} catch (e) {
  console.log(e);
}

nms.on('prePublish', (id, StreamPath, args) => {
  const stream_key = getStreamKeyFromStreamPath(StreamPath);
  const session = nms.getSession(id);

  client.query('select stream_key from auth_user where stream_key = $1', [stream_key], (err, res) => {
    if (err) {
      console.error(err.stack);
      session.reject();
    }

    if (!res.rows) {
      session.reject();
    }
  });
});
