import { ref, get, set, push, child, remove, update } from 'firebase/database'
import { db } from '../lib/firebase/config/firebaseInit'
import { createStore, removeFromStore } from './store'

let observers = []

export const subscribe = fn => observers.push(fn)
export const notify = data => observers.forEach(observer => observer(data))

export async function getToDoData() {
  const dbRef = ref(db, 'todos')
  const response = await get(dbRef)

  let payload = await response.val()
  payload = payload['todos']
  payload = Object.entries(payload).map(([uid, obj]) => ({ ...obj, uid: uid }))

  if (await createStore(payload)) notify(payload)
}

export function deleteTodo(uid) {
  const dbRef = ref(db, `/todos/todos/${uid}`)
  remove(dbRef)
  const store = removeFromStore(uid)
  notify(store)
}
