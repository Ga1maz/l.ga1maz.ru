function openDB(callback) {
  const request = indexedDB.open("offlineVideos", 2);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos");
      console.log("Object store created");
    }
  };

  request.onsuccess = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      console.error("Object store 'videos' not found!");
      db.close();
      return;
    }
    callback(db);
  };

  request.onerror = (e) => {
    console.error("IndexedDB error:", e.target.error);
  };
}

function saveVideo() {
  openDB(db => {
    fetch("background.mp4")
      .then(res => res.blob())
      .then(blob => {
        const tx = db.transaction("videos", "readwrite");
        tx.objectStore("videos").put(blob, "background");
        tx.oncomplete = () => db.close();
        console.log("Video saved in IndexedDB");
      });
  });
}

function loadVideo() {
  openDB(db => {
    const tx = db.transaction("videos", "readonly");
    const store = tx.objectStore("videos");
    store.get("background").onsuccess = ev => {
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
