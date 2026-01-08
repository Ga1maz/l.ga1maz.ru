function saveVideoToDB() {
  const dbReq = indexedDB.open("offlineVideos", 1);

  dbReq.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos");
      console.log("Object store created");
    }
  };

  dbReq.onsuccess = (e) => {
    const db = e.target.result;

    const tx = db.transaction("videos", "readwrite");
    const store = tx.objectStore("videos");

    fetch("background.mp4")
      .then(res => res.blob())
      .then(blob => {
        store.put(blob, "background");
        console.log("Video saved to IndexedDB");
      });

    tx.oncomplete = () => db.close();
  };

  dbReq.onerror = (e) => {
    console.error("DB error:", e.target.error);
  };
}

function loadVideoFromDB() {
  const dbReq = indexedDB.open("offlineVideos", 1);

  dbReq.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos");
    }
  };

  dbReq.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("videos", "readonly");
    const store = tx.objectStore("videos");

    store.get("background").onsuccess = (ev) => {
      const blob = ev.target.result;
      if (blob) {
        const videoEl = document.querySelector("video");
        videoEl.src = URL.createObjectURL(blob);
        console.log("Video loaded from IndexedDB");
      }
    };

    tx.oncomplete = () => db.close();
  };
}

window.addEventListener("DOMContentLoaded", () => {
  saveVideoToDB();
  loadVideoFromDB();
});
