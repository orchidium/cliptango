// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  collection,
  deleteDoc,
  deleteField,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import {
  getStorage,
  uploadString,
  deleteObject,
  listAll,
  getDownloadURL,
  ref,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuUDH9IFazrQC0-09LpdgGc_kr246VShg",
  authDomain: "orchid-f39a9.firebaseapp.com",
  projectId: "orchid-f39a9",
  storageBucket: "orchid-f39a9.appspot.com",
  messagingSenderId: "486189992784",
  appId: "1:486189992784:web:00481e697a3525bc2d3a55",
  measurementId: "G-VSQHXGH6Y8",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// A formatted version of a popular md5 implementation.
// Original copyright (c) Paul Johnston & Greg Holt.
// The function itself is now 42 lines long.
function MD5(inputString) {
  var hc = "0123456789abcdef";
  function rh(n) {
    var j,
      s = "";
    for (j = 0; j <= 3; j++)
      s +=
        hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
    return s;
  }
  function ad(x, y) {
    var l = (x & 0xffff) + (y & 0xffff);
    var m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }
  function rl(n, c) {
    return (n << c) | (n >>> (32 - c));
  }
  function cm(q, a, b, x, s, t) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cm((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cm((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cm(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cm(c ^ (b | ~d), a, b, x, s, t);
  }
  function sb(x) {
    var i;
    var nblk = ((x.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++) blks[i] = 0;
    for (i = 0; i < x.length; i++)
      blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = x.length * 8;
    return blks;
  }
  var i,
    x = sb(inputString),
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878,
    olda,
    oldb,
    oldc,
    oldd;
  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, olda);
    b = ad(b, oldb);
    c = ad(c, oldc);
    d = ad(d, oldd);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

var OrchidServices = {
  _generateUUID: function os__generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  },

  DEBUG:
    location.href === "http://localhost:5500" ||
    location.href === "http://127.0.0.1:5500/",

  init: function os_init() {
    window.addEventListener("load", () => {
      if (this.isUserLoggedIn) {
        this.set("profile/" + this.userId(), {
          last_active: Date.now(),
          state: "online",
        });
      }
    });

    window.addEventListener("beforeunload", () => {
      if (this.isUserLoggedIn) {
        this.set("profile/" + this.userId(), {
          last_active: Date.now(),
          state: "offline",
        });
      }
    });

    OrchidServices.get("profile/" + OrchidServices.userId()).then((data) => {
      data.followers.forEach((follower) => {
        ["webstore", "articles"].forEach((platform) => {
          const doc = collection(db, platform);
          onSnapshot(doc, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                if (this.DEBUG) {
                  console.log("New item: ", change.doc.data());
                }

                if (change.doc.data().author_id !== follower) {
                  return;
                }
                OrchidServices.get("profile/" + follower).then((data) => {
                  if (!(change.doc.data().published_at >= data.last_active)) {
                    return;
                  }

                  OrchidServices.notify(
                    data.username,
                    change.doc.data().content,
                    data.profile_picture
                  );
                });
              }
              if (change.type === "modified") {
                if (this.DEBUG) {
                  console.log("Modified item: ", change.doc.data());
                }
              }
              if (change.type === "removed") {
                if (this.DEBUG) {
                  console.log("Removed item: ", change.doc.data());
                }
              }
            });
          });
        });
      });
    });
  },

  /**
   * Tells us if the user is logged in or not through the token.
   * @returns {boolean}
   */
  isUserLoggedIn: function os_isUserLoggedIn() {
    var data = localStorage.hasOwnProperty("ws.login.userId");
    return data;
  },

  userId: function os_userId() {
    return localStorage.getItem("ws.login.userId");
  },

  /**
   * Gets data from specified database path and returns it.
   * @param {string} path
   * @returns {object}
   */
  get: async function os_get(path) {
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (this.DEBUG) {
        console.log("Document data: ", docSnap.data());
      }
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      if (this.DEBUG) {
        console.log("No such document!");
      }
    }
  },

  /**
   * Gets data everytime it detects a change from specified database path and returns it and re-executes your callback code.
   * @param {string} path
   * @param {function} callback
   */
  getWithUpdate: function os_getWithUpdate(path, callback) {
    onSnapshot(doc(db, path), (doc) => {
      if (this.DEBUG) {
        console.log("Document data: ", doc.data());
      }
      callback(doc.data());
    });
  },

  /**
   * Gets a data array from specified database collection and returns it with a callback.
   * @param {string} path
   * @param {function} callback
   * @returns {object}
   */
  getList: async function os_getList(path, callback) {
    const querySnapshot = await getDocs(collection(db, path));
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (this.DEBUG) {
        console.log(doc.id, " => ", doc.data());
      }
      callback(doc.id, doc.data());
    });
  },

  /**
   * Gets a data array from specified database collection and returns it with a callback but ordered by rating.
   * @param {string} path
   * @param {function} callback
   * @returns {object}
   */
  getContent: async function os_getContent(path, callback) {
    const querySnapshot = await getDocs(collection(db, path));

    var array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (this.DEBUG) {
        console.log(doc.id, " => ", doc.data());
      }
      array.push([doc.id, doc.data()]);
    });

    setTimeout(() => {
      array.sort((a, b) => {
        if (b[1].likes < a[1].likes) return -1;
        if (b[1].likes > a[1].likes) return 1;
        if (b[1].dislikes < a[1].dislikes) return 1;
        if (b[1].dislikes > a[1].dislikes) return -1;
        return 0;
      });
      array.forEach((item) => {
        callback(item[0], item[1]);
      });
    }, 100);
  },

  /**
   * Sets data to the specified path and merging with the old data.
   * @param {string} path
   * @param {object} value
   */
  set: function os_set(path, value) {
    const docRef = doc(db, path);
    setDoc(docRef, value, { merge: true });
  },

  /**
   * Removes data in the specified path.
   * @param {string} path
   * @param {object} value
   */

  remove: async function os_remove(path) {
    const docRef = doc(db, path);
    await deleteDoc(docRef);
  },

  removeField: deleteField,

  storage: {
    /**
     * Reads a storage file using a path.
     * @param {string} path
     * @param {string} blob
     */
    read: function os_storage_read(path) {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        getDownloadURL(storageRef)
          .then((url) => resolve(url))
          .catch((error) => reject(error));
      });
    },

    /**
     * Writes a storage file using a blob and a path.
     * @param {string} path
     * @param {string} blob
     */
    write: function os_storage_write(path, blob) {
      const storageRef = ref(storage, path);

      // 'blob' comes from the Blob or File API
      uploadString(storageRef, blob, "data_url").then((snapshot) => {
        if (this.DEBUG) {
          console.log("Uploaded a blob or file!");
        }
      });
    },

    /**
     * Removes a storage file using it's path.
     * @param {string} path
     */
    remove: function os_storage_remove(path) {
      // Create a reference to the file to delete
      const storageRef = ref(storage, path);
      // Delete the file
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          if (this.DEBUG) {
            console.log(error);
          }
        });
    },

    /**
     * Lists storage files using the specified path to where it's going to list files.
     * @param {string} path
     */
    list: function os_storage_list(path) {
      const listRef = ref(storage, "files/uid");

      // Find all the prefixes and items.
      listAll(listRef)
        .then((res) => {
          res.prefixes.forEach((folderRef) => {
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
          });
          res.items.forEach((itemRef) => {
            // All the items under listRef.
          });
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
    },
  },

  auth: {
    login: function os_auth_login(username, password) {
      OrchidServices.getList("profile", (id, user) => {
        if (
          user.username == username ||
          user.email == username ||
          user.phone_number == username
        ) {
          if (user.password == MD5(password)) {
            OrchidServices.auth.loginWithToken(user.token);
          } else {
            if (this.DEBUG) {
              console.error("[" + user.token + "] Password does not match.");
            }
          }
        } else {
          if (this.DEBUG) {
            console.error("[" + user.token + "] User does not exist");
          }
        }
      });
    },

    /**
     * Logs in using a specified existing user token.
     * @param {string} token
     */
    loginWithToken: function os_auth_loginWithToken(token) {
      localStorage.setItem("ws.login.userId", token);
    },

    /**
     * Helps create a user account easily for you.
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {string} birthDate
     */
    signUp: async function os_auth_signUp(
      username,
      email,
      password,
      birthDate
    ) {
      var token = OrchidServices._generateUUID();
      OrchidServices.set("profile/" + token, {
        username: username,
        email: email,
        password: MD5(password),
        profile_picture: "",
        phone_number: "",
        birth_date: birthDate,
        token: token,
        custom_badges: [],
        description: "",
        orchid_points: 0,
        time_created: Date.now(),
        last_active: Date.now(),
        state: "online",
        notifications: [],
        browser_bookmarks: [],
        devices: [],
        achievements: [],
        wallpaper: "",
        accent_color: "",
        dark_mode: false,
        installed_apps: [],
        is_verified: false,
        is_moderator: false,
        is_developer: false,
        last_search: "",
        last_visited_site: "",
      });
      localStorage.setItem("ws.login.userId", token);

      if (this.DEBUG) {
        console.log("Added document with ID: ", token);
      }
    },
  },

  authUi: function os_authUi() {},

  notify: function os_notify(title, body, icon) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(name, {
        icon: icon,
        body: body,
      });
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(name, {
            icon: icon,
            body: body,
          });
          // …
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  },

  custom: {
    createStoreApp: async function os_createStoreApp(data) {
      var id = OrchidServices._generateUUID();
      OrchidServices.set("webstore/" + id, {
        token: id,
        author_id: OrchidServices.userId(),
        teaser_url: data.teaser_url,
        published_at: Date.now(),
        icon: data.icon,
        name: data.name,
        description: data.description,
        screenshots: data.screenshots,
        download: data.download,
        has_ads: data.has_ads,
        has_tracking: data.has_tracking,
        categories: data.categories,
        tags: data.tags,
        age_rating: data.age_rating,
        price: data.price,
        comments: [],
      });
    },

    publishArticle: async function os_publishArticle(data) {
      var id = OrchidServices._generateUUID();
      OrchidServices.set("articles/" + id, {
        token: id,
        author_id: OrchidServices.userId(),
        published_at: Date.now(),
        content: data.content,
        tags: data.tags,
        images: data.images,
        likes: [],
        dislikes: [],
        comments: [],
      });
    },

    createChatGroup: async function os_createChatGroup(title, avatar) {
      var token = OrchidServices._generateUUID();
      OrchidServices.set("chat_groups/" + token, {
        token: token,
        published_at: Date.now(),
        owner: OrchidServices.userId(),
        name: title,
        icon: avatar,
        roles: [],
        messages: {},
        channels: [
          {
            name: "Chatting",
            rooms: [
              {
                type: "text",
                name: "General",
              },
              {
                type: "text",
                name: "Off Topic",
              },
            ],
          },
          {
            name: "Talking",
            rooms: [
              {
                type: "voice",
                name: "Voice Chat",
              },
            ],
          },
        ],
      });
      OrchidServices.set("profile/" + OrchidServices.userId(), {
        chat_groups: { [token]: "" },
      });
    },

    uploadVideo: async function os_uploadVideo(data) {
      var id = OrchidServices._generateUUID();
      OrchidServices.storage.write("videos/" + id, data.video);
      OrchidServices.storage.write("video_thumbnails/" + id, data.thumbnail);
      OrchidServices.set("videos/" + id, {
        token: id,
        author_id: OrchidServices.userId(),
        published_at: Date.now(),
        video: "videos/" + id,
        thumbnail: "video_thumbnails/" + id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        likes: [],
        dislikes: [],
        views: [],
        comments: [],
      });
    },
  },
};

OrchidServices.init();
window.OrchidServices = OrchidServices;
