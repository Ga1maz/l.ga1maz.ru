async function cacheVideo() {
  const cache = await caches.open('video-cache-v1');
  await cache.add('background.mp4');
  console.log("Видео в кэше!");
}
