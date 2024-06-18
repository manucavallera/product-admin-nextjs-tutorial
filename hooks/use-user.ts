"use client";

import { getFromLocalStorage } from "@/actions/get-from-localstorage";
import { setInLocalStorage } from "@/actions/set-in-localstorage";
import { User } from "@/interfaces/user.interfaces";
import { auth, getDocument } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hook para manejar el usuario autenticado
export const useUser = () => {
  const [user, setUser] = useState<User | DocumentData | undefined>(undefined);

  // Ruta actual
  const pathName = usePathname();

  // Router para redirigir a otras rutas
  const router = useRouter();

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/dashboard"];

  // Verificar si la ruta actual es una ruta protegida
  const isInProtectedRoute = protectedRoutes.includes(pathName);

  // Función para obtener el usuario de la base de datos
  const getUserFromDB = async (uid: string) => {
    const path = `users/${uid}`;

    try {
      const res = await getDocument(path);
      setUser(res);
      setInLocalStorage("user", res);
    } catch (error) {
      console.log(error);
    }
  };

  // Efecto para escuchar cambios en el estado de autenticación
  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      // Si hay un usuario autenticado
      if (authUser) {
        // Verificar si el usuario ya está en el almacenamiento local
        const userInLocal = getFromLocalStorage("user");

        if (userInLocal) {
          // Si ya está, actualizar el estado del usuario
          setUser(userInLocal);
        } else {
          // Si no está, obtener el usuario de la base de datos
          getUserFromDB(authUser.uid);
        }
      } else {
        // Si no hay usuario autenticado y se está en una ruta protegida, redirigir a la ruta de inicio
        if (isInProtectedRoute) {
          router.push("/");
        }
      }
    });
  }, []);

  // Devolver el usuario autenticado
  return user;
};