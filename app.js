function initDB(callback) {
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
    callback(db);
  };

  dbReq.onerror = (e) => {
    console.error("DB error:", e.target.error);
  };
}

function saveVideo() {
  initDB(db => {
    fetch("background.mp4")
      .then(res => res.blob())
      .then(blob => {
        const tx = db.transaction("videos", "readwrite");
        tx.objectStore("videos").put(blob, "background");
        tx.oncomplete = () => {
          db.close();
          console.log("Video saved to IndexedDB");
        };
      });
  });
}

function loadVideo() {
  initDB(db => {
    const tx = db.transaction("videos", "readonly");
    const store = tx.objectStore("videos");
    store.get("background").onsuccess = (ev) => {
      const blob = ev.target.result;
      if (blob) {
        document.querySelector("video").src = URL.createObjectURL(blob);
        console.log("Video loaded from IndexedDB");
      }
    };
    tx.oncomplete = () => db.close();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  saveVideo();
  loadVideo();
});
