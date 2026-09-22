const FB_CONFIG = {
  apiKey:            'AIzaSyC2oVw6iOjFwOBxHQp3oGip44woWRcdnbs',
  authDomain:        'stylos-e0502.firebaseapp.com',
  projectId:         'stylos-e0502',
  storageBucket:     'stylos-e0502.firebasestorage.app',
  messagingSenderId: '175066466039',
  appId:             '1:175066466039:web:5f0e2043bbe2e8691bf5f2'
};

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';

const FB_READY = !!FB_CONFIG.projectId && /^AIza[\w-]{35}$/.test(FB_CONFIG.apiKey || '');

window.__FB = { config: FB_CONFIG, sdk: SDK, ready: FB_READY };

(async function () {
  if (!FB_READY) {
    window.__copyDone(null);
    return;
  }
  try {

    const [app, fs] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-firestore-lite.js')
    ]);
    const db = fs.getFirestore(app.initializeApp(FB_CONFIG));

    const [rooms, works, site] = await Promise.all([
      fs.getDocs(fs.collection(db, 'rooms')),
      fs.getDocs(fs.collection(db, 'works')),
      fs.getDocs(fs.collection(db, 'site'))
    ]);

    const out = { rooms: {}, site: {}, works: [] };
    rooms.forEach(d => { out.rooms[d.id] = d.data(); });
    site.forEach(d => { out.site[d.id] = d.data(); });
    works.forEach(d => { out.works.push(Object.assign({ id: d.id }, d.data())); });

    window.__copyDone(out);
  } catch (err) {

    console.warn('[stylos] copy: falling back to the seed —', err && err.message);
    window.__copyDone(null);
  }
})();
