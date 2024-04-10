import { clsx, type ClassValue } from "clsx"
import { Sonsie_One } from "next/font/google";
import { twMerge } from "tailwind-merge"
import { UserDetails } from "./types";
import { json } from "stream/consumers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setCookie(name: string, value: string, maxAgeSeconds = 0, path = '/') {
  const expirationDate = new Date(Date.now() + maxAgeSeconds * 1000);
  // const expires = maxAgeSeconds === 0 ? '' : `Expires=${expirationDate.toUTCString()}; `;
  // const cookieString = `${name}=${encodeURIComponent(value)}; ${expires}Max-Age=${maxAgeSeconds}; Path=${path}; HttpOnly;`;
  const maxAgeAttr = maxAgeSeconds !== 0 ? ` Max-Age=${maxAgeSeconds};` : '';
  const pathAttr = path !== '/' ? ` Path=${path};` : '';
  const cookieString = `${name}=${encodeURIComponent(value)};${maxAgeAttr}${pathAttr}`;
  document.cookie = cookieString;
}

export function getCookie(name: string) {
  console.log("getCookie()")
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
}

export const getTokensFromCookies = () => {
  return { token: getCookie("token"), refreshToken: getCookie("refreshToken") };
}

export const setTokensAsCookies = (token: string, refreshToken: string) => {
  console.log("setTokensAsCookies()")
  setCookie("token", token);
  setCookie("refreshToken", refreshToken);
}

export const clearUserSessionCookie = () => {
  document.cookie = "token='';";
}

const setSessionItem = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
}

export const setLoginDataToSession = (token: string, refreshToken: string, userDetails: UserDetails) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("refreshToken", refreshToken);
  sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
}

export const getLoginDataFromSession = () => {
  const userDetails = sessionStorage.getItem("userDetails");
  return {
    token: sessionStorage.getItem("token"),
    refreshToken: sessionStorage.getItem("refreshToken"),
    userDetails: userDetails ? JSON.parse(userDetails) : userDetails
  };
}

export const removeLoginDataFromSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("userDetails");
}

export const validationRegex = () => {
  return {
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    characterOneWord: /[\p{Letter}\p{Mark}]+/u,
    characterMultiWord: /[\p{Letter}\p{Mark}\s]+/u,
    twoWordsRegex: /[\p{Letter}\p{Mark}]+ [\p{Letter}\p{Mark}]+/u,
    cityCodeRegex: /\d{2}( ?- ?)\d{3}/,
    houseNumberRegex: /^\d+([a-zA-Z])?([/\\\-]\d+([a-zA-Z])?)?$/,
    polishPhoneNumberRegex: /^(\+\d{2} ?)?\d{3}[ \-]?\d{3}[ \-]?\d{3}$/,
  }
}
