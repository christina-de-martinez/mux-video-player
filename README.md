# The most unhinged, Byzantine, devious, unusual video player you could imagine.

This is my entry to the [CodeTV + Mux challenge](https://codetv.dev/blog/web-dev-challenge-hackathon-s2e3-devious-video-player-mux).

See it here: [https://christinas-mux-video-player.vercel.app/](https://christinas-mux-video-player.vercel.app/)

## Inspiration - 🤝 Group Project: because sharing is caring 🤝

Some of my fondest memories from school were group projects, where famously, everyone shared the load equally and I was not stuck doing someone else’s slides at 2am the night before the presentation.

With this project, I wanted to encapsulate that group project energy. I used websockets to make every setting global, because sharing is caring. If you pause the video, we all pause. If you watch the video at full volume in a public space, we’re all watching it at full volume right there with ya.

There are a few additional niceties here.

First is playback rate. We had a dilemma here. A point on the earth spins faster at the equator, and slower the farther North or South you get. To solve this problem, I adjusted the playback rate to be a global average value based on the latitude of all connected users. To influence this value, move to a different latitude.

To set the volume, you need to make a noise inversely proportional to the volume you want. So, a loud sound produces a quiet volume setting. For example, if you're in a library and you'd like a quiet volume to match the environment, you must scream. This value is also shared between all users.

With this video player, the efforts of one affect the experience of all. I hope this allows you to revisit the feeling of resting in confidence that 33% of your final grade is in the hands of Brad from the lacrosse team.
