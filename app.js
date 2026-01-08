fetch("background.mp4")
  .then(res => res.blob())
  .then(blob => {
    const dbReq = indexedDB.open("offlineVideos", 1);
    dbReq.onupgradeneeded = e => e.target.result.createObjectStore("videos");
    dbReq.onsuccess = e => {
      const tx = e.target.result.transaction("videos", "readwrite");
      tx.objectStore("videos").put(blob, "background");
      console.log("Video saved to IndexedDB");
    };
  });

function loadVideoFromDB() {
  const dbReq = indexedDB.open("offlineVideos", 1);
  dbReq.onsuccess = e => {
    const tx = e.target.result.transaction("videos", "readonly");
    const store = tx.objectStore("videos");
    store.get("background").onsuccess = ev => {
      const blob = ev.target.result;
      if (blob) {
        document.querySelector("video").src = URL.createObjectURL(blob);
        console.log("Video loaded from IndexedDB");
      }
    };
  };
}

window.addEventListener("DOMContentLoaded", loadVideoFromDB);
