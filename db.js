/* Mon Équilibre : IndexedDB séparé des autres PWA. N'incrémenter DB_VERSION qu'en cas de migration de schéma. */
const ME_DB = (()=>{
'use strict';
const NAME='mon-equilibre-db', DB_VERSION=1, STORES=['weights','goals','events','notes','preferences'];
let connection;
function open(){if(connection)return Promise.resolve(connection);return new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,DB_VERSION);r.onupgradeneeded=()=>{const db=r.result;for(const name of STORES)if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'});};r.onsuccess=()=>{connection=r.result;connection.onversionchange=()=>{connection.close();connection=null;};resolve(connection)};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Fermez les autres onglets de cette application.'));});}
async function all(store){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(store,'readonly').objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function put(store,item){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(item);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function remove(store,id){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function replace(snapshot){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORES,'readwrite');for(const store of STORES){const s=tx.objectStore(store);s.clear();for(const item of snapshot[store])s.put(item);}tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function mergeHistory(additions){const db=await open();return new Promise((resolve,reject)=>{const names=['weights','goals','events','notes'];const tx=db.transaction(names,'readwrite');for(const store of names)for(const item of additions[store])tx.objectStore(store).add(item);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function snapshot(){const out={};for(const s of STORES)out[s]=await all(s);return out;}
return {STORES,open,all,put,remove,replace,mergeHistory,snapshot};})();
