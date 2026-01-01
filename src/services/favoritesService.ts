import { db } from "../firebase/firebase";
import type { Movie } from "../types/movie";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

function favDoc(uid: string, movieId: number) {
  return doc(db, "users", uid, "favorites", String(movieId));
}

export async function addFavorite(uid: string, movie: Movie) {
  await setDoc(
    favDoc(uid, movie.id),
    {
      movie,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function removeFavorite(uid: string, movieId: number) {
  await deleteDoc(favDoc(uid, movieId));
}

export async function getFavorites(uid: string): Promise<Movie[]> {
  const snap = await getDocs(collection(db, "users", uid, "favorites"));

  return snap.docs
    .map((d) => (d.data() as any)?.movie as Movie | undefined)
    .filter(Boolean) as Movie[];
}
